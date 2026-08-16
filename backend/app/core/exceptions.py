"""
core/exceptions.py — Typed exception hierarchy for Khushi Solutions backend.

Rules:
- Catch only where recovery, logging, state rollback, or safe translation is needed.
- Do NOT use bare `except Exception` to suppress errors.
- Unexpected exceptions propagate to the centralized FastAPI handler in main.py.
"""


class KhushiBaseError(Exception):
    """Base class for all application-defined exceptions."""


# ── Validation ──────────────────────────────────────────────────────────────

class ValidationError(KhushiBaseError):
    """Input failed business-level validation (beyond Pydantic)."""


class FileValidationError(KhushiBaseError):
    """Uploaded file failed extension, MIME, magic-byte, size, or count check."""


# ── Business Logic ───────────────────────────────────────────────────────────

class PricingConfigError(KhushiBaseError):
    """Server-side pricing config is invalid (caught at startup)."""


class InvalidStateTransitionError(KhushiBaseError):
    """Attempted an invalid purchase or payment state transition."""

    def __init__(self, from_state: str, to_state: str, entity: str = "purchase"):
        self.from_state = from_state
        self.to_state = to_state
        self.entity = entity
        super().__init__(
            f"Invalid {entity} transition: {from_state!r} -> {to_state!r}"
        )


class PurchaseNotFoundError(KhushiBaseError):
    """Purchase ID does not exist in the database."""


class PaymentNotFoundError(KhushiBaseError):
    """Payment record does not exist for the given purchase."""


class DuplicatePaymentError(KhushiBaseError):
    """A payment is already active for this purchase."""


class MaxPaymentAttemptsError(KhushiBaseError):
    """Purchase has reached the maximum number of payment attempts."""


# ── AssanPay ─────────────────────────────────────────────────────────────────

class AssanPayRequestError(KhushiBaseError):
    """AssanPay HTTP request failed (network error, timeout, 5xx)."""


class AssanPayVerificationError(KhushiBaseError):
    """AssanPay returned an unrecognized or unparseable response."""


class AssanPayDuplicateOrderError(KhushiBaseError):
    """AssanPay reports the order_id already exists."""


# ── Database ─────────────────────────────────────────────────────────────────

class DatabaseError(KhushiBaseError):
    """A database operation failed unexpectedly."""


# ── Configuration ─────────────────────────────────────────────────────────────

class ConfigurationError(KhushiBaseError):
    """Application misconfiguration detected at startup (e.g. mock in production)."""
