import pandas as pd
from pathlib import Path


# --------------------------------------------------
# 1. File path
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

CSV_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "FitPulse_100m_400_Athletes_18000_Sessions.csv"
)


# --------------------------------------------------
# 2. Load dataset
# --------------------------------------------------

def load_dataset():
    print("Loading FitPulse dataset...")

    if not CSV_PATH.exists():
        print("\nERROR: Dataset file was not found.")
        print("Expected location:")
        print(CSV_PATH)
        return None

    df = pd.read_csv(CSV_PATH)

    print("Dataset loaded successfully.")
    return df


# --------------------------------------------------
# 3. Basic dataset information
# --------------------------------------------------

def basic_information(df):

    print("\n========== BASIC INFORMATION ==========")

    print("Number of rows:", df.shape[0])
    print("Number of columns:", df.shape[1])

    print("\nColumn names:")
    for column in df.columns:
        print("-", column)


# --------------------------------------------------
# 4. Check athletes
# --------------------------------------------------

def check_athletes(df):

    print("\n========== ATHLETE CHECK ==========")

    if "Athlete_ID" not in df.columns:
        print("WARNING: Athlete_ID column not found.")
        return

    unique_athletes = df["Athlete_ID"].nunique()

    print("Unique athletes:", unique_athletes)

    if unique_athletes == 400:
        print("✓ Athlete count is correct.")
    else:
        print("WARNING: Expected 400 athletes.")


# --------------------------------------------------
# 5. Check gender
# --------------------------------------------------

def check_gender(df):

    print("\n========== GENDER CHECK ==========")

    if "Gender" not in df.columns:
        print("WARNING: Gender column not found.")
        return

    print(df["Gender"].value_counts(dropna=False))

    gender_counts = df["Gender"].value_counts()

    if gender_counts.get("Male", 0) == 9000 and gender_counts.get("Female", 0) == 9000:
        print("✓ Male/Female session distribution is correct.")
    else:
        print("WARNING: Gender distribution differs from the expected 9000/9000.")


# --------------------------------------------------
# 6. Check sessions per athlete
# --------------------------------------------------

def check_sessions(df):

    print("\n========== SESSION CHECK ==========")

    if "Athlete_ID" not in df.columns:
        print("WARNING: Athlete_ID column not found.")
        return

    sessions = df.groupby("Athlete_ID").size()

    print("Minimum sessions:", sessions.min())
    print("Maximum sessions:", sessions.max())
    print("Average sessions:", sessions.mean())

    incorrect = sessions[sessions != 45]

    if len(incorrect) == 0:
        print("✓ Every athlete has exactly 45 sessions.")
    else:
        print("WARNING: Some athletes do not have 45 sessions.")
        print(incorrect)


# --------------------------------------------------
# 7. Check missing values
# --------------------------------------------------

def check_missing_values(df):

    print("\n========== MISSING VALUES ==========")

    missing = df.isnull().sum()
    missing = missing[missing > 0]

    if len(missing) == 0:
        print("✓ No missing values found.")
    else:
        print(missing)


# --------------------------------------------------
# 8. Check duplicate rows
# --------------------------------------------------

def check_duplicates(df):

    print("\n========== DUPLICATE CHECK ==========")

    duplicates = df.duplicated().sum()

    print("Duplicate rows:", duplicates)

    if duplicates == 0:
        print("✓ No duplicate rows found.")
    else:
        print("WARNING: Duplicate rows detected.")


# --------------------------------------------------
# 9. Inspect categorical columns
# --------------------------------------------------

def inspect_categories(df):

    print("\n========== CATEGORY INSPECTION ==========")

    columns = [
        "Gender",
        "Event",
        "Previous_Injury",
        "Injury_History",
        "Training_Intensity",
        "High_Intensity_Session",
        "Pain_Area",
        "Minor_Issue",
        "Workload_Trend",
        "Overload_Risk"
    ]

    for column in columns:

        if column in df.columns:

            print(f"\n--- {column} ---")
            print(df[column].value_counts(dropna=False))


# --------------------------------------------------
# 10. Inspect numerical ranges
# --------------------------------------------------

def inspect_numerical_ranges(df):

    print("\n========== NUMERICAL RANGE INSPECTION ==========")

    columns = [
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

    for column in columns:

        if column in df.columns:

            series = pd.to_numeric(df[column], errors="coerce")

            print(f"\n--- {column} ---")
            print("Minimum:", series.min())
            print("Maximum:", series.max())
            print("Average:", round(series.mean(), 2))


# --------------------------------------------------
# 11. Detailed inspection
# --------------------------------------------------

def detailed_inspection(df):

    inspect_categories(df)
    inspect_numerical_ranges(df)


# --------------------------------------------------
# 12. Main validation
# --------------------------------------------------

def validate_dataset():

    df = load_dataset()

    if df is None:
        return

    basic_information(df)

    check_athletes(df)

    check_gender(df)

    check_sessions(df)

    check_missing_values(df)

    check_duplicates(df)

    detailed_inspection(df)

    print("\n========== VALIDATION COMPLETE ==========")


if __name__ == "__main__":
    validate_dataset()
