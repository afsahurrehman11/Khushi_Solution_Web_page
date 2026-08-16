from pydantic import BaseModel
from typing import List, Optional, Any
from app.schemas.common import ProductEnum

class PlanCategory(BaseModel):
    key: str
    label: str
    display: str
    commission_pct: float

class PlanFeature(BaseModel):
    name: str
    included: bool

class PlanInfo(BaseModel):
    plan_key: str
    label: str
    amount_pkr: int
    currency: str = "PKR"
    description: str
    is_custom_price: Optional[bool] = False
    categories: Optional[List[PlanCategory]] = None
    features: Optional[List[PlanFeature]] = None

class PricingResponse(BaseModel):
    product: ProductEnum
    plans: List[PlanInfo]
