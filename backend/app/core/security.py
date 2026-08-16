"""
core/security.py — ID generators and sanitization utilities.

All IDs are random and non-sequential to prevent enumeration attacks.
"""
import secrets
import re
import string
from datetime import datetime, timezone


_ALPHANUMERIC = string.ascii_letters + string.digits  # A-Za-z0-9


def _random_alphanumeric(length: int) -> str:
    """Generate a cryptographically secure random alphanumeric string."""
    return "".join(secrets.choice(_ALPHANUMERIC) for _ in range(length))


def _random_uppercase_alphanumeric(length: int) -> str:
    """Generate a random string of uppercase letters and digits (AssanPay safe)."""
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


def generate_purchase_id() -> str:
    """
    Generate a unique internal purchase ID.
    Format: purch_ + 12 random alphanumeric chars
    Example: purch_X7k2mN9pQrLw
    """
    return f"purch_{_random_alphanumeric(12)}"


def generate_payment_id() -> str:
    """
    Generate a unique internal payment ID.
    Format: pay_ + 12 random alphanumeric chars
    Example: pay_Tz4bVm8hJrKn
    """
    return f"pay_{_random_alphanumeric(12)}"


def generate_request_id() -> str:
    """
    Generate a short request correlation ID for log tracing.
    Format: req_ + 8 random alphanumeric chars
    Example: req_Ab3Kx9pQ
    """
    return f"req_{_random_alphanumeric(8)}"


def generate_assanpay_order_id(product: str) -> str:
    """
    Generate an AssanPay-compatible order ID.

    Constraints (from AssanPay docs):
    - Maximum 20 characters
    - No special characters (no dashes, underscores, spaces)
    - Only [A-Z0-9] used here for maximum safety

    Format: {PP}{YYYYMMDD}{8 uppercase alphanumeric}
    PP: KD (khushi_delivery) | KE (khushi_erp)
    Example: KD20251218X7K2M9PQ  (18 chars)

    Raises ValueError if product is unknown.
    """
    prefix_map = {
        "khushi_delivery": "KD",
        "khushi_erp": "KE",
    }
    prefix = prefix_map.get(product)
    if prefix is None:
        raise ValueError(f"Unknown product for order ID generation: {product!r}")

    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")  # 8 chars
    random_part = _random_uppercase_alphanumeric(8)           # 8 chars
    order_id = f"{prefix}{date_str}{random_part}"             # 18 chars total

    # Validate constraints — defensive check
    assert len(order_id) <= 20, f"Order ID too long: {order_id!r}"
    assert re.match(r"^[A-Z0-9]+$", order_id), f"Order ID has invalid chars: {order_id!r}"

    return order_id


def sanitize_product_id(product_id: str) -> str:
    """
    Convert frontend product ID (hyphenated) to backend enum (underscore).
    khushi-delivery -> khushi_delivery
    khushi-erp -> khushi_erp
    """
    return product_id.replace("-", "_").lower().strip()
