from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.db.mongodb import get_db
from app.models.payment_model import PaymentModel, StatusHistoryEntry

class PaymentRepository:
    @property
    def collection(self):
        return get_db()["payments"]
        
    async def create(self, payment: PaymentModel) -> PaymentModel:
        await self.collection.insert_one(payment.model_dump())
        return payment

    async def get_by_id(self, payment_id: str) -> Optional[PaymentModel]:
        doc = await self.collection.find_one({"payment_id": payment_id})
        if doc:
            return PaymentModel(**doc)
        return None
        
    async def get_by_assanpay_order_id(self, assanpay_order_id: str) -> Optional[PaymentModel]:
        doc = await self.collection.find_one({"assanpay_order_id": assanpay_order_id})
        if doc:
            return PaymentModel(**doc)
        return None

    async def get_latest_for_purchase(self, purchase_id: str) -> Optional[PaymentModel]:
        doc = await self.collection.find_one(
            {"purchase_id": purchase_id}, 
            sort=[("created_at", -1)]
        )
        if doc:
            return PaymentModel(**doc)
        return None

    async def add_verification_attempt(self, payment_id: str, new_status: str, raw_status: Optional[str] = None, failure_reason: Optional[str] = None, session: Optional[AsyncIOMotorClientSession] = None) -> bool:
        history_entry = StatusHistoryEntry(
            status=new_status,
            note=f"Verification attempt (raw_status={raw_status})"
        )
        
        update_query = {
            "$set": {
                "status": new_status,
                "last_verified_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            },
            "$inc": {"verification_attempts": 1},
            "$push": {"status_history": history_entry.model_dump()}
        }
        if raw_status is not None:
            update_query["$set"]["assanpay_raw_status"] = raw_status
        if failure_reason is not None:
            update_query["$set"]["failure_reason"] = failure_reason
            
        result = await self.collection.update_one({"payment_id": payment_id}, update_query, session=session)
        return result.modified_count > 0

    async def set_verified_success(self, payment_id: str, session: Optional[AsyncIOMotorClientSession] = None) -> bool:
        """
        Sets payment to SUCCESS. Idempotent: only updates if not already SUCCESS.
        """
        history_entry = StatusHistoryEntry(
            status="SUCCESS",
            note="Payment verified successfully"
        )
        
        update_query = {
            "$set": {
                "status": "SUCCESS",
                "last_verified_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "notification_sent": False # Flagged for sending
            },
            "$push": {"status_history": history_entry.model_dump()}
        }
        
        result = await self.collection.update_one(
            {"payment_id": payment_id, "status": {"$ne": "SUCCESS"}}, 
            update_query, 
            session=session
        )
        return result.modified_count > 0

    async def mark_notification_sent(self, payment_id: str) -> bool:
        result = await self.collection.update_one(
            {"payment_id": payment_id},
            {"$set": {"notification_sent": True, "updated_at": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0
