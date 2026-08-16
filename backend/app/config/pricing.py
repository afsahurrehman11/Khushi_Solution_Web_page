"""
config/pricing.py — Server-side pricing source of truth.

CRITICAL: This is the ONLY place prices are defined.
The frontend NEVER has prices. It fetches them from GET /api/v1/products/{id}/pricing.
The backend ALWAYS calculates the final amount from this config.
"""
from app.core.exceptions import PricingConfigError


# ── Khushi Delivery Plans ────────────────────────────────────────────────────

DELIVERY_PLANS: dict = {
    "non_commission": {
        "label": "Non-Commission Model",
        "registration_fee_pkr": 11000,
        "commission_pct": 0,
        "description": "One-time registration fee. No ongoing commission.",
        "categories": None,
    },
    "commission": {
        "label": "Commission Model",
        "registration_fee_pkr": 5000,
        "commission_pct": None,  # category-dependent; contractual, not charged upfront
        "description": "Reduced registration fee with a category-based revenue commission.",
        "categories": {
            "food_restaurant": {
                "key": "food_restaurant",
                "label": "Food & Restaurant",
                "display": "Food & Restaurant — 15% commission",
                "commission_pct": 15,
            },
            "grocery": {
                "key": "grocery",
                "label": "Grocery",
                "display": "Grocery — 15% commission",
                "commission_pct": 15,
            },
            "pharmacy": {
                "key": "pharmacy",
                "label": "Pharmacy",
                "display": "Pharmacy — 15% commission",
                "commission_pct": 15,
            },
            "general_retail": {
                "key": "general_retail",
                "label": "General Retail",
                "display": "General Retail — 15% commission",
                "commission_pct": 15,
            },
            "other": {
                "key": "other",
                "label": "Other Category",
                "display": "Other — 15% commission",
                "commission_pct": 15,
            },
        },
    },
}


# ── Khushi ERP Plans ─────────────────────────────────────────────────────────

ERP_PLANS: dict = {
    "base_free": {
        "label": "Base Educational Institution System",
        "registration_fee_pkr": 0,
        "description": "Complete institution management system — free.",
        "is_free": True,
        "categories": None,
    },
    # Future plans can be added here without restructuring:
    # "premium_ai_attendance": {
    #     "label": "AI Attendance Module",
    #     "registration_fee_pkr": 5000,
    #     "description": "Automated AI-powered attendance tracking.",
    #     "is_free": False,
    #     "categories": None,
    # },
}


# ── Master Config ────────────────────────────────────────────────────────────

PRICING_CONFIG: dict = {
    "khushi_delivery": DELIVERY_PLANS,
    "khushi_erp": ERP_PLANS,
}

MAX_PAYMENT_ATTEMPTS: int = 3


# ── Helper Functions ─────────────────────────────────────────────────────────

def get_plan_amount(product: str, plan_key: str) -> int:
    """
    Calculate the registration fee for a given product + plan combination.
    Returns the integer PKR amount.
    Raises PricingConfigError for unknown product or plan.
    This is the ONLY function that should determine payment amounts.
    """
    if product not in PRICING_CONFIG:
        raise PricingConfigError(f"Unknown product: {product!r}")
    plans = PRICING_CONFIG[product]
    if plan_key not in plans:
        raise PricingConfigError(f"Unknown plan {plan_key!r} for product {product!r}")
    return int(plans[plan_key]["registration_fee_pkr"])


def validate_pricing_config() -> None:
    """
    Validate the entire pricing config at startup.
    Raises PricingConfigError if any plan has missing or invalid data.
    Called during FastAPI startup to catch config errors before any request is served.
    """
    for product, plans in PRICING_CONFIG.items():
        for plan_key, plan in plans.items():
            amount = plan.get("registration_fee_pkr")
            if amount is None or not isinstance(amount, (int, float)) or amount < 0:
                raise PricingConfigError(
                    f"Invalid registration_fee_pkr for {product}/{plan_key}: {amount!r}"
                )
