import logging
import httpx
from typing import Dict, Any, Tuple
from app.core.config import settings
from app.core.exceptions import AssanPayRequestError, AssanPayVerificationError, AssanPayDuplicateOrderError
from app.core.security import generate_assanpay_order_id

logger = logging.getLogger("assanpay")

class AssanPayService:
    def __init__(self):
        self.base_url = settings.ASSANPAY_BASE_URL.rstrip("/")
        self.merchant_id = settings.ASSANPAY_MERCHANT_ID
        
        # Assumption: API Key and Branch Code are sent in headers as per standard practice,
        # but this needs confirmation when real credentials arrive.
        self.headers = {
            "Content-Type": "application/json",
            "X-API-Key": settings.ASSANPAY_API_KEY,
            "X-Branch-Code": settings.ASSANPAY_BRANCH_CODE
        }
        
    async def create_payment(self, amount_pkr: int, return_url: str, product: str) -> Tuple[str, str, str]:
        """
        Calls AssanPay POST /payment-request/{merchantId}.
        Returns (assanpay_order_id, assanpay_transaction_id, complete_link).
        """
        assanpay_order_id = generate_assanpay_order_id(product)
        
        if settings.ASSANPAY_MOCK:
            logger.info(f"assanpay.mock_create | order_id={assanpay_order_id}")
            return (
                assanpay_order_id,
                f"T_MOCK_{assanpay_order_id}",
                f"{settings.ALLOWED_ORIGINS.split(',')[0]}/mock-payment?order_id={assanpay_order_id}"
            )
            
        url = f"{self.base_url}/payment-request/{self.merchant_id}"
        payload = {
            "amount": str(amount_pkr),
            "store_name": settings.ASSANPAY_STORE_NAME,
            "order_id": assanpay_order_id,
            "link": return_url
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload, headers=self.headers)
        except httpx.RequestError as e:
            logger.error(f"assanpay.request_failed | operation=create reason={type(e).__name__}")
            raise AssanPayRequestError("Network error calling AssanPay") from e

        if response.status_code >= 500:
            logger.error(f"assanpay.server_error | operation=create status={response.status_code}")
            raise AssanPayRequestError(f"AssanPay returned {response.status_code}")

        try:
            data = response.json()
        except ValueError:
            logger.error(f"assanpay.bad_json | operation=create")
            raise AssanPayVerificationError("AssanPay returned invalid JSON")
            
        # Check duplicate order response (HTTP 200)
        if data.get("message") == "Order Id already exists":
            raise AssanPayDuplicateOrderError(f"Order ID {assanpay_order_id} exists")

        # Check success
        if str(data.get("status")).lower() != "true":
            logger.error(f"assanpay.create_failed | operation=create status_field={data.get('status')}")
            raise AssanPayVerificationError("AssanPay create failed")

        inner_data = data.get("data", {})
        txn_id = inner_data.get("transactionId")
        complete_link = inner_data.get("completeLink")
        
        if not txn_id or not complete_link:
            raise AssanPayVerificationError("Missing transactionId or completeLink in response")
            
        return assanpay_order_id, txn_id, complete_link

    async def verify_payment(self, order_id: str) -> str:
        """
        Calls AssanPay GET /payment/all-inquiry/{merchantId}?transactionId={order_id}
        Returns the raw status (e.g., "Pending", "Success", "Failed").
        """
        if settings.ASSANPAY_MOCK:
            raw = settings.ASSANPAY_MOCK_RESULT.capitalize()
            logger.info(f"assanpay.mock_verify | order_id={order_id} raw_status={raw}")
            return raw

        url = f"{self.base_url}/payment/all-inquiry/{self.merchant_id}"
        params = {"transactionId": order_id}
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params, headers=self.headers)
        except httpx.RequestError as e:
            logger.error(f"assanpay.request_failed | operation=verify reason={type(e).__name__}")
            raise AssanPayRequestError("Network error calling AssanPay") from e

        if response.status_code != 200:
            logger.error(f"assanpay.bad_response | operation=verify status={response.status_code}")
            raise AssanPayRequestError(f"AssanPay returned {response.status_code}")

        try:
            data = response.json()
        except ValueError:
            logger.error(f"assanpay.bad_json | operation=verify")
            raise AssanPayVerificationError("AssanPay returned invalid JSON")

        if str(data.get("status")).lower() != "true":
            logger.error(f"assanpay.verify_failed | operation=verify data={data}")
            raise AssanPayVerificationError("AssanPay verify status false")

        inner_data = data.get("data", {})
        
        # Handle the typo confirmed in docs
        raw_status = inner_data.get("transactionStaus") or inner_data.get("transactionStatus")
        
        if not raw_status:
            logger.error(f"assanpay.missing_status | operation=verify")
            raise AssanPayVerificationError("Missing status field in response")
            
        return str(raw_status)
