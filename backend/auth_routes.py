"""
Authentication routes for HemoScan AI
Handles user signup, login, and JWT token management
"""

from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import Database
from datetime import datetime
import re
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)
# Bcrypt instance - will work standalone for password hashing
bcrypt = Bcrypt()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, None

@auth_bp.route('/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.json
        
        # Validate required fields
        if not data or not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({'error': 'Missing required fields: username, email, password'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Validate inputs
        if not username or len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters long'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        db = Database.get_db()
        users_collection = db.users
        
        # Create indexes if they don't exist (for first user)
        try:
            users_collection.create_index("email", unique=True)
            users_collection.create_index("username", unique=True)
        except Exception:
            pass  # Indexes already exist
        
        # Check if email already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Check if username already exists
        if users_collection.find_one({'username': username}):
            return jsonify({'error': 'Username already taken'}), 400
        
        # Hash password
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create user document
        user_doc = {
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'role': 'user',  # Default role
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        
        # Generate JWT token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'username': username,
                'email': email,
                'role': 'user'
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.json
        
        # Validate required fields
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({'error': 'Missing required fields: email, password'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        db = Database.get_db()
        users_collection = db.users
        
        # Find user by email
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not bcrypt.check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'user')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()
        users_collection = db.users
        
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'role': user.get('role', 'user')
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

