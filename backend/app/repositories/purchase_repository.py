from typing import Optional, Dict, Any
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.db.mongodb import get_db
from app.models.purchase_model import PurchaseModel

class PurchaseRepository:
    @property
    def collection(self):
        return get_db()["purchases"]
        
    async def create(self, purchase: PurchaseModel) -> PurchaseModel:
        await self.collection.insert_one(purchase.model_dump())
        return purchase

    async def get_by_id(self, purchase_id: str) -> Optional[PurchaseModel]:
        doc = await self.collection.find_one({"purchase_id": purchase_id})
        if doc:
            return PurchaseModel(**doc)
        return None

    async def update_status(self, purchase_id: str, new_status: str, old_status: Optional[str] = None, session: Optional[AsyncIOMotorClientSession] = None) -> bool:
        """
        Atomically update the purchase status.
        If old_status is provided, ensures the status is exactly old_status before updating.
        """
        filter_query = {"purchase_id": purchase_id}
        if old_status:
            filter_query["status"] = old_status
            
        update_query = {
            "$set": {
                "status": new_status,
                "updated_at": datetime.now(timezone.utc)
            }
        }
        
        result = await self.collection.update_one(filter_query, update_query, session=session)
        return result.modified_count > 0

    async def increment_payment_attempts(self, purchase_id: str) -> bool:
        result = await self.collection.update_one(
            {"purchase_id": purchase_id},
            {"$inc": {"payment_attempts": 1}, "$set": {"updated_at": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0

    async def mark_notification_sent(self, purchase_id: str) -> bool:
        result = await self.collection.update_one(
            {"purchase_id": purchase_id},
            {"$set": {"notification_sent": True, "updated_at": datetime.now(timezone.utc)}}
        )
        return result.modified_count > 0
