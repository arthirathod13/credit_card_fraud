from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import pandas as pd
import joblib


# =========================================================
# 1. CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Credit Card Fraud Detection",
    description="Credit Card Fraud Detection using Random Forest",
    version="1.0"
)


# =========================================================
# 2. LOAD TRAINED MACHINE LEARNING MODEL
# =========================================================

model = joblib.load(
    "model/fraud_detection_model.pkl"
)


# =========================================================
# 3. CONNECT STATIC FOLDER
# =========================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# =========================================================
# 4. CONNECT TEMPLATES FOLDER
# =========================================================

templates = Jinja2Templates(
    directory="templates"
)


# =========================================================
# 5. HOME PAGE
# =========================================================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


# =========================================================
# 6. PREDICTION API
# =========================================================

@app.post("/predict")
async def predict(data: dict):

    # -----------------------------------------------------
    # Get values sent from frontend
    # -----------------------------------------------------

    amount = data["amount"]

    transaction_hour = data["transaction_hour"]

    merchant_category = data["merchant_category"]

    foreign_transaction = data["foreign_transaction"]

    location_mismatch = data["location_mismatch"]

    device_trust_score = data["device_trust_score"]

    velocity_last_24h = data["velocity_last_24h"]

    cardholder_age = data["cardholder_age"]

    # -----------------------------------------------------
    # Get threshold
    # Default threshold = 0.50
    # -----------------------------------------------------

    threshold = data.get(
        "threshold",
        0.50
    )


    # =====================================================
    # CREATE INPUT DATAFRAME
    # =====================================================

    input_data = pd.DataFrame(
        [
            {
                "amount": amount,
                "transaction_hour": transaction_hour,
                "merchant_category": merchant_category,
                "foreign_transaction": foreign_transaction,
                "location_mismatch": location_mismatch,
                "device_trust_score": device_trust_score,
                "velocity_last_24h": velocity_last_24h,
                "cardholder_age": cardholder_age
            }
        ]
    )


    # =====================================================
    # GET FRAUD PROBABILITY
    # =====================================================

    probability = model.predict_proba(
        input_data
    )[0][1]


    # =====================================================
    # APPLY CLASSIFICATION THRESHOLD
    # =====================================================

    if probability >= threshold:

        prediction = 1

        result = "Fraudulent Transaction"

    else:

        prediction = 0

        result = "Legitimate Transaction"


    # =====================================================
    # RETURN RESULT TO FRONTEND
    # =====================================================

    return {
        "prediction": prediction,

        "result": result,

        "fraud_probability": round(
            probability * 100,
            2
        ),

        "threshold": round(
            threshold * 100,
            2
        )
    }
