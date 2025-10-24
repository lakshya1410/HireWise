from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# MongoDB client - initialized once
mongodb_client = AsyncIOMotorClient(settings.mongodb_url)

# Get MongoDB database
def get_database():
    return mongodb_client[settings.mongodb_db_name]

# Startup event - connect to MongoDB
async def connect_to_mongo():
    # Test connection
    try:
        await mongodb_client.admin.command('ping')
        print(f"✅ Connected to MongoDB at {settings.mongodb_url}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise
    
# Shutdown event - close MongoDB connection
async def close_mongo_connection():
    mongodb_client.close()
    print("Closed MongoDB connection")

# Helper to get database (for dependency injection)
async def get_db():
    return get_database()
