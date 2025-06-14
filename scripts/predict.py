import sys
import json
import pickle
import numpy as np
from pathlib import Path

def load_model():
    model_path = Path(__file__).parent.parent / 'credit_scoring_model_v20250607_0048.pkl'
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def preprocess_input(data):
    # Convert input data to model features
    features = {
        'employment_status': data['employment_status'],
        'annual_income': float(data['annual_income']),
        'loan_amount': float(data['loan_amount']),
        'loan_purpose': data['loan_purpose'],
        'credit_history': data['credit_history']
    }
    
    # Convert categorical variables to one-hot encoding
    # Add any necessary feature scaling here
    return features

def get_risk_level(probability):
    if probability < 0.3:
        return 'Low'
    elif probability < 0.7:
        return 'Medium'
    else:
        return 'High'

def get_credit_score(probability):
    # Convert probability to credit score (300-850 range)
    return int(300 + (1 - probability) * 550)

def get_recommendations(features, probability):
    recommendations = []
    
    if probability > 0.5:
        if features['loan_amount'] / features['annual_income'] > 0.3:
            recommendations.append("Consider reducing loan amount relative to annual income")
        if features['credit_history'] in ['poor', 'bad']:
            recommendations.append("Work on improving credit history")
    
    return recommendations

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Invalid arguments'}))
        sys.exit(1)
    
    try:
        # Load input data
        input_data = json.loads(sys.argv[1])
        
        # Load model
        model = load_model()
        
        # Preprocess input
        features = preprocess_input(input_data)
        
        # Get model prediction
        probability = model.predict_proba([features])[0][1]
        
        # Generate output
        output = {
            'credit_score': get_credit_score(probability),
            'risk_level': get_risk_level(probability),
            'probability': float(probability),
            'recommendations': get_recommendations(features, probability)
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main() 