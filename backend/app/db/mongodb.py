"""
db/mongodb.py — Motor async client lifecycle and MongoDB setup.
"""
import sys
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError, ConnectionFailure

from app.core.config import settings

logger = logging.getLogger("db")

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None
_supports_transactions: bool = True


def get_db() -> AsyncIOMotorDatabase:
    """Return active database."""
    if _db is None:
        raise RuntimeError("Database not initialized.")
    return _db


def get_client() -> AsyncIOMotorClient:
    """Return active Motor client."""
    if _client is None:
        raise RuntimeError("MongoDB client not initialized.")
    return _client


def supports_transactions() -> bool:
    """Return transaction support status."""
    return _supports_transactions


async def startup() -> None:
    """Initialize database connection, check features, and build indexes."""
    global _client, _db, _supports_transactions

    uri = settings.MONGODB_URI
    db_name = settings.DATABASE_NAME
    logger.info(f"Connecting to MongoDB database: {db_name}")

    try:
        _client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=3000)
        _db = _client[db_name]
        await _client.admin.command("ping")
        logger.info(f"MongoDB connected: {db_name}")

    except (ServerSelectionTimeoutError, ConnectionFailure):
        if settings.ENVIRONMENT == "development" and "replicaSet=" in uri:
            fallback_uri = uri.split("?")[0]
            try:
                _client = AsyncIOMotorClient(fallback_uri, serverSelectionTimeoutMS=3000)
                _db = _client[db_name]
                await _client.admin.command("ping")
                _supports_transactions = False
                logger.info(f"MongoDB connected (standalone mode): {db_name}")
            except Exception:
                logger.error("Failed to connect to MongoDB. Check if MongoDB service is running.")
                sys.exit(1)
        else:
            logger.error("Failed to connect to MongoDB. Check if MongoDB service is running.")
            sys.exit(1)
    except Exception as e:
        logger.error(f"MongoDB connection error: {type(e).__name__} - {str(e)}")
        sys.exit(1)

    if _supports_transactions:
        await _verify_transactions()

    await _create_indexes()
    logger.info("Database startup complete.")


async def _verify_transactions() -> None:
    global _supports_transactions
    try:
        async with await _client.start_session() as session:
            async with session.start_transaction():
                await _db.command("ping", session=session)
        logger.info("Transactions: Enabled (Replica Set)")
    except OperationFailure:
        _supports_transactions = False
        if settings.ENVIRONMENT == "development":
            logger.info("Transactions: Disabled (Standalone Dev Mode)")
        else:
            logger.error("Transactions required in production.")
            sys.exit(1)
    except Exception:
        _supports_transactions = False


async def _create_indexes() -> None:
    try:
        purchases = _db["purchases"]
        await purchases.create_index([("purchase_id", ASCENDING)], unique=True, background=True)
        await purchases.create_index([("status", ASCENDING)], background=True)
        await purchases.create_index([("product", ASCENDING)], background=True)

        payments = _db["payments"]
        await payments.create_index([("payment_id", ASCENDING)], unique=True, background=True)
        await payments.create_index([("purchase_id", ASCENDING)], background=True)
        await payments.create_index([("assanpay_order_id", ASCENDING)], unique=True, sparse=True, background=True)

        audit_logs = _db["audit_logs"]
        await audit_logs.create_index([("purchase_id", ASCENDING)], background=True)
        await audit_logs.create_index([("event", ASCENDING), ("timestamp", DESCENDING)], background=True)

        logger.info("MongoDB indexes verified.")
    except Exception as e:
        logger.error(f"Index creation error: {str(e)[:80]}")


async def shutdown() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
        logger.info("MongoDB connection closed.")
    _client = None
    _db = None
