import logging
from typing import Optional, Tuple
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession

from app.db.mongodb import get_client, get_db, supports_transactions
from app.core.exceptions import (
    InvalidStateTransitionError,
    PurchaseNotFoundError,
    DuplicatePaymentError,
    MaxPaymentAttemptsError,
    AssanPayRequestError,
    AssanPayVerificationError,
    AssanPayDuplicateOrderError
)
from app.core.security import generate_payment_id
from app.config.pricing import MAX_PAYMENT_ATTEMPTS
from app.models.payment_model import PaymentModel
from app.models.audit_model import AuditLogModel
from app.repositories.purchase_repository import PurchaseRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.audit_repository import AuditRepository
from app.services.assanpay_service import AssanPayService
from app.services.notification_service import NotificationService

logger = logging.getLogger("payments")

class PaymentService:
    def __init__(self):
        self.purchase_repo = PurchaseRepository()
        self.payment_repo = PaymentRepository()
        self.audit_repo = AuditRepository()
        self.assanpay_service = AssanPayService()
        self.notification_service = NotificationService()

    async def initiate_payment(self, purchase_id: str, return_url: str) -> PaymentModel:
        """
        Initiates a payment for a given purchase.
        """
        purchase = await self.purchase_repo.get_by_id(purchase_id)
        if not purchase:
            raise PurchaseNotFoundError(f"Purchase {purchase_id} not found")

        # 1. Check idempotency: If already PAYMENT_INITIATED, return existing payment link
        if purchase.status == "PAYMENT_INITIATED":
            existing_payment = await self.payment_repo.get_latest_for_purchase(purchase_id)
            if existing_payment and existing_payment.status == "INITIATED":
                logger.info(f"payment.idempotent_initiate | purchase_id={purchase_id}")
                return existing_payment

        # 2. State transition check
        if purchase.status not in ["PENDING", "FAILED"]:
            raise InvalidStateTransitionError(purchase.status, "PAYMENT_INITIATED", "purchase")

        if purchase.payment_attempts >= MAX_PAYMENT_ATTEMPTS:
            # Mark abandoned
            await self.purchase_repo.update_status(purchase_id, "ABANDONED", purchase.status)
            raise MaxPaymentAttemptsError(f"Max attempts ({MAX_PAYMENT_ATTEMPTS}) reached")

        # 3. Call AssanPay
        try:
            order_id, txn_id, complete_link = await self.assanpay_service.create_payment(
                amount_pkr=purchase.amount_pkr,
                return_url=return_url,
                product=purchase.product
            )
        except AssanPayDuplicateOrderError:
            logger.error(f"payment.duplicate_order_id_from_assanpay | purchase_id={purchase_id}")
            raise # Should not happen with random generation, but handled

        # 4. Create Payment Model
        payment_id = generate_payment_id()
        payment = PaymentModel(
            payment_id=payment_id,
            purchase_id=purchase_id,
            product=purchase.product,
            plan_key=purchase.plan_key,
            amount_pkr=purchase.amount_pkr,
            assanpay_order_id=order_id,
            assanpay_transaction_id=txn_id,
            complete_link=complete_link,
            status="INITIATED"
        )
        await self.payment_repo.create(payment)
        
        # 5. Update Purchase
        await self.purchase_repo.update_status(purchase_id, "PAYMENT_INITIATED", purchase.status)
        await self.purchase_repo.increment_payment_attempts(purchase_id)
        
        # 6. Audit Log
        audit = AuditLogModel(
            event="PAYMENT_INITIATED",
            purchase_id=purchase_id,
            payment_id=payment_id,
            product=purchase.product,
            plan_key=purchase.plan_key,
            amount_pkr=purchase.amount_pkr
        )
        await self.audit_repo.write(audit)
        
        logger.info(f"payment.initiated | purchase_id={purchase_id} payment_id={payment_id}")
        return payment

    async def verify_payment(self, purchase_id: str) -> Tuple[str, Optional[str]]:
        """
        Polls AssanPay for status, safely updates DB.
        Returns (purchase_status, payment_status).
        """
        purchase = await self.purchase_repo.get_by_id(purchase_id)
        if not purchase:
            raise PurchaseNotFoundError("Purchase not found")
            
        payment = await self.payment_repo.get_latest_for_purchase(purchase_id)
        if not payment:
            return purchase.status, None

        if payment.status in ["SUCCESS", "FAILED", "ZERO_AMOUNT"]:
            # Terminal states, no need to call AssanPay
            return purchase.status, payment.status

        try:
            raw_status = await self.assanpay_service.verify_payment(payment.assanpay_order_id)
        except (AssanPayRequestError, AssanPayVerificationError) as e:
            # FAIL-CLOSED: Any error during verify means we stay pending
            logger.warning(f"payment.verify_error_staying_pending | payment_id={payment.payment_id} error={str(e)}")
            await self.payment_repo.add_verification_attempt(
                payment.payment_id, "PENDING_VERIFICATION", failure_reason=str(e)
            )
            return purchase.status, "PENDING_VERIFICATION"
        except Exception as e:
            logger.critical(f"payment.verify_unknown_error | payment_id={payment.payment_id} error={type(e).__name__}")
            await self.payment_repo.add_verification_attempt(
                payment.payment_id, "PENDING_VERIFICATION", failure_reason=f"Unknown: {type(e).__name__}"
            )
            return purchase.status, "PENDING_VERIFICATION"

        # Determine new status strictly
        if raw_status.lower() == "success":
            await self._handle_success(purchase, payment)
            return "PAID", "SUCCESS"
        elif raw_status.lower() == "failed":
            await self._handle_failure(purchase, payment, raw_status)
            return "FAILED", "FAILED"
        else:
            # Everything else (including "Pending") stays pending
            await self.payment_repo.add_verification_attempt(payment.payment_id, "PENDING_VERIFICATION", raw_status)
            return purchase.status, "PENDING_VERIFICATION"

    async def _handle_success(self, purchase, payment) -> None:
        if supports_transactions():
            client = get_client()
            session = await client.start_session()
            try:
                async with session.start_transaction():
                    updated = await self.payment_repo.set_verified_success(payment.payment_id, session=session)
                    if not updated:
                        return
                    await self.purchase_repo.update_status(purchase.purchase_id, "PAID", session=session)
                    audit = AuditLogModel(
                        event="PAYMENT_VERIFIED_SUCCESS",
                        purchase_id=purchase.purchase_id,
                        payment_id=payment.payment_id,
                        product=purchase.product,
                        plan_key=purchase.plan_key,
                        amount_pkr=purchase.amount_pkr
                    )
                    await self.audit_repo.write(audit, session=session)
            finally:
                await session.end_session()
        else:
            updated = await self.payment_repo.set_verified_success(payment.payment_id)
            if not updated:
                return
            await self.purchase_repo.update_status(purchase.purchase_id, "PAID")
            audit = AuditLogModel(
                event="PAYMENT_VERIFIED_SUCCESS",
                purchase_id=purchase.purchase_id,
                payment_id=payment.payment_id,
                product=purchase.product,
                plan_key=purchase.plan_key,
                amount_pkr=purchase.amount_pkr
            )
            await self.audit_repo.write(audit)
            
        logger.info(f"✅ [Payment Verified] SUCCESS | purchase_id={purchase.purchase_id} payment_id={payment.payment_id}")
        
        # Notification runs OUTSIDE transaction
        success = await self.notification_service.send_admin_email(purchase.model_dump(), purchase.amount_pkr)
        if success:
            await self.payment_repo.mark_notification_sent(payment.payment_id)
            await self.purchase_repo.mark_notification_sent(purchase.purchase_id)
            logger.info(f"📧 [Notification] Sent admin email for purchase {purchase.purchase_id}")

    async def _handle_failure(self, purchase, payment, raw_status: str) -> None:
        if supports_transactions():
            client = get_client()
            session = await client.start_session()
            try:
                async with session.start_transaction():
                    await self.payment_repo.add_verification_attempt(
                        payment.payment_id, "FAILED", raw_status, session=session
                    )
                    await self.purchase_repo.update_status(purchase.purchase_id, "FAILED", session=session)
                    audit = AuditLogModel(
                        event="PAYMENT_VERIFIED_FAILED",
                        purchase_id=purchase.purchase_id,
                        payment_id=payment.payment_id,
                        product=purchase.product,
                        plan_key=purchase.plan_key,
                        amount_pkr=purchase.amount_pkr
                    )
                    await self.audit_repo.write(audit, session=session)
            finally:
                await session.end_session()
        else:
            await self.payment_repo.add_verification_attempt(payment.payment_id, "FAILED", raw_status)
            await self.purchase_repo.update_status(purchase.purchase_id, "FAILED")
            audit = AuditLogModel(
                event="PAYMENT_VERIFIED_FAILED",
                purchase_id=purchase.purchase_id,
                payment_id=payment.payment_id,
                product=purchase.product,
                plan_key=purchase.plan_key,
                amount_pkr=purchase.amount_pkr
            )
            await self.audit_repo.write(audit)
            
        logger.info(f"❌ [Payment Verified] FAILED | purchase_id={purchase.purchase_id}")
