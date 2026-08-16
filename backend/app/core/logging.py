"""
core/logging.py — Clean, concise structured logging setup for Khushi Solutions backend.
"""
import logging
import sys


class StructuredFormatter(logging.Formatter):
    """Simple, clean logger formatter."""

    def format(self, record: logging.LogRecord) -> str:
        return f"[{record.levelname}] {record.getMessage()}"


def setup_logging() -> None:
    """Configure root logger once at startup."""
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter())
    root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("motor").setLevel(logging.WARNING)
    logging.getLogger("pymongo").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Get a named logger."""
    return logging.getLogger(name)
