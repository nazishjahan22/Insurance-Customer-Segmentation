from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import CustomerData
from app.predict import predict_cluster, get_cluster_description

app = FastAPI(title="Customer Segmentation API")


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Development ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to the Customer Segmentation API"
    }


@app.post("/predict")
def predict(customer: CustomerData):

    cluster = predict_cluster(customer)

    return {
        "cluster": cluster,
        "customer_segment": get_cluster_description(cluster)
    }