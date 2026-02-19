"""
Flask REST API for HemoScan AI
Anemia Risk Prediction Backend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from config import Config
from database import Database
from auth_routes import auth_bp
import joblib
import numpy as np
import sqlite3
from datetime import datetime
import os
from bson import ObjectId

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize JWT and Bcrypt
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Register auth blueprint
app.register_blueprint(auth_bp)

# Initialize MongoDB
Database.initialize()

# Load model and scaler
MODEL_PATH = 'models/model.pkl'
SCALER_PATH = 'models/scaler.pkl'
FEATURE_NAMES_PATH = 'models/feature_names.pkl'

model = None
scaler = None
feature_names = None

def load_model():
    """Load the trained model and scaler"""
    global model, scaler, feature_names
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        feature_names = joblib.load(FEATURE_NAMES_PATH)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect('hemoscan.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS screenings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age INTEGER,
            gender TEXT,
            hemoglobin REAL,
            diet TEXT,
            symptoms TEXT,
            risk_level TEXT,
            probability REAL,
            timestamp TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized!")

def get_feature_importance(prediction_features):
    """Calculate feature importance for explainable AI"""
    # Get coefficients from logistic regression
    coefficients = model.coef_[0]
    
    # Create feature importance dictionary
    importance = {}
    for i, feature in enumerate(feature_names):
        # Weight by coefficient and feature value
        importance[feature] = abs(coefficients[i] * prediction_features[i])
    
    # Normalize to percentages
    total = sum(importance.values())
    if total > 0:
        importance = {k: (v / total) * 100 for k, v in importance.items()}
    
    # Sort by importance
    sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    
    return dict(sorted_importance[:5])  # Top 5 factors

def get_recommendations(risk_level, probability, features):
    """Generate personalized recommendations"""
    recommendations = []
    
    if risk_level == 'High':
        recommendations.append("🔴 Consult a healthcare professional immediately")
        recommendations.append("💊 Consider iron supplements (with doctor's approval)")
        recommendations.append("🥩 Increase iron-rich foods in your diet")
        recommendations.append("🍊 Consume vitamin C-rich foods to enhance iron absorption")
    elif risk_level == 'Moderate':
        recommendations.append("⚠️ Monitor your symptoms and consult a doctor if they worsen")
        recommendations.append("🥗 Improve your diet with iron-rich foods")
        recommendations.append("🏥 Schedule a blood test for accurate diagnosis")
        recommendations.append("💪 Maintain a balanced diet and stay hydrated")
    else:
        recommendations.append("✅ Continue maintaining a healthy lifestyle")
        recommendations.append("🥗 Keep a balanced diet rich in iron")
        recommendations.append("💧 Stay hydrated and get adequate rest")
        recommendations.append("📊 Regular health checkups are recommended")
    
    # Add specific recommendations based on features
    if features.get('hemoglobin', 0) < 12:
        recommendations.append("📉 Your hemoglobin level is below normal - consult a doctor")
    
    if features.get('diet', 1) == 0:  # Poor diet
        recommendations.append("🍎 Focus on improving your nutritional intake")
    
    symptom_count = sum([
        features.get('fatigue', 0),
        features.get('dizziness', 0),
        features.get('pale_skin', 0),
        features.get('weakness', 0),
        features.get('shortness_breath', 0)
    ])
    
    if symptom_count >= 3:
        recommendations.append("⚠️ Multiple symptoms detected - seek medical attention")
    
    return recommendations

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    """Predict anemia risk from user inputs"""
    try:
        # Get user ID from JWT token
        user_id = get_jwt_identity()
        data = request.json
        
        # Validate inputs
        required_fields = ['age', 'gender', 'diet', 'symptoms', 'rural_mode']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Extract features
        age = int(data['age'])
        gender = 0 if data['gender'].lower() in ['female', 'f'] else 1
        diet_map = {'poor': 0, 'moderate': 1, 'good': 2}
        diet = diet_map.get(data['diet'].lower(), 1)
        
        # Handle hemoglobin (may be None in rural mode)
        if data.get('rural_mode') and data.get('hemoglobin') is None:
            # Estimate hemoglobin based on other factors (simplified)
            hemoglobin = 12.0  # Default estimate
        else:
            hemoglobin = float(data.get('hemoglobin', 12.0))
        
        # Extract symptoms
        symptoms_list = data['symptoms']
        fatigue = 1 if 'fatigue' in symptoms_list else 0
        dizziness = 1 if 'dizziness' in symptoms_list else 0
        pale_skin = 1 if 'pale_skin' in symptoms_list else 0
        weakness = 1 if 'weakness' in symptoms_list else 0
        shortness_breath = 1 if 'shortness_breath' in symptoms_list else 0
        
        # Prepare feature vector
        features = {
            'age': age,
            'gender': gender,
            'hemoglobin': hemoglobin,
            'diet': diet,
            'fatigue': fatigue,
            'dizziness': dizziness,
            'pale_skin': pale_skin,
            'weakness': weakness,
            'shortness_breath': shortness_breath
        }
        
        feature_vector = np.array([[
            age, gender, hemoglobin, diet,
            fatigue, dizziness, pale_skin, weakness, shortness_breath
        ]])
        
        # Scale features
        feature_vector_scaled = scaler.transform(feature_vector)
        
        # Predict
        probability = model.predict_proba(feature_vector_scaled)[0][1]
        
        # Determine risk level
        if probability < 0.3:
            risk_level = 'Low'
        elif probability < 0.6:
            risk_level = 'Moderate'
        else:
            risk_level = 'High'
        
        # Get feature importance
        top_factors = get_feature_importance(feature_vector[0])
        
        # Get recommendations
        recommendations = get_recommendations(risk_level, probability, features)
        
        # Save to SQLite (keep existing functionality)
        conn = sqlite3.connect('hemoscan.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO screenings (age, gender, hemoglobin, diet, symptoms, risk_level, probability, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            age,
            data['gender'],
            hemoglobin,
            data['diet'],
            ','.join(symptoms_list),
            risk_level,
            float(probability),
            datetime.now().isoformat()
        ))
        conn.commit()
        conn.close()
        
        # Save to MongoDB with user association
        try:
            db = Database.get_db()
            screenings_collection = db.screenings
            
            # Create indexes if they don't exist (for first screening)
            try:
                screenings_collection.create_index("user_id")
                screenings_collection.create_index("timestamp")
            except Exception:
                pass  # Indexes already exist
            
            screening_doc = {
                'user_id': ObjectId(user_id),
                'age': age,
                'gender': data['gender'],
                'hemoglobin': hemoglobin,
                'diet': data['diet'],
                'symptoms': symptoms_list,
                'risk_level': risk_level,
                'probability': float(probability),
                'timestamp': datetime.utcnow().isoformat()
            }
            screenings_collection.insert_one(screening_doc)
        except Exception as e:
            # Log error but don't fail the request (SQLite backup still works)
            print(f"Warning: Could not save to MongoDB: {e}")
        
        # Format top factors for frontend
        formatted_factors = []
        factor_labels = {
            'age': 'Age',
            'gender': 'Gender',
            'hemoglobin': 'Hemoglobin Level',
            'diet': 'Diet Quality',
            'fatigue': 'Fatigue',
            'dizziness': 'Dizziness',
            'pale_skin': 'Pale Skin',
            'weakness': 'Weakness',
            'shortness_breath': 'Shortness of Breath'
        }
        
        for factor, importance in top_factors.items():
            formatted_factors.append({
                'factor': factor_labels.get(factor, factor),
                'importance': round(importance, 2)
            })
        
        return jsonify({
            'risk_level': risk_level,
            'risk_score': round(probability * 100, 2),
            'probability': round(probability, 4),
            'top_factors': formatted_factors,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get statistics for admin dashboard"""
    try:
        # Check if user is admin
        user_id = get_jwt_identity()
        db = Database.get_db()
        users_collection = db.users
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user or user.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get stats from SQLite (existing functionality)
        conn = sqlite3.connect('hemoscan.db')
        cursor = conn.cursor()
        
        # Total screenings
        cursor.execute('SELECT COUNT(*) FROM screenings')
        total_screenings = cursor.fetchone()[0]
        
        # Risk distribution
        cursor.execute('''
            SELECT risk_level, COUNT(*) as count
            FROM screenings
            GROUP BY risk_level
        ''')
        risk_dist = {row[0]: row[1] for row in cursor.fetchall()}
        
        # Age distribution (bins)
        cursor.execute('SELECT age FROM screenings')
        ages = [row[0] for row in cursor.fetchall()]
        
        # Recent predictions (last 10)
        cursor.execute('''
            SELECT age, gender, risk_level, probability, timestamp
            FROM screenings
            ORDER BY timestamp DESC
            LIMIT 10
        ''')
        recent = []
        for row in cursor.fetchall():
            recent.append({
                'age': row[0],
                'gender': row[1],
                'risk_level': row[2],
                'probability': round(row[3] * 100, 2),
                'timestamp': row[4]
            })
        
        conn.close()
        
        # Age distribution bins
        age_bins = {'18-30': 0, '31-45': 0, '46-60': 0, '61+': 0}
        for age in ages:
            if age <= 30:
                age_bins['18-30'] += 1
            elif age <= 45:
                age_bins['31-45'] += 1
            elif age <= 60:
                age_bins['46-60'] += 1
            else:
                age_bins['61+'] += 1
        
        return jsonify({
            'total_screenings': total_screenings,
            'risk_distribution': risk_dist,
            'age_distribution': age_bins,
            'recent_predictions': recent
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/user/predictions', methods=['GET'])
@jwt_required()
def get_user_predictions():
    """Get all predictions for the current user"""
    try:
        user_id = get_jwt_identity()
        db = Database.get_db()
        screenings_collection = db.screenings
        
        # Get all screenings for this user, sorted by timestamp (newest first)
        screenings = list(screenings_collection.find(
            {'user_id': ObjectId(user_id)}
        ).sort('timestamp', -1))
        
        # Format results
        results = []
        for screening in screenings:
            results.append({
                'id': str(screening['_id']),
                'age': screening.get('age'),
                'gender': screening.get('gender'),
                'hemoglobin': screening.get('hemoglobin'),
                'diet': screening.get('diet'),
                'symptoms': screening.get('symptoms', []),
                'risk_level': screening.get('risk_level'),
                'risk_score': round(screening.get('probability', 0) * 100, 2),
                'probability': screening.get('probability', 0),
                'timestamp': screening.get('timestamp')
            })
        
        return jsonify({
            'predictions': results,
            'total': len(results)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Load model
    if os.path.exists(MODEL_PATH):
        load_model()
    else:
        print("Model not found! Please run train_model.py first.")
        exit(1)
    
    # Run app
    app.run(debug=True, port=5000)

