from fastapi import UploadFile
from typing import List, Dict, Any, Optional
import uuid
import os
from datetime import datetime, timezone
from app.db.gridfs import get_gridfs_bucket
from app.utils.file_validators import validate_file, MAX_SIZE_LOGO, MAX_SIZE_PHOTO, MAX_SIZE_INSTITUTION
import logging

logger = logging.getLogger("files")

class FileService:
    @staticmethod
    async def upload_file(file: UploadFile, field_name: str, max_size: int, purchase_id: str) -> str:
        """
        Validates and uploads a file to GridFS. Returns the string ObjectId.
        """
        # Validate
        await validate_file(file, max_size, field_name)
        
        # Generate safe filename
        _, ext = os.path.splitext(file.filename or "")
        safe_filename = f"{uuid.uuid4()}{ext.lower()}"
        
        metadata = {
            "purchase_id": purchase_id,
            "field": field_name,
            "validated": True,
            "upload_timestamp": datetime.now(timezone.utc)
        }
        
        bucket = get_gridfs_bucket()
        
        # Upload
        file_id = await bucket.upload_from_stream(
            safe_filename,
            file.file,
            metadata=metadata,
            content_type=file.content_type
        )
        
        logger.info(f"file.uploaded | purchase_id={purchase_id} field={field_name} file_id={file_id}")
        return str(file_id)

    @staticmethod
    async def cleanup_orphaned_files(file_ids: List[str]) -> None:
        """
        Deletes files from GridFS. Used if purchase creation fails after files are uploaded.
        """
        bucket = get_gridfs_bucket()
        from bson import ObjectId
        for fid in file_ids:
            try:
                await bucket.delete(ObjectId(fid))
                logger.info(f"file.deleted_orphan | file_id={fid}")
            except Exception as e:
                logger.warning(f"file.cleanup_failed | file_id={fid} reason={str(e)}")
