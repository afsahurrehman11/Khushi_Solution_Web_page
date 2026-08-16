from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class AuditLogModel(BaseModel):
    event: str
    purchase_id: str
    payment_id: Optional[str] = None
    product: str
    plan_key: str
    amount_pkr: int
    ip_address: Optional[str] = None
    request_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Dict[str, Any] = Field(default_factory=dict)
