"""
ML Model Training Script for HemoScan AI
Generates synthetic dataset and trains Logistic Regression model
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os

def generate_synthetic_data(n_samples=2000):
    """Generate synthetic anemia risk dataset"""
    np.random.seed(42)
    
    # Generate features
    age = np.random.randint(18, 80, n_samples)
    gender = np.random.choice([0, 1], n_samples)  # 0: Female, 1: Male
    hemoglobin = np.random.normal(12, 3, n_samples)
    hemoglobin = np.clip(hemoglobin, 5, 18)  # Realistic range
    
    # Diet: 0=Poor, 1=Moderate, 2=Good
    diet = np.random.choice([0, 1, 2], n_samples, p=[0.3, 0.4, 0.3])
    
    # Symptoms (binary)
    fatigue = np.random.choice([0, 1], n_samples, p=[0.4, 0.6])
    dizziness = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    pale_skin = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    weakness = np.random.choice([0, 1], n_samples, p=[0.5, 0.5])
    shortness_breath = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Calculate symptom count
    symptom_count = fatigue + dizziness + pale_skin + weakness + shortness_breath
    
    # Create target variable (anemia risk)
    # Higher risk if: low hemoglobin, multiple symptoms, poor diet, female, older
    risk_score = (
        (15 - hemoglobin) * 0.3 +  # Lower hemoglobin = higher risk
        symptom_count * 0.2 +
        (2 - diet) * 0.15 +  # Poor diet = higher risk
        (1 - gender) * 0.1 +  # Female = slightly higher risk
        (age / 100) * 0.05
    )
    
    # Normalize risk score to probability
    risk_probability = 1 / (1 + np.exp(-(risk_score - 3)))
    
    # Create binary target (1 = high risk, 0 = low risk)
    target = (risk_probability > 0.5).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'age': age,
        'gender': gender,
        'hemoglobin': hemoglobin,
        'diet': diet,
        'fatigue': fatigue,
        'dizziness': dizziness,
        'pale_skin': pale_skin,
        'weakness': weakness,
        'shortness_breath': shortness_breath,
        'symptom_count': symptom_count,
        'risk_probability': risk_probability,
        'target': target
    })
    
    return df

def train_model():
    """Train and save the ML model"""
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(2000)
    
    # Prepare features
    feature_cols = ['age', 'gender', 'hemoglobin', 'diet', 
                   'fatigue', 'dizziness', 'pale_skin', 'weakness', 'shortness_breath']
    X = df[feature_cols]
    y = df['target']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Logistic Regression model...")
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    print(f"Training Accuracy: {train_score:.4f}")
    print(f"Test Accuracy: {test_score:.4f}")
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Save feature names for later use
    joblib.dump(feature_cols, 'models/feature_names.pkl')
    
    print("Model saved successfully!")
    print(f"Model files saved in: {os.path.abspath('models')}")
    
    return model, scaler, feature_cols

if __name__ == '__main__':
    train_model()


