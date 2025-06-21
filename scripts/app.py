import streamlit as st
import pandas as pd
import pickle
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

# Load model and column information
with open('credit_scoring_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model_columns.pkl', 'rb') as f:
    model_columns = pickle.load(f)

# App title and description
st.title("Credit Scoring Application")
st.write("""
This application predicts whether a loan applicant is likely to default (status = 1) or not (status = 0).
""")

# Sidebar for navigation
st.sidebar.title("Navigation")
options = st.sidebar.radio("Select a page:", 
                          ["Home", "Make Prediction", "Data Visualization"])

if options == "Home":
    st.header("Welcome to the Credit Scoring System")
    st.write("""
    This system uses machine learning to assess credit risk based on applicant information.
    """)
    
    # Add some visualizations or key metrics
    st.subheader("Key Metrics")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Model Accuracy", "85%")
    with col2:
        st.metric("Default Prediction Rate", "12%")
    
    st.write("""
    Navigate using the sidebar to make predictions or view data visualizations.
    """)

elif options == "Make Prediction":
    st.header("Loan Applicant Assessment")
    st.write("Please enter the applicant details:")
    
    # Create input form
    with st.form("applicant_details"):
        # Numeric inputs
        age = st.number_input("Age", min_value=18, max_value=100, value=30)
        income = st.number_input("Annual Income", min_value=0, value=50000)
        loan_amount = st.number_input("Loan Amount", min_value=0, value=20000)
        interest_rate = st.number_input("Interest Rate (%)", min_value=0.0, max_value=30.0, value=5.0)
        turnover = st.number_input("Business Turnover", min_value=0, value=100000)
        customer_tenure = st.number_input("Customer Tenure (years)", min_value=0, max_value=50, value=2)
        num_late_payments_current = st.number_input("Number of Late Payments (current)", min_value=0, value=0)
        unpaid_amount = st.number_input("Unpaid Amount", min_value=0, value=0)
        
        # Categorical inputs
        industry_sector = st.selectbox("Industry Sector", 
                                     ['Construction', 'Retail', 'Manufacturing', 'Services', 'Agriculture'])
        credit_type = st.selectbox("Credit Type", 
                                 ['Overdraft', 'Term Loan', 'Line of Credit', 'Credit Card'])
        has_guarantee = st.selectbox("Has Guarantee?", ['True', 'False'])
        guarantee_type = st.selectbox("Guarantee Type (if applicable)", 
                                    ['Collateral', 'Personal', 'Corporate', 'None'])
        repayment_frequency = st.selectbox("Repayment Frequency", 
                                         ['Monthly', 'Quarterly', 'Annually', 'Bi-weekly'])
        
        submitted = st.form_submit_button("Assess Credit Risk")
    
    if submitted:
        # Create input dataframe
        input_data = pd.DataFrame({
            'age': [age],
            'income': [income],
            'loan_amount': [loan_amount],
            'interest_rate': [interest_rate],
            'turnover': [turnover],
            'customer_tenure': [customer_tenure],
            'num_late_payments_current': [num_late_payments_current],
            'unpaid_amount': [unpaid_amount],
            'industry_sector': [industry_sector],
            'credit_type': [credit_type],
            'has_guarantee': [has_guarantee],
            'guarantee_type': [guarantee_type],
            'repayment_frequency': [repayment_frequency]
        })
        
        # Make prediction
        prediction = model.predict(input_data)
        prediction_proba = model.predict_proba(input_data)
        
        # Display results
        st.subheader("Credit Risk Assessment Result")
        if prediction[0] == 1:
            st.error("High Risk: Potential default (Probability: {:.2f}%)".format(prediction_proba[0][1]*100))
        else:
            st.success("Low Risk: Likely to repay (Probability: {:.2f}%)".format(prediction_proba[0][0]*100))
        
        # Show probability breakdown
        st.write("Probability Breakdown:")
        proba_df = pd.DataFrame({
            'Status': ['Good (Will repay)', 'Bad (Likely to default)'],
            'Probability': [prediction_proba[0][0], prediction_proba[0][1]]
        })
        st.bar_chart(proba_df.set_index('Status'))

elif options == "Data Visualization":
    st.header("Data Visualizations")
    st.write("Here are some insights from the credit data:")
    
    # You would add your data visualizations here
    # For example:
    st.subheader("Loan Amount Distribution")
    # You would load your actual data here
    # For demo purposes, we'll use a sample
    sample_data = pd.DataFrame({
        'loan_amount': [10000, 15000, 20000, 25000, 30000, 35000, 40000],
        'count': [120, 180, 220, 150, 100, 50, 30]
    })
    st.bar_chart(sample_data.set_index('loan_amount'))
    
    st.subheader("Default Rate by Industry")
    industry_data = pd.DataFrame({
        'industry': ['Construction', 'Retail', 'Manufacturing', 'Services', 'Agriculture'],
        'default_rate': [0.15, 0.08, 0.10, 0.07, 0.12]
    })
    st.bar_chart(industry_data.set_index('industry'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)