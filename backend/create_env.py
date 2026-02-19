"""
Script to create .env file with secure keys
"""

import secrets
import os

# Generate secure keys
jwt_secret = secrets.token_hex(32)
secret_key = secrets.token_hex(32)

# .env content
env_content = f"""MONGO_URI=mongodb://localhost:27017/hemoscan_ai
JWT_SECRET_KEY={jwt_secret}
SECRET_KEY={secret_key}
"""

# Write .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
with open(env_path, 'w') as f:
    f.write(env_content)

print(".env file created successfully!")
print(f"Location: {env_path}")
print("\nMake sure MongoDB is running before starting the backend!")

