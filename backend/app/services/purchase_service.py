import logging
from typing import Dict, Any
from fastapi import Request

from app.schemas.purchase_schemas import PurchaseCreateRequest, PurchaseCreateResponse
from app.models.purchase_model import PurchaseModel
from app.models.audit_model import AuditLogModel
from app.repositories.purchase_repository import PurchaseRepository
from app.repositories.audit_repository import AuditRepository
from app.core.security import generate_purchase_id
from app.core.exceptions import ValidationError
from app.config.pricing import get_plan_amount, PRICING_CONFIG

logger = logging.getLogger("purchases")

class PurchaseService:
    def __init__(self):
        self.purchase_repo = PurchaseRepository()
        self.audit_repo = AuditRepository()

    async def create_purchase(self, req: PurchaseCreateRequest, request: Request) -> PurchaseCreateResponse:
        # Calculate amount
        original_amount_pkr = get_plan_amount(req.product.value, req.plan_key)
        final_amount_pkr = original_amount_pkr
        discount_applied_pkr = 0
        discount_percentage = None
        applied_affiliate_code = None
        
        # Affiliate validation & discount
        if req.affiliate_code:
            from app.db.mongodb import get_db
            db = get_db()
            affiliate = await db["affiliates"].find_one({
                "code": req.affiliate_code,
                "product": req.product.value,
                "is_active": True
            })
            if affiliate:
                discount_percentage = affiliate.get("discount_percentage", 15)
                discount_applied_pkr = int(original_amount_pkr * (discount_percentage / 100))
                final_amount_pkr = original_amount_pkr - discount_applied_pkr
                applied_affiliate_code = req.affiliate_code
                
                # Increment usage count
                await db["affiliates"].update_one(
                    {"_id": affiliate["_id"]},
                    {"$inc": {"usage_count": 1}}
                )
        
        # Initial status
        status = "PENDING"
        if final_amount_pkr == 0:
            status = "PAID" # Direct transition for free plans
            
        purchase_id = generate_purchase_id()
        
        # Client IP and UA
        client_ip = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
        req_id = getattr(request.state, "request_id", None)
        
        # Create model (amount_pkr must be the final payable amount for AssanPay)
        purchase_model = PurchaseModel(
            purchase_id=purchase_id,
            product=req.product.value,
            plan_key=req.plan_key,
            status=status,
            customer=req.customer.model_dump(),
            product_data=req.product_data.model_dump(),
            amount_pkr=final_amount_pkr,
            original_amount_pkr=original_amount_pkr,
            final_amount_pkr=final_amount_pkr,
            discount_applied_pkr=discount_applied_pkr,
            discount_percentage=discount_percentage,
            affiliate_code=applied_affiliate_code,
            ip_address=client_ip,
            user_agent=user_agent
        )
        
        await self.purchase_repo.create(purchase_model)
        logger.info(f"purchases.created | purchase_id={purchase_id} product={req.product.value} plan={req.plan_key} final_amount={final_amount_pkr} status={status}")
        
        # Audit log
        audit = AuditLogModel(
            event="PURCHASE_CREATED",
            purchase_id=purchase_id,
            product=req.product.value,
            plan_key=req.plan_key,
            amount_pkr=final_amount_pkr,
            ip_address=client_ip,
            request_id=req_id,
            metadata={
                "status": status,
                "affiliate_code": applied_affiliate_code,
                "discount_applied_pkr": discount_applied_pkr
            }
        )
        await self.audit_repo.write(audit)
        
        plan_label = PRICING_CONFIG[req.product.value][req.plan_key]["label"]
        
        return PurchaseCreateResponse(
            purchase_id=purchase_id,
            product=req.product,
            plan_key=req.plan_key,
            plan_label=plan_label,
            amount_pkr=final_amount_pkr,
            status=status,
            affiliate_code=applied_affiliate_code,
            discount_applied_pkr=discount_applied_pkr,
            final_amount_pkr=final_amount_pkr
        )
