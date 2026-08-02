import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "kmeans_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "model", "columns.pkl")


kmeans_model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
columns = joblib.load(COLUMNS_PATH)


def predict_cluster(customer_data):

    # Convert input to dataframe
    data = pd.DataFrame([customer_data.dict()])

    # Convert column names same as training
    data.columns = [
        col.replace("_", " ")
        for col in data.columns
    ]

    # One hot encoding
    data = pd.get_dummies(data)

    # Add missing columns
    for col in columns:
        if col not in data.columns:
            data[col] = 0

    # Remove extra columns and keep same order
    data = data[columns]

    # Scaling
    scaled_data = scaler.transform(data)

    # Prediction
    cluster = kmeans_model.predict(scaled_data)

    return int(cluster[0])


def get_cluster_description(cluster):

    segments = {
        0: "Budget Customers",
        1: "Premium Customers",
        2: "Regular Customers",
        3: "High Value Customers"
    }

    return segments.get(
        cluster,
        "Unknown Segment"
    )