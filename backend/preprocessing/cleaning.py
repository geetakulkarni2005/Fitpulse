import pandas as pd
from pathlib import Path


# --------------------------------------------------
# 1. File paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

RAW_DATA_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "FitPulse_100m_400_Athletes_18000_Sessions.csv"
)

PROCESSED_DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "processed_training_data.csv"
)


# --------------------------------------------------
# 2. Load raw dataset
# --------------------------------------------------

def load_dataset():

    print("Loading raw FitPulse dataset...")

    df = pd.read_csv(RAW_DATA_PATH)

    print("Raw dataset loaded successfully.")
    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    return df


# --------------------------------------------------
# 3. Clean missing values
# --------------------------------------------------

def handle_missing_values(df):

    print("\n========== MISSING VALUE HANDLING ==========")

    # These missing values represent the absence of
    # injury/pain information rather than a missing
    # numerical measurement.

    if "Injury_History" in df.columns:
        df["Injury_History"] = df["Injury_History"].fillna("No Injury")

    if "Pain_Area" in df.columns:
        df["Pain_Area"] = df["Pain_Area"].fillna("None")

    if "Minor_Issue" in df.columns:
        df["Minor_Issue"] = df["Minor_Issue"].fillna("None")

    remaining_missing = df.isnull().sum()
    remaining_missing = remaining_missing[remaining_missing > 0]

    if len(remaining_missing) == 0:
        print("✓ No missing values remain.")
    else:
        print("Remaining missing values:")
        print(remaining_missing)

    return df


# --------------------------------------------------
# 4. Remove exact duplicate rows
# --------------------------------------------------

def remove_duplicates(df):

    print("\n========== DUPLICATE HANDLING ==========")

    duplicates_before = df.duplicated().sum()

    print("Duplicate rows found:", duplicates_before)

    if duplicates_before > 0:
        df = df.drop_duplicates().copy()
        print("✓ Duplicate rows removed.")
    else:
        print("✓ No duplicate rows to remove.")

    print("Rows after duplicate check:", len(df))

    return df


# --------------------------------------------------
# 5. Convert date column
# --------------------------------------------------

def convert_dates(df):

    print("\n========== DATE HANDLING ==========")

    if "Session_Date" in df.columns:

        df["Session_Date"] = pd.to_datetime(
            df["Session_Date"],
            errors="coerce"
        )

        invalid_dates = df["Session_Date"].isna().sum()

        if invalid_dates == 0:
            print("✓ All session dates are valid.")
        else:
            print(
                "WARNING:",
                invalid_dates,
                "invalid session dates found."
            )

    return df


# --------------------------------------------------
# 6. Check numerical columns
# --------------------------------------------------

def check_numerical_values(df):

    print("\n========== NUMERICAL VALUE CHECK ==========")

    numerical_columns = [
        "Age",
        "Training_Experience_Years",
        "Session_Number",
        "Training_Duration_Min",
        "Sprint_Distance_m",
        "Sprint_Repetitions",
        "Acceleration_Drills",
        "Max_Speed_Reps",
        "Plyometric_Contacts",
        "Strength_Volume_kg",
        "RPE",
        "Fatigue",
        "Soreness",
        "Pain",
        "Perceived_Recovery",
        "Sleep_Hours",
        "Rest_Days",
        "Training_Load",
        "Load_Change_Percent",
        "7_Day_Training_Load",
        "Overload_Risk_Score"
    ]

    for column in numerical_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    print("✓ Numerical columns checked.")

    return df


# --------------------------------------------------
# 7. Check logical ranges
# --------------------------------------------------

def check_ranges(df):

    print("\n========== RANGE CHECK ==========")

    checks = {

        "Age": (12, 17),

        "Training_Experience_Years": (1, 5),

        "Session_Number": (1, 45),

        "RPE": (2, 10),

        "Fatigue": (1, 9),

        "Soreness": (0, 8),

        "Pain": (0, 5),

        "Perceived_Recovery": (1, 10),

        "Sleep_Hours": (4.5, 9.5),

        "Rest_Days": (0, 3),

        "Overload_Risk_Score": (0, 100)
    }

    for column, (minimum, maximum) in checks.items():

        if column not in df.columns:
            continue

        invalid = df[
            (df[column] < minimum) |
            (df[column] > maximum)
        ]

        print(
            f"{column}: {len(invalid)} values outside expected range"
        )

    print("✓ Range check completed.")

    return df


# --------------------------------------------------
# 8. Sort training sessions
# --------------------------------------------------

def sort_sessions(df):

    print("\n========== SESSION ORDERING ==========")

    if "Athlete_ID" in df.columns and "Session_Number" in df.columns:

        df = df.sort_values(
            by=["Athlete_ID", "Session_Number"]
        ).reset_index(drop=True)

        print("✓ Sessions sorted athlete-wise.")

    return df


# --------------------------------------------------
# 9. Save processed dataset
# --------------------------------------------------

def save_processed_dataset(df):

    print("\n========== SAVING PROCESSED DATA ==========")

    PROCESSED_DATA_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        PROCESSED_DATA_PATH,
        index=False
    )

    print("✓ Processed dataset saved.")
    print("Location:")
    print(PROCESSED_DATA_PATH)

    print("\nRows saved:", len(df))
    print("Columns saved:", len(df.columns))


# --------------------------------------------------
# 10. Main cleaning pipeline
# --------------------------------------------------

def clean_dataset():

    print("==========================================")
    print("       FITPULSE DATA CLEANING")
    print("==========================================")

    df = load_dataset()

    df = handle_missing_values(df)

    df = remove_duplicates(df)

    df = convert_dates(df)

    df = check_numerical_values(df)

    df = check_ranges(df)

    df = sort_sessions(df)

    save_processed_dataset(df)

    print("\n==========================================")
    print("       DATA CLEANING COMPLETE")
    print("==========================================")


# --------------------------------------------------
# 11. Run program
# --------------------------------------------------

if __name__ == "__main__":
    clean_dataset()