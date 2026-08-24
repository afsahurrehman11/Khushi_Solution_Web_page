import os
import sys
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import datetime

# Load env from backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

async def import_affiliates():
    file_path = input("Enter the path to the affiliate codes .txt file: ").strip()
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    with open(file_path, "r") as f:
        lines = f.readlines()

    valid_codes = set()
    for line in lines:
        code = line.strip()
        if code and len(code) == 4 and code.isdigit():
            valid_codes.add(code)
        elif code:
            print(f"Warning: Skipping invalid code '{code}'. Must be exactly 4 numeric digits.")

    if not valid_codes:
        print("No valid 4-digit numeric codes found.")
        return

    print(f"Found {len(valid_codes)} valid codes. Connecting to DB...")

    mongo_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DB_NAME", "khushi_solutions_db")
    if not mongo_uri:
        print("Error: MONGODB_URI not found in .env file.")
        return

    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]
    collection = db["affiliates"]

    # Ensure unique index
    await collection.create_index([("code", 1)], unique=True)

    inserted = 0
    duplicates = 0

    for code in valid_codes:
        doc = {
            "code": code,
            "product": "khushi_delivery",
            "discount_percentage": 15,
            "usage_count": 0,
            "is_active": True,
            "created_at": datetime.datetime.now(datetime.timezone.utc),
            "updated_at": datetime.datetime.now(datetime.timezone.utc)
        }
        
        try:
            # Upsert using setOnInsert to avoid overwriting existing data (like usage_count)
            result = await collection.update_one(
                {"code": code},
                {"$setOnInsert": doc},
                upsert=True
            )
            if result.upserted_id:
                inserted += 1
            else:
                duplicates += 1
        except Exception as e:
            print(f"Error processing code {code}: {e}")

    print(f"Import complete: {inserted} new codes inserted. {duplicates} codes already existed.")

if __name__ == "__main__":
    asyncio.run(import_affiliates())
