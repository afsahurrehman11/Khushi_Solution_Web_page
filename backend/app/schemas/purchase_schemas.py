from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from app.schemas.common import ProductEnum, DeliveryCategoryEnum, InstitutionTypeEnum

# --- Base and Sub-documents ---

class CustomerInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=3, max_length=150)
    phone: str = Field(min_length=5, max_length=30)
    whatsapp: Optional[str] = Field(None, max_length=30)

class DeliveryProductData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    business_name: str = Field(min_length=2, max_length=150)
    business_category: DeliveryCategoryEnum
    sub_category: Optional[str] = Field(None, max_length=100)
    business_address: str = Field(min_length=2, max_length=500)
    city: str = Field(min_length=2, max_length=100)
    area_town: str = Field(min_length=2, max_length=100)
    maps_location: Optional[str] = Field(None, max_length=500)

class ErpProductData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    institution_name: str = Field(min_length=2, max_length=200)
    institution_type: InstitutionTypeEnum
    institution_email: str = Field(min_length=3, max_length=150)
    institution_phone: str = Field(min_length=5, max_length=30)
    secondary_phone: Optional[str] = None
    whatsapp: Optional[str] = None
    complete_address: str = Field(min_length=2, max_length=500)
    city: str
    area_town: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    contact_name: str = Field(min_length=2, max_length=100)
    contact_designation: str = Field(min_length=2, max_length=100)
    contact_email: str = Field(min_length=3, max_length=150)
    contact_phone: str = Field(min_length=5, max_length=30)
    contact_whatsapp: Optional[str] = None
    student_count: Optional[int] = Field(None, ge=0, le=100000)
    teacher_staff_count: Optional[int] = Field(None, ge=0, le=10000)
    campus_count: Optional[int] = Field(1, ge=1, le=1000)
    current_system: Optional[str] = Field(None, max_length=200)

# --- Requests ---

class PurchaseCreateRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product: ProductEnum
    plan_key: str
    customer: CustomerInfo
    product_data: Union[DeliveryProductData, ErpProductData]

# --- Responses ---

class PurchaseCreateResponse(BaseModel):
    purchase_id: str
    product: ProductEnum
    plan_key: str
    plan_label: str
    amount_pkr: int
    currency: str = "PKR"
    status: str
