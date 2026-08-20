import os
from fastapi import UploadFile
from app.core.exceptions import FileValidationError

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".ico"}
ALLOWED_MIMES = {
    "image/jpeg", "image/png", "image/webp",
    "image/x-icon", "image/vnd.microsoft.icon", "image/ico", "image/icon", "image/x-ico", "application/ico", "application/x-ico"
}

# Max sizes
MAX_SIZE_LOGO = 2 * 1024 * 1024 # 2MB
MAX_SIZE_PHOTO = 2 * 1024 * 1024 # 2MB
MAX_SIZE_INSTITUTION = 3 * 1024 * 1024 # 3MB

# Magic bytes (signatures)
MAGIC_BYTES = {
    "image/jpeg": [b"\xFF\xD8\xFF"],
    "image/png": [b"\x89\x50\x4E\x47\x0D\x0A\x1A\x0A"],
    "image/webp": [b"\x52\x49\x46\x46", b"\x57\x45\x42\x50"], # RIFF ... WEBP
    "ico": [b"\x00\x00\x01\x00", b"\x00\x00\x02\x00"]
}

async def validate_file(file: UploadFile, max_size: int, field_name: str) -> None:
    # 1. Extension check
    _, ext = os.path.splitext(file.filename or "")
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise FileValidationError(f"[{field_name}] Invalid file extension {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    # 2. MIME type check
    # Fallback to extension check if content_type is octet-stream
    if file.content_type not in ALLOWED_MIMES and file.content_type != "application/octet-stream" and ext.lower() != ".ico":
        raise FileValidationError(f"[{field_name}] Invalid MIME type {file.content_type}. Allowed: {ALLOWED_MIMES}")

    # 3. Magic bytes check
    header = await file.read(12)
    await file.seek(0) # Reset pointer
    
    is_valid_magic = False
    if file.content_type == "image/jpeg":
        if header.startswith(MAGIC_BYTES["image/jpeg"][0]):
            is_valid_magic = True
    elif file.content_type == "image/png":
        if header.startswith(MAGIC_BYTES["image/png"][0]):
            is_valid_magic = True
    elif file.content_type == "image/webp":
        if header.startswith(MAGIC_BYTES["image/webp"][0]) and header[8:12] == MAGIC_BYTES["image/webp"][1]:
            is_valid_magic = True
    elif ext.lower() == ".ico" or file.content_type in ALLOWED_MIMES:
        if header.startswith(MAGIC_BYTES["ico"][0]) or header.startswith(MAGIC_BYTES["ico"][1]) or header.startswith(MAGIC_BYTES["image/png"][0]):
            is_valid_magic = True

    if not is_valid_magic:
        raise FileValidationError(f"[{field_name}] File content does not match its MIME type (magic bytes mismatch)")

    # 4. File size check
    # We must read the file to get the size accurately since Content-Length is not always provided/reliable
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    await file.seek(0) # Reset pointer

    if size > max_size:
        raise FileValidationError(f"[{field_name}] File size {size} exceeds max size {max_size} bytes")

