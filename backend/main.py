from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data(location):
    filename = f"HCHO_{location}.csv"
    df = pd.read_csv(filename)
    df['datetime_EST'] = pd.to_datetime(df['datetime_EST'], errors='coerce')
    df = df[df['quality'] == 'high quality na']
    df.drop(['quality'], axis=1, inplace=True)
    df = df.dropna(subset=['datetime_EST', 'vertical_amount'])
    df = df.sort_values('datetime_EST')
    return df

@app.get("/data")
def get_data(
    range: str = Query("all"),
    location: str = Query("Mcmillan")
):
    df = load_data(location)
    now = df['datetime_EST'].max()

    if range == "3d":
        filtered = df[df['datetime_EST'] > now - timedelta(days=3)]
    elif range == "7d":
        filtered = df[df['datetime_EST'] > now - timedelta(days=7)]
    elif range == "1m":
        filtered = df[df['datetime_EST'] > now - timedelta(days=30)]
    else:  # full data
        filtered = df.copy()
        # Optional: downsample for full view
        filtered = filtered.resample("15T", on="datetime_EST").mean().dropna().reset_index()

    return {
        "datetime": filtered["datetime_EST"].dt.strftime("%Y-%m-%d %H:%M:%S").tolist(),
        "vertical_amount": filtered["vertical_amount"].tolist()
    }
