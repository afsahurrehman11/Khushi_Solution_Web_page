"""
db/gridfs.py — AsyncIOMotorGridFSBucket setup for file storage.

Bucket name: "uploads"  → creates collections: uploads.files, uploads.chunks
Files are referenced by ObjectId stored in purchase documents.
"""
from motor.motor_asyncio import AsyncIOMotorGridFSBucket
from app.db.mongodb import get_db


def get_gridfs_bucket() -> AsyncIOMotorGridFSBucket:
    """Return the GridFS bucket for the uploads collection."""
    db = get_db()
    return AsyncIOMotorGridFSBucket(db, bucket_name="uploads")
