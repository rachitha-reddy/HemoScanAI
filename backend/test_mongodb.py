"""
Test MongoDB connection and setup
Run this to verify everything is configured correctly
"""

import sys
import os

print("=" * 60)
print("MongoDB Connection Test")
print("=" * 60)

# 1. Check if .env exists
print("\n1. Checking .env file...")
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    print("   [OK] .env file exists")
    with open(env_path, 'r') as f:
        content = f.read()
        if 'MONGO_URI' in content:
            print("   [OK] MONGO_URI found in .env")
            # Extract MONGO_URI
            for line in content.split('\n'):
                if line.startswith('MONGO_URI='):
                    mongo_uri = line.split('=', 1)[1].strip()
                    print(f"   [INFO] Connection string: {mongo_uri}")
        else:
            print("   [ERROR] MONGO_URI not found in .env")
            sys.exit(1)
else:
    print("   [ERROR] .env file not found!")
    print("   Run: python create_env.py")
    sys.exit(1)

# 2. Check dependencies
print("\n2. Checking Python packages...")
try:
    import pymongo
    print(f"   [OK] pymongo installed (version: {pymongo.__version__})")
except ImportError:
    print("   [ERROR] pymongo not installed")
    print("   Run: pip install pymongo")
    sys.exit(1)

try:
    import flask_bcrypt
    print("   [OK] flask-bcrypt installed")
except ImportError:
    print("   [ERROR] flask-bcrypt not installed")
    print("   Run: pip install flask-bcrypt")
    sys.exit(1)

try:
    import flask_jwt_extended
    print("   [OK] flask-jwt-extended installed")
except ImportError:
    print("   [ERROR] flask-jwt-extended not installed")
    print("   Run: pip install flask-jwt-extended")
    sys.exit(1)

try:
    import dotenv
    print("   [OK] python-dotenv installed")
except ImportError:
    print("   [ERROR] python-dotenv not installed")
    print("   Run: pip install python-dotenv")
    sys.exit(1)

# 3. Test MongoDB connection
print("\n3. Testing MongoDB connection...")
try:
    from config import Config
    from pymongo import MongoClient
    from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
    
    print(f"   Attempting to connect to: {Config.MONGO_URI}")
    
    # Try to connect with short timeout
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Test connection
    client.admin.command('ping')
    print("   [OK] MongoDB connection successful!")
    
    # Get database name
    uri_parts = Config.MONGO_URI.split('/')
    if len(uri_parts) > 3:
        db_name = uri_parts[-1].split('?')[0]
    else:
        db_name = 'hemoscan_ai'
    
    print(f"   [DATA] Database name: {db_name}")
    
    # List databases
    db_list = client.list_database_names()
    print(f"   [DB] Available databases: {', '.join(db_list[:5])}")
    
    # Check if our database exists
    db = client[db_name]
    collections = db.list_collection_names()
    if collections:
        print(f"   [LIST] Collections in {db_name}: {', '.join(collections)}")
    else:
        print(f"   [NOTE]  Database '{db_name}' will be created on first insert")
    
    client.close()
    
except ServerSelectionTimeoutError:
    print("   [ERROR] MongoDB connection timeout!")
    print("   [WARNING]  MongoDB might not be running")
    print("   [TIP] Solution: Start MongoDB service")
    print("      Run: net start MongoDB")
    sys.exit(1)
    
except ConnectionFailure as e:
    print(f"   [ERROR] MongoDB connection failed: {e}")
    print("   [WARNING]  Check if MongoDB is running")
    print("   [TIP] Solution:")
    print("      1. Start MongoDB: net start MongoDB")
    print("      2. Or check MongoDB Compass can connect")
    sys.exit(1)
    
except Exception as e:
    print(f"   [ERROR] Error: {e}")
    print("   [WARNING]  Check your MONGO_URI in .env file")
    sys.exit(1)

# 4. Test config loading
print("\n4. Testing configuration...")
try:
    from config import Config
    print("   [OK] Config loaded successfully")
    print(f"   [INFO] MONGO_URI: {Config.MONGO_URI}")
    print(f"   [KEY] JWT_SECRET_KEY: {'*' * 20} (hidden)")
    print(f"   [KEY] SECRET_KEY: {'*' * 20} (hidden)")
except Exception as e:
    print(f"   [ERROR] Config error: {e}")
    sys.exit(1)

# 5. Test database module
print("\n5. Testing database module...")
try:
    from database import Database
    print("   [OK] Database module imported successfully")
except Exception as e:
    print(f"   [ERROR] Database module error: {e}")
    sys.exit(1)

# 6. Test auth routes
print("\n6. Testing auth routes...")
try:
    from auth_routes import auth_bp, bcrypt
    print("   [OK] Auth routes module imported successfully")
    print("   [OK] Bcrypt initialized")
except Exception as e:
    print(f"   [ERROR] Auth routes error: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("[OK] ALL CHECKS PASSED!")
print("=" * 60)
print("\n[LIST] Next Steps:")
print("   1. Make sure MongoDB is running: net start MongoDB")
print("   2. Open MongoDB Compass and connect to localhost:27017")
print("   3. Start backend: python app.py")
print("   4. Test signup at: http://localhost:3000/signup")
print("\n[SUCCESS] You're ready to go!")

