import pytest
import pytest_asyncio
from httpx import AsyncClient
from typing import AsyncGenerator
from unittest.mock import patch, MagicMock
from motor.motor_asyncio import AsyncIOMotorClient

import os
# Force test environment BEFORE importing app modules
os.environ["ENVIRONMENT"] = "development"
os.environ["MONGODB_URI"] = "mongodb://localhost:27017/?replicaSet=rs0"
os.environ["DATABASE_NAME"] = "ks_test_portal" # Use a separate test DB
os.environ["ASSANPAY_MOCK"] = "true"
os.environ["SECRET_KEY"] = "test-secret-key"

from app.main import app
from app.db.mongodb import get_db, _client

@pytest_asyncio.fixture(scope="session")
async def db_connection() -> AsyncGenerator:
    """Initialize DB connection once for the test session."""
    from app.db.mongodb import startup, shutdown
    await startup()
    yield
    await shutdown()

@pytest_asyncio.fixture(autouse=True)
async def clear_db(db_connection) -> AsyncGenerator:
    """Clear test database collections before each test."""
    db = get_db()
    await db.purchases.delete_many({})
    await db.payments.delete_many({})
    await db.audit_logs.delete_many({})
    
    # GridFS cleanup
    await db["uploads.files"].delete_many({})
    await db["uploads.chunks"].delete_many({})
    yield

@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
