"""
Test script to verify feature importance works with Random Forest
"""

import joblib
import numpy as np
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Load model and dependencies
model = joblib.load('models/model.pkl')
scaler = joblib.load('models/scaler.pkl')
feature_names = joblib.load('models/feature_names.pkl')

print("Model type:", type(model).__name__)
print("Has feature_importances_:", hasattr(model, 'feature_importances_'))
print("Has coef_:", hasattr(model, 'coef_'))
print("\nFeature names:", feature_names)

# Test feature importance calculation
test_features = np.array([[35, 0, 11.5, 1, 1, 1, 0, 1, 0, 3]])  # 10 features
test_scaled = scaler.transform(test_features)

# Simulate the get_feature_importance function
if hasattr(model, 'feature_importances_'):
    print("\nUsing feature_importances_ (Random Forest)")
    importances = model.feature_importances_
    print("Feature importances:", importances)
    print("Sum:", sum(importances))
    
    # Create importance dictionary
    importance = {}
    for i, feature in enumerate(feature_names):
        importance[feature] = importances[i] * 100
    
    print("\nTop 5 factors:")
    sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    for feature, value in sorted_importance[:5]:
        print(f"  {feature}: {value:.2f}%")
    
    print("\n[OK] Feature importance calculation works!")
else:
    print("\n[ERROR] Model doesn't have feature_importances_")

