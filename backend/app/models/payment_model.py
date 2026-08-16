from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class StatusHistoryEntry(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    note: Optional[str] = None

class PaymentModel(BaseModel):
    payment_id: str
    purchase_id: str
    product: str
    plan_key: str
    amount_pkr: int
    currency: str = "PKR"
    provider: str = "assanpay"
    
    assanpay_order_id: Optional[str] = None
    assanpay_transaction_id: Optional[str] = None
    assanpay_payment_uuid: Optional[str] = None
    complete_link: Optional[str] = None
    
    status: str
    status_history: List[StatusHistoryEntry] = Field(default_factory=list)
    
    verification_attempts: int = 0
    last_verified_at: Optional[datetime] = None
    assanpay_raw_status: Optional[str] = None
    failure_reason: Optional[str] = None
    notification_sent: bool = False
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
