import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from slowapi import Limiter

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.exceptions import (
    KhushiBaseError,
    ValidationError,
    PurchaseNotFoundError,
    PaymentNotFoundError,
    InvalidStateTransitionError,
    DuplicatePaymentError,
    MaxPaymentAttemptsError,
    AssanPayRequestError,
    AssanPayVerificationError,
    AssanPayDuplicateOrderError,
    FileValidationError
)
from app.db.mongodb import startup as db_startup, shutdown as db_shutdown
from app.api.v1.router import router as api_router
from app.core.security import generate_request_id
from app.config.pricing import validate_pricing_config

# 1. Logging setup
setup_logging()
logger = logging.getLogger("main")

# 2. Rate limiter
limiter = Limiter(key_func=get_remote_address)

# 3. Lifespan (Startup/Shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-flight checks
    validate_pricing_config()
    if settings.is_production and settings.ASSANPAY_MOCK:
        logger.critical("config.invalid | reason=mock_mode_in_production")
        import sys
        sys.exit(1)
        
    # Database (connect, ping, verify transactions, indexes)
    try:
        await db_startup()
    except SystemExit:
        logger.critical("Database connection failed. Please ensure MongoDB is running.")
        raise RuntimeError("MongoDB connection failed.")
    except Exception as e:
        logger.critical(f"Startup error: {type(e).__name__} - {str(e)}")
        raise
        
    yield # App is running
    
    # Shutdown
    await db_shutdown()

# 4. App Instance
app = FastAPI(
    title="Khushi Solutions Backend",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None
)

# 5. Middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.middleware("http")
async def add_security_headers_and_req_id(request: Request, call_next):
    # Request ID
    req_id = generate_request_id()
    request.state.request_id = req_id
    
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Request-ID"] = req_id
    return response

# 6. Centralized Exception Handlers

@app.exception_handler(ValidationError)
@app.exception_handler(FileValidationError)
async def validation_error_handler(request: Request, exc: KhushiBaseError):
    logger.info(f"api.validation_error | req_id={getattr(request.state, 'request_id', '')} detail={str(exc)}")
    return JSONResponse(status_code=422, content={"detail": str(exc)})

@app.exception_handler(PurchaseNotFoundError)
@app.exception_handler(PaymentNotFoundError)
async def not_found_handler(request: Request, exc: KhushiBaseError):
    logger.info(f"api.not_found | req_id={getattr(request.state, 'request_id', '')} detail={str(exc)}")
    return JSONResponse(status_code=404, content={"detail": str(exc)})

@app.exception_handler(InvalidStateTransitionError)
@app.exception_handler(DuplicatePaymentError)
@app.exception_handler(MaxPaymentAttemptsError)
async def conflict_handler(request: Request, exc: KhushiBaseError):
    logger.warning(f"api.conflict | req_id={getattr(request.state, 'request_id', '')} detail={str(exc)}")
    return JSONResponse(status_code=409, content={"detail": str(exc)})

@app.exception_handler(AssanPayRequestError)
async def service_unavailable_handler(request: Request, exc: KhushiBaseError):
    logger.error(f"api.upstream_error | req_id={getattr(request.state, 'request_id', '')} detail={str(exc)}")
    return JSONResponse(status_code=503, content={"detail": "Payment provider is currently unavailable. Please try again later."})

@app.exception_handler(AssanPayDuplicateOrderError)
@app.exception_handler(AssanPayVerificationError)
async def upstream_bad_response_handler(request: Request, exc: KhushiBaseError):
    logger.error(f"api.upstream_bad_response | req_id={getattr(request.state, 'request_id', '')} detail={str(exc)}")
    return JSONResponse(status_code=502, content={"detail": "Payment provider returned an invalid response."})

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Only CRITICAL for unexpected errors. Exposes generic safe message.
    logger.critical(f"api.unhandled_exception | req_id={getattr(request.state, 'request_id', '')} type={type(exc).__name__} detail={str(exc)}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error."})

# 7. Routes
app.include_router(api_router, prefix="/api/v1")
