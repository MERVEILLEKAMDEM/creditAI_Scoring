from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import os
import logging
from typing import Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to model files
MODEL_PATH = os.path.join("scripts", "credit_scoring_model.pkl")
COLUMNS_PATH = os.path.join("scripts", "model_columns.pkl")

# Load model and columns
try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    logger.info("Model loaded successfully")
    
    with open(COLUMNS_PATH, 'rb') as f:
        model_columns = pickle.load(f)
    logger.info(f"Model column structure: {model_columns}")
except Exception as e:
    logger.error(f"Failed to load model or columns: {str(e)}")
    raise RuntimeError("Failed to initialize model") from e

def prepare_input_data(input_data: Dict[str, Any]) -> pd.DataFrame:
    """Prepare input data in the exact structure the model expects"""
    try:
        # Convert has_guarantee from string to bool if needed
        if isinstance(input_data['has_guarantee'], str):
            has_guarantee_bool = input_data['has_guarantee'].lower() == 'true'
        else:
            has_guarantee_bool = input_data['has_guarantee']
        
        # Create DataFrame with individual columns that the model expects
        df = pd.DataFrame([{
            'age': input_data['age'],
            'income': input_data['income'],
            'loan_amount': input_data['loan_amount'],
            'interest_rate': input_data['interest_rate'],
            'turnover': input_data['turnover'],
            'customer_tenure': input_data['customer_tenure'],
            'num_late_payments_current': input_data['num_late_payments_current'],
            'unpaid_amount': input_data['unpaid_amount'],
            'industry_sector': input_data['industry_sector'],
            'credit_type': input_data['credit_type'],
            'has_guarantee': str(has_guarantee_bool),  # Keep as string for model
            'guarantee_type': input_data['guarantee_type'],
            'repayment_frequency': input_data['repayment_frequency']
        }])
        
        logger.info(f"Final DataFrame columns: {df.columns.tolist()}")
        logger.info(f"Final DataFrame values: {df.values.tolist()}")
        
        return df
        
    except KeyError as e:
        missing = str(e).strip("'")
        raise ValueError(f"Missing required field: {missing}")
    except Exception as e:
        logger.error(f"Data preparation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Credit Scoring API is running!"}

@app.get("/model-info")
def get_model_info():
    """Get information about the model's expected input structure"""
    # Handle different types of model_columns
    if isinstance(model_columns, dict):
        expected_columns = list(model_columns.keys())
    elif isinstance(model_columns, list):
        expected_columns = model_columns
    else:
        expected_columns = list(model_columns)
    
    return {
        "expected_columns": expected_columns,
        "model_type": type(model).__name__,
        "message": "Model is loaded and ready"
    }

@app.post("/predict")
async def predict(request: Request):
    try:
        # Get input data
        data = await request.json()
        logger.info(f"Received data: {data}")
        
        # Prepare the input data
        df = prepare_input_data(data)
        logger.info(f"Prepared DataFrame structure: {df.to_dict()}")
        
        # Make prediction
        prediction = model.predict(df)[0]
        proba = model.predict_proba(df)[0]
        
        return {
            "prediction": int(prediction),
            "probability_good": float(proba[0]),
            "probability_bad": float(proba[1]),
            "risk_level": "Low Risk" if prediction == 0 else "High Risk"
        }
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))