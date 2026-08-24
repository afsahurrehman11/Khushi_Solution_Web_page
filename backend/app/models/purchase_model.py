from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class PurchaseModel(BaseModel):
    purchase_id: str
    product: str
    plan_key: str
    status: str
    payment_attempts: int = 0
    notification_sent: bool = False
    customer: Dict[str, Any]
    product_data: Dict[str, Any]
    amount_pkr: int
    currency: str = "PKR"
    affiliate_code: Optional[str] = None
    discount_percentage: Optional[int] = None
    original_amount_pkr: Optional[int] = None
    discount_applied_pkr: Optional[int] = None
    final_amount_pkr: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
