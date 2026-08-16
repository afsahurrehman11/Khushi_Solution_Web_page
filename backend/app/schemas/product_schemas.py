from pydantic import BaseModel
from typing import List, Optional, Any
from app.schemas.common import ProductEnum

class PlanCategory(BaseModel):
    key: str
    label: str
    display: str
    commission_pct: float

class PlanInfo(BaseModel):
    plan_key: str
    label: str
    amount_pkr: int
    currency: str = "PKR"
    description: str
    categories: Optional[List[PlanCategory]] = None

class PricingResponse(BaseModel):
    product: ProductEnum
    plans: List[PlanInfo]
