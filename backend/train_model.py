"""
ML Model Training Script for HemoScan AI
Generates medically accurate synthetic dataset and trains improved model
Based on WHO anemia classification and medical research
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import os

def generate_synthetic_data(n_samples=5000):
    """Generate medically accurate synthetic anemia risk dataset"""
    np.random.seed(42)
    
    # Generate features with realistic distributions
    age = np.random.randint(18, 80, n_samples)
    gender = np.random.choice([0, 1], n_samples)  # 0: Female, 1: Male
    
    # Hemoglobin levels based on medical standards:
    # Normal: Male 13-17 g/dL, Female 12-15 g/dL
    # Mild anemia: 10-12 (F), 10-13 (M)
    # Moderate: 8-10
    # Severe: <8
    
    # Generate hemoglobin with gender-specific normal ranges
    hemoglobin_base = np.where(
        gender == 0,  # Female
        np.random.normal(13.5, 1.5, n_samples),  # Female normal: 12-15
        np.random.normal(15.0, 1.5, n_samples)   # Male normal: 13-17
    )
    
    # Add some anemia cases (lower hemoglobin)
    anemia_prob = 0.3  # 30% chance of some level of anemia
    anemia_mask = np.random.random(n_samples) < anemia_prob
    anemia_severity = np.random.choice([0, 1, 2, 3], n_samples, p=[0.4, 0.3, 0.2, 0.1])
    # 0: normal, 1: mild, 2: moderate, 3: severe
    
    hemoglobin = np.where(
        anemia_mask,
        np.where(anemia_severity == 1, np.random.normal(11.0, 0.8, n_samples),  # Mild
        np.where(anemia_severity == 2, np.random.normal(9.0, 0.8, n_samples),   # Moderate
        np.where(anemia_severity == 3, np.random.normal(7.0, 0.8, n_samples),   # Severe
        hemoglobin_base))),
        hemoglobin_base
    )
    
    hemoglobin = np.clip(hemoglobin, 5, 18)  # Realistic range
    
    # Diet: 0=Poor, 1=Moderate, 2=Good
    # Poor diet increases anemia risk
    diet = np.random.choice([0, 1, 2], n_samples, p=[0.25, 0.45, 0.30])
    
    # Symptoms correlated with hemoglobin levels
    # Lower hemoglobin = higher symptom probability
    symptom_base_prob = 1 / (1 + np.exp((hemoglobin - 12) / 2))
    
    fatigue = (np.random.random(n_samples) < (symptom_base_prob * 0.9 + 0.1)).astype(int)
    dizziness = (np.random.random(n_samples) < (symptom_base_prob * 0.7 + 0.05)).astype(int)
    pale_skin = (np.random.random(n_samples) < (symptom_base_prob * 0.6 + 0.05)).astype(int)
    weakness = (np.random.random(n_samples) < (symptom_base_prob * 0.8 + 0.1)).astype(int)
    shortness_breath = (np.random.random(n_samples) < (symptom_base_prob * 0.5 + 0.05)).astype(int)
    
    # Calculate symptom count
    symptom_count = fatigue + dizziness + pale_skin + weakness + shortness_breath
    
    # Create medically accurate target variable
    # Based on WHO anemia classification and clinical indicators
    
    # Hemoglobin-based risk (primary indicator)
    hb_risk = np.where(
        gender == 0,  # Female
        np.where(hemoglobin < 12, 1, 0),  # Female: <12 is anemic
        np.where(hemoglobin < 13, 1, 0)   # Male: <13 is anemic
    )
    
    # Symptom-based risk (secondary indicator)
    symptom_risk = (symptom_count >= 3).astype(int)
    
    # Diet-based risk
    diet_risk = (diet == 0).astype(int)
    
    # Age factor (elderly more at risk)
    age_risk = (age > 65).astype(int)
    
    # Combined risk calculation (medically weighted)
    # Hemoglobin is most important (60%), symptoms (25%), diet (10%), age (5%)
    combined_risk = (
        hb_risk * 0.60 +
        symptom_risk * 0.25 +
        diet_risk * 0.10 +
        age_risk * 0.05
    )
    
    # Create probability score (0-1)
    # Add some noise for realism
    noise = np.random.normal(0, 0.1, n_samples)
    risk_probability = np.clip(combined_risk + noise, 0, 1)
    
    # Create three-class target for better risk stratification
    # 0: Low (prob < 0.3), 1: Moderate (0.3-0.7), 2: High (>0.7)
    target = np.where(
        risk_probability < 0.3, 0,
        np.where(risk_probability < 0.7, 1, 2)
    )
    
    # Binary target for compatibility
    target_binary = (risk_probability > 0.5).astype(int)
    
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
        'target': target_binary,
        'target_multi': target
    })
    
    return df

def train_model():
    """Train and save improved ML model"""
    print("Generating medically accurate synthetic dataset...")
    df = generate_synthetic_data(5000)  # Increased dataset size
    
    # Prepare features with additional engineered features
    base_features = ['age', 'gender', 'hemoglobin', 'diet', 
                     'fatigue', 'dizziness', 'pale_skin', 'weakness', 'shortness_breath']
    
    # Add engineered features for better accuracy
    df['symptom_count'] = df[['fatigue', 'dizziness', 'pale_skin', 'weakness', 'shortness_breath']].sum(axis=1)
    df['hb_gender_interaction'] = df['hemoglobin'] * (1 - df['gender'])  # Lower threshold for females
    df['age_normalized'] = (df['age'] - 18) / (80 - 18)  # Normalize age
    
    feature_cols = base_features + ['symptom_count']
    
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
    
    # Try multiple models and select the best
    print("\nTraining and comparing models...")
    
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        ),
        'Logistic Regression': LogisticRegression(
            random_state=42,
            max_iter=2000,
            C=1.0,
            solver='lbfgs'
        )
    }
    
    best_model = None
    best_score = 0
    best_name = ''
    
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        # Calculate AUC for better evaluation
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
        auc_score = roc_auc_score(y_test, y_pred_proba)
        
        print(f"\n{name}:")
        print(f"  Training Accuracy: {train_score:.4f}")
        print(f"  Test Accuracy: {test_score:.4f}")
        print(f"  AUC Score: {auc_score:.4f}")
        
        # Select model with best test accuracy and AUC
        combined_score = test_score * 0.6 + auc_score * 0.4
        if combined_score > best_score:
            best_score = combined_score
            best_model = model
            best_name = name
    
    print(f"\n[OK] Best Model: {best_name} (Score: {best_score:.4f})")
    
    # Detailed evaluation of best model
    print("\nDetailed Classification Report:")
    y_pred = best_model.predict(X_test_scaled)
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(best_model, 'models/model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Save feature names for later use
    joblib.dump(feature_cols, 'models/feature_names.pkl')
    
    print("\nModel saved successfully!")
    print(f"Model files saved in: {os.path.abspath('models')}")
    print(f"Model type: {best_name}")
    
    return best_model, scaler, feature_cols

if __name__ == '__main__':
    train_model()


