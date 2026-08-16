from motor.motor_asyncio import AsyncIOMotorClientSession
from typing import Optional
from app.db.mongodb import get_db
from app.models.audit_model import AuditLogModel

class AuditRepository:
    @property
    def collection(self):
        return get_db()["audit_logs"]

    async def write(self, audit_log: AuditLogModel, session: Optional[AsyncIOMotorClientSession] = None) -> None:
        """
        Write an audit log event. This collection is append-only.
        """
        await self.collection.insert_one(audit_log.model_dump(), session=session)
