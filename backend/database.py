"""
MongoDB database connection and initialization
"""

from pymongo import MongoClient
from bson import ObjectId
from config import Config
from datetime import datetime

class Database:
    """MongoDB database connection manager"""
    
    _client = None
    _db = None
    
    @classmethod
    def initialize(cls):
        """Initialize MongoDB connection"""
        try:
            cls._client = MongoClient(Config.MONGO_URI)
            # Extract database name from URI or use default
            uri_parts = Config.MONGO_URI.split('/')
            if len(uri_parts) > 3:
                db_name = uri_parts[-1].split('?')[0]
            else:
                db_name = 'hemoscan_ai'
            cls._db = cls._client[db_name]
            
            # Create indexes for better performance (collections will be created automatically on first insert)
            try:
                # Create indexes if collections exist, otherwise they'll be created on first insert
                if "users" in cls._db.list_collection_names():
                    cls._db.users.create_index("email", unique=True)
                    cls._db.users.create_index("username", unique=True)
                if "screenings" in cls._db.list_collection_names():
                    cls._db.screenings.create_index("user_id")
                    cls._db.screenings.create_index("timestamp")
            except Exception as e:
                # Indexes will be created when collections are first created
                pass
            
            print("MongoDB connected successfully!")
            print(f"Database: {db_name}")
            return cls._db
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            raise
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            cls.initialize()
        return cls._db
    
    @classmethod
    def close(cls):
        """Close MongoDB connection"""
        if cls._client:
            cls._client.close()

