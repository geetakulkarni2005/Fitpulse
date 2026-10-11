import sys
from pathlib import Path

import pandas as pd


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# DATASET PATHS
# ============================================================

PROCESSED_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "processed"
    / "processed_training_data.csv"
)

RAW_DATA_PATH = (
    PROJECT_ROOT
    / "data"
    / "raw"
    / "FitPulse_100m_400_Athletes_18000_Sessions.csv"
)


# ============================================================
# LOAD DATA
# ============================================================

def _load_data():
    """
    Load the processed FitPulse dataset.

    If the processed dataset does not exist,
    the raw dataset will be used instead.
    """

    if PROCESSED_DATA_PATH.exists():
        return pd.read_csv(PROCESSED_DATA_PATH)

    if RAW_DATA_PATH.exists():
        return pd.read_csv(RAW_DATA_PATH)

    raise FileNotFoundError(
        "FitPulse dataset was not found."
    )


# ============================================================
# GET ALL ATHLETES
# ============================================================

def get_all_athletes():
    """
    Return one record for each unique athlete.
    """

    df = _load_data()

    if "Athlete_ID" not in df.columns:
        raise ValueError(
            "Athlete_ID column is missing from the dataset."
        )

    athlete_columns = [
        column
        for column in [
            "Athlete_ID",
            "Athlete_Name",
            "Age",
            "Gender",
            "Event"
        ]
        if column in df.columns
    ]

    athletes = (
        df[athlete_columns]
        .drop_duplicates(subset=["Athlete_ID"])
        .sort_values("Athlete_ID")
        .reset_index(drop=True)
    )

    # Convert all pandas / NumPy values
    # into normal Python values.
    athletes = athletes.where(
        pd.notna(athletes),
        None
    )

    records = athletes.to_dict(orient="records")

    # Make sure NumPy values are converted to
    # JSON-compatible Python values.
    clean_records = []

    for record in records:
        clean_record = {}

        for key, value in record.items():

            if hasattr(value, "item"):
                value = value.item()

            clean_record[key] = value

        clean_records.append(clean_record)

    return clean_records


# ============================================================
# GET SINGLE ATHLETE
# ============================================================

def get_athlete(athlete_id):
    """
    Return information for a single athlete.
    """

    df = _load_data()

    if "Athlete_ID" not in df.columns:
        raise ValueError(
            "Athlete_ID column is missing from the dataset."
        )

    athlete_data = df[
        df["Athlete_ID"].astype(str) == str(athlete_id)
    ]

    if athlete_data.empty:
        return None

    # Take the first training/session record
    # for the selected athlete.
    first_record = athlete_data.iloc[0]

    result = {}

    for column in [
        "Athlete_ID",
        "Athlete_Name",
        "Age",
        "Gender",
        "Event"
    ]:

        if column in athlete_data.columns:

            value = first_record[column]

            # Convert NaN to None.
            if pd.isna(value):
                value = None

            # Convert NumPy values such as:
            # numpy.int64
            # numpy.float64
            # into normal Python values.
            elif hasattr(value, "item"):
                value = value.item()

            result[column] = value

    # Number of training/session records
    # available for this athlete.
    result["session_count"] = int(len(athlete_data))

    return result


# ============================================================
# TESTING
# ============================================================

if __name__ == "__main__":

    print("FitPulse Athlete Service")
    print("=" * 55)

    try:

        athletes = get_all_athletes()

        print("Total athletes:", len(athletes))

        if athletes:

            print("\nFirst athlete:")
            print(athletes[0])

            athlete_id = athletes[0]["Athlete_ID"]

            print("\nAthlete lookup:")
            print(get_athlete(athlete_id))

    except Exception as e:

        print("\nERROR:")
        print(type(e).__name__)
        print(str(e))