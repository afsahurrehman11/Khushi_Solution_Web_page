from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.common import PurchaseStatusEnum, PaymentStatusEnum

class PaymentInitiateResponse(BaseModel):
    payment_id: str
    complete_link: str
    amount_pkr: int
    currency: str = "PKR"

class PaymentStatusResponse(BaseModel):
    purchase_id: str
    purchase_status: PurchaseStatusEnum
    payment_id: Optional[str] = None
    payment_status: Optional[PaymentStatusEnum] = None
    amount_pkr: Optional[int] = None
    retry_after_seconds: Optional[int] = None
