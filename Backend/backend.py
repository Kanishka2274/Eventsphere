from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Feedback(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "EventSphere AI Backend Running"}

@app.post("/analyze")
def analyze(feedback: Feedback):

    analysis = TextBlob(feedback.text)
    polarity = analysis.sentiment.polarity

    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "feedback": feedback.text,
        "sentiment": sentiment,
        "score": polarity
    }