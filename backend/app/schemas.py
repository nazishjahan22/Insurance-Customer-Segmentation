from pydantic import BaseModel


class CustomerData(BaseModel):
    Age: int
    Income_Level: float
    Coverage_Amount: float
    Premium_Amount: float

    Gender: str
    Marital_Status: str
    Education_Level: str
    Geographic_Information: str
    Occupation: str

    Behavioral_Data: str
    Interactions_with_Customer_Service: str
    Insurance_Products_Owned: str
    Policy_Type: str

    Customer_Preferences: str
    Preferred_Communication_Channel: str
    Preferred_Contact_Time: str
    Preferred_Language: str