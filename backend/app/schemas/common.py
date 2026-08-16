"""
schemas/common.py — Shared enums and types used across request/response schemas.
"""
from enum import Enum


class ProductEnum(str, Enum):
    """Valid product identifiers (backend canonical form — underscored)."""
    KHUSHI_DELIVERY = "khushi_delivery"
    KHUSHI_ERP = "khushi_erp"


class DeliveryPlanEnum(str, Enum):
    NON_COMMISSION = "non_commission"
    COMMISSION = "commission"


class ErpPlanEnum(str, Enum):
    BASE_FREE = "base_free"


class DeliveryCategoryEnum(str, Enum):
    FOOD_RESTAURANT = "food_restaurant"
    GROCERY = "grocery"
    PHARMACY = "pharmacy"
    GENERAL_RETAIL = "general_retail"
    OTHER = "other"


class InstitutionTypeEnum(str, Enum):
    SCHOOL = "school"
    COLLEGE = "college"
    MADRASA = "madrasa"
    UNIVERSITY = "university"
    ACADEMY = "academy"
    OTHER = "other"


class PurchaseStatusEnum(str, Enum):
    PENDING = "PENDING"
    PAYMENT_INITIATED = "PAYMENT_INITIATED"
    PAID = "PAID"
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"
    ABANDONED = "ABANDONED"


class PaymentStatusEnum(str, Enum):
    INITIATED = "INITIATED"
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    ZERO_AMOUNT = "ZERO_AMOUNT"


# Valid purchase state transitions
PURCHASE_TRANSITIONS: dict[str, list[str]] = {
    "PENDING":            ["PAYMENT_INITIATED", "PAID"],  # PAID only for amount_pkr == 0
    "PAYMENT_INITIATED":  ["PAID", "FAILED", "EXPIRED"],
    "PAID":               [],
    "FAILED":             ["PAYMENT_INITIATED"],           # retry allowed, max 3 attempts
    "EXPIRED":            [],
    "ABANDONED":          [],
}

# Valid payment state transitions
PAYMENT_TRANSITIONS: dict[str, list[str]] = {
    "INITIATED":           ["PENDING_VERIFICATION", "SUCCESS", "FAILED"],
    "PENDING_VERIFICATION": ["SUCCESS", "FAILED"],
    "SUCCESS":             [],
    "FAILED":              [],
    "ZERO_AMOUNT":         [],
}
