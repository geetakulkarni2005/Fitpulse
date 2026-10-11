
import pandas as pd
from pathlib import Path

file = Path("data/processed/processed_training_data.csv")

if not file.exists():
    file = Path("data/raw/FitPulse_100m_400_Athletes_18000_Sessions.csv")

df = pd.read_csv(file)

print("Dataset file:", file.name)
print("Total records:", len(df))
print("Total athletes:", df["Athlete_ID"].nunique())
print("Columns:", df.columns.tolist())

if "Session_ID" in df.columns:
    print("Unique sessions:", df["Session_ID"].nunique())