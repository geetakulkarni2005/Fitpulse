import sys
from pathlib import Path

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


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


def _load_data():
    """
    Load the FitPulse training dataset.
    """

    if PROCESSED_DATA_PATH.exists():
        return pd.read_csv(PROCESSED_DATA_PATH)

    if RAW_DATA_PATH.exists():
        return pd.read_csv(RAW_DATA_PATH)

    raise FileNotFoundError(
        "FitPulse training dataset was not found."
    )


def get_training_history(athlete_id):
    """
    Return the complete training history of one athlete.
    """

    df = _load_data()

    if "Athlete_ID" not in df.columns:
        raise ValueError(
            "Athlete_ID column is missing from the dataset."
        )

    athlete_data = df[
        df["Athlete_ID"].astype(str) == str(athlete_id)
    ].copy()

    if athlete_data.empty:
        return []

    if "Session_ID" in athlete_data.columns:
        athlete_data = athlete_data.sort_values("Session_ID")

    elif "Session_Date" in athlete_data.columns:
        athlete_data = athlete_data.sort_values("Session_Date")

    athlete_data = athlete_data.replace(
        {pd.NA: None}
    )

    athlete_data = athlete_data.where(
        pd.notna(athlete_data),
        None
    )

    return athlete_data.to_dict(orient="records")


def get_training_session(athlete_id, session_id):
    """
    Return one training session for an athlete.
    """

    df = _load_data()

    if "Athlete_ID" not in df.columns:
        raise ValueError(
            "Athlete_ID column is missing from the dataset."
        )

    if "Session_ID" not in df.columns:
        raise ValueError(
            "Session_ID column is missing from the dataset."
        )

    session_data = df[
        (df["Athlete_ID"].astype(str) == str(athlete_id))
        & (df["Session_ID"].astype(str) == str(session_id))
    ]

    if session_data.empty:
        return None

    record = session_data.iloc[0].to_dict()

    cleaned_record = {}

    for key, value in record.items():
        if pd.isna(value):
            cleaned_record[key] = None
        elif hasattr(value, "item"):
            cleaned_record[key] = value.item()
        else:
            cleaned_record[key] = value

    return cleaned_record


def get_training_summary(athlete_id):
    """
    Return basic training statistics for one athlete.
    """

    df = _load_data()

    if "Athlete_ID" not in df.columns:
        raise ValueError(
            "Athlete_ID column is missing from the dataset."
        )

    athlete_data = df[
        df["Athlete_ID"].astype(str) == str(athlete_id)
    ].copy()

    if athlete_data.empty:
        return None

    summary = {
        "athlete_id": str(athlete_id),
        "session_count": int(len(athlete_data))
    }

    numeric_columns = [
        "Training_Load",
        "Training_Duration",
        "RPE",
        "Fatigue",
        "Soreness",
        "Pain",
        "Recovery",
        "Training_Intensity"
    ]

    for column in numeric_columns:

        if column in athlete_data.columns:

            values = pd.to_numeric(
                athlete_data[column],
                errors="coerce"
            )

            values = values.dropna()

            if not values.empty:
                summary[f"average_{column.lower()}"] = float(
                    values.mean()
                )

                summary[f"maximum_{column.lower()}"] = float(
                    values.max()
                )

    if "Training_Load" in athlete_data.columns:

        loads = pd.to_numeric(
            athlete_data["Training_Load"],
            errors="coerce"
        ).dropna()

        if not loads.empty:
            summary["total_training_load"] = float(
                loads.sum()
            )

    if "Overload_Risk" in athlete_data.columns:

        risk_counts = (
            athlete_data["Overload_Risk"]
            .value_counts()
            .to_dict()
        )

        summary["risk_distribution"] = {
            str(key): int(value)
            for key, value in risk_counts.items()
        }

    return summary


def get_training_analytics(athlete_id):
    """
    Return training data required for training analytics charts.
    """

    history = get_training_history(athlete_id)

    if not history:
        return []

    analytics = []

    for session in history:

        record = {}

        for key in [
            "Athlete_ID",
            "Session_ID",
            "Session_Date",
            "Training_Load",
            "Training_Duration",
            "RPE",
            "Fatigue",
            "Soreness",
            "Pain",
            "Recovery",
            "Training_Intensity",
            "Overload_Risk"
        ]:

            if key in session:
                record[key] = session[key]

        analytics.append(record)

    return analytics


if __name__ == "__main__":

    print("FitPulse Training Service")
    print("=" * 55)

    athlete_id = "A001"

    history = get_training_history(athlete_id)

    print("\nAthlete:", athlete_id)
    print("Training sessions:", len(history))

    if history:
        print("\nFirst training session:")
        print(history[0])

    print("\nTraining summary:")
    print(get_training_summary(athlete_id))

    print("\nTraining analytics records:")
    analytics = get_training_analytics(athlete_id)
    print("Records:", len(analytics))