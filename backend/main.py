from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
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

def load_data(location, chemical):
    filename = f"{chemical}_{location}.csv"
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
    location: str = Query("Mcmillan"),
    chemical: str = Query("HCHO")  # Add this line
):
    df = load_data(location, chemical)
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

def compare_data(location, chemical, year):
    filename = f"{chemical}_{location}.csv"
    df = pd.read_csv(filename, parse_dates=["datetime_EST"])
    df = df.drop(columns=["Unnamed: 0"], errors='ignore')
    df = df[df['quality'] == 'high quality na']
    df.drop(['quality'], axis=1, inplace=True)
    df = df.dropna(subset=['datetime_EST', 'vertical_amount'])
    df = df.sort_values('datetime_EST')
    df['year'] = df['datetime_EST'].dt.year
    df = df[df['year'] == year]
    df['month'] = df['datetime_EST'].dt.month
    df = df.drop(columns=['year'])
    return df

@app.get("/compare")
def compare(
    locations: List[str] = Query(..., description="List of locations"),
    chemical: str = Query("HCHO"),
    year: int = Query(datetime.now().year)
):
    result = {}
    for loc in locations:
        df = compare_data(loc, chemical, year)
        # Add a string datetime column for easier serialization
        df["date"] = df["datetime_EST"].dt.strftime("%Y-%m-%d %H:%M:%S")
        # Group by month and collect dicts for box plot
        month_data = (
            df.groupby("month")
            .apply(lambda g: [
                {"vertical_amount": row["vertical_amount"], "date": row["date"]}
                for _, row in g.iterrows()
            ])
            .reindex(range(1, 13), fill_value=[])
            .to_dict()
        )
        result[loc] = month_data
    return result




