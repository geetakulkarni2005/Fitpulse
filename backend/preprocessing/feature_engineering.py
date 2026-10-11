import pandas as pd
from pathlib import Path


# ==================================================
# 1. FILE PATHS
# ==================================================

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "processed_training_data.csv"
)

OUTPUT_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "processed_training_data.csv"
)


# ==================================================
# 2. LOAD CLEANED DATASET
# ==================================================

def load_dataset():

    print("Loading cleaned FitPulse dataset...")

    if not INPUT_PATH.exists():

        print("\nERROR: processed_training_data.csv was not found.")
        print("Expected location:")
        print(INPUT_PATH)

        raise FileNotFoundError(INPUT_PATH)

    df = pd.read_csv(INPUT_PATH)

    print("Dataset loaded successfully.")
    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    return df


# ==================================================
# 3. CREATE PREVIOUS-SESSION FEATURES
# ==================================================

def create_previous_session_features(df):

    print("\n========== PREVIOUS SESSION FEATURES ==========")

    df = df.sort_values(
        by=["Athlete_ID", "Session_Number"]
    ).reset_index(drop=True)

    # Previous training load
    df["Previous_Training_Load"] = (
        df.groupby("Athlete_ID")["Training_Load"]
        .shift(1)
    )

    # Previous fatigue
    df["Previous_Fatigue"] = (
        df.groupby("Athlete_ID")["Fatigue"]
        .shift(1)
    )

    # Previous soreness
    df["Previous_Soreness"] = (
        df.groupby("Athlete_ID")["Soreness"]
        .shift(1)
    )

    # Previous pain
    df["Previous_Pain"] = (
        df.groupby("Athlete_ID")["Pain"]
        .shift(1)
    )

    # Previous perceived recovery
    df["Previous_Recovery"] = (
        df.groupby("Athlete_ID")["Perceived_Recovery"]
        .shift(1)
    )

    # Correct mapping to actual dataset columns
    current_column_map = {

        "Previous_Training_Load": "Training_Load",

        "Previous_Fatigue": "Fatigue",

        "Previous_Soreness": "Soreness",

        "Previous_Pain": "Pain",

        "Previous_Recovery": "Perceived_Recovery"
    }

    # First session of each athlete has no previous session.
    # Use current value for that first session.
    for previous_column, current_column in current_column_map.items():

        df[previous_column] = df[previous_column].fillna(
            df[current_column]
        )

    print("✓ Previous-session features created.")

    return df


# ==================================================
# 4. CREATE TRAINING-LOAD FEATURES
# ==================================================

def create_training_load_features(df):

    print("\n========== TRAINING LOAD FEATURES ==========")

    # Difference between current and previous load
    df["Training_Load_Difference"] = (
        df["Training_Load"]
        - df["Previous_Training_Load"]
    )

    # Percentage change from previous session
    df["Calculated_Load_Change_Percent"] = (
        (
            df["Training_Load"]
            - df["Previous_Training_Load"]
        )
        / df["Previous_Training_Load"].replace(0, pd.NA)
    ) * 100

    df["Calculated_Load_Change_Percent"] = (
        df["Calculated_Load_Change_Percent"]
        .fillna(0)
    )

    # Compare current load with average daily load
    # represented by 7-day training load
    df["Training_Load_Ratio"] = (
        df["Training_Load"]
        / (df["7_Day_Training_Load"] / 7)
    )

    df["Training_Load_Ratio"] = (
        df["Training_Load_Ratio"]
        .replace(
            [float("inf"), float("-inf")],
            0
        )
        .fillna(0)
    )

    print("✓ Training-load features created.")

    return df


# ==================================================
# 5. CREATE WELLNESS FEATURES
# ==================================================

def create_wellness_features(df):

    print("\n========== WELLNESS FEATURES ==========")

    # Overall physical stress
    df["Physical_Stress_Score"] = (
        df["Fatigue"]
        + df["Soreness"]
        + df["Pain"]
    )

    # Recovery-related stress
    df["Recovery_Stress_Score"] = (
        (10 - df["Perceived_Recovery"])
        + (8 - df["Sleep_Hours"])
    )

    # Training stress
    df["Training_Stress_Score"] = (
        df["RPE"]
        + df["Fatigue"]
        + df["Soreness"]
    )

    print("✓ Wellness features created.")

    return df


# ==================================================
# 6. CREATE INJURY FEATURES
# ==================================================

def create_injury_features(df):

    print("\n========== INJURY FEATURES ==========")

    # Previous injury flag
    df["Previous_Injury_Flag"] = (
        df["Previous_Injury"]
        .map({
            "Yes": 1,
            "No": 0
        })
        .fillna(0)
        .astype(int)
    )

    # Current pain flag
    df["Pain_Flag"] = (
        df["Pain"] > 0
    ).astype(int)

    # Minor issue flag
    df["Minor_Issue_Flag"] = (
        df["Minor_Issue"]
        .ne("None")
        .astype(int)
    )

    # Injury history flag
    df["Injury_History_Flag"] = (
        df["Injury_History"]
        .ne("No Injury")
        .astype(int)
    )

    print("✓ Injury-related features created.")

    return df


# ==================================================
# 7. CREATE INTENSITY FEATURES
# ==================================================

def create_intensity_features(df):

    print("\n========== INTENSITY FEATURES ==========")

    # High-intensity session flag
    df["High_Intensity_Flag"] = (
        df["High_Intensity_Session"]
        .map({
            "Yes": 1,
            "No": 0
        })
        .fillna(0)
        .astype(int)
    )

    # Training intensity score
    df["Training_Intensity_Score"] = (
        df["Training_Intensity"]
        .map({
            "Low": 1,
            "Moderate": 2,
            "High": 3
        })
        .fillna(0)
        .astype(int)
    )

    print("✓ Intensity features created.")

    return df


# ==================================================
# 8. CREATE SESSION FEATURES
# ==================================================

def create_session_features(df):

    print("\n========== SESSION FEATURES ==========")

    # Training progress
    df["Session_Progress"] = (
        df["Session_Number"] / 45
    )

    # Training phase
    df["Training_Phase"] = pd.cut(
        df["Session_Number"],
        bins=[0, 15, 30, 45],
        labels=[
            "Early",
            "Middle",
            "Late"
        ]
    )

    print("✓ Session progression features created.")

    return df


# ==================================================
# 9. CLEAN CATEGORICAL VALUES
# ==================================================

def clean_categorical_values(df):

    print("\n========== CATEGORICAL VALUE CHECK ==========")

    # These fields originally contained missing values.
    # Convert them to explicit "None" categories.

    if "Pain_Area" in df.columns:

        df["Pain_Area"] = (
            df["Pain_Area"]
            .fillna("None")
        )

    if "Minor_Issue" in df.columns:

        df["Minor_Issue"] = (
            df["Minor_Issue"]
            .fillna("None")
        )

    print("✓ Missing categorical values handled.")

    return df


# ==================================================
# 10. REMOVE IDENTIFIER COLUMNS
# ==================================================

def prepare_final_dataset(df):

    print("\n========== FINAL DATA PREPARATION ==========")

    columns_to_remove = [
        "Athlete_Name",
        "Session_ID"
    ]

    for column in columns_to_remove:

        if column in df.columns:

            df = df.drop(columns=[column])

    print("✓ Identifier columns removed.")

    return df


# ==================================================
# 11. FINAL MISSING-VALUE CHECK
# ==================================================

def final_missing_value_check(df):

    print("\n========== FINAL MISSING VALUE CHECK ==========")

    missing = df.isnull().sum()

    missing = missing[missing > 0]

    if len(missing) == 0:

        print("✓ No missing values in engineered dataset.")

    else:

        print("WARNING: Missing values found:")

        print(missing)

    return df


# ==================================================
# 12. DUPLICATE CHECK
# ==================================================

def duplicate_check(df):

    print("\n========== DUPLICATE CHECK ==========")

    duplicate_count = df.duplicated().sum()

    print("Duplicate rows:", duplicate_count)

    if duplicate_count == 0:

        print("✓ No duplicate rows.")

    else:

        print("WARNING: Duplicate rows found.")


# ==================================================
# 13. DISPLAY ENGINEERED FEATURES
# ==================================================

def final_dataset_summary(df):

    print("\n========== FINAL DATASET SUMMARY ==========")

    print("Rows:", len(df))
    print("Columns:", len(df.columns))

    engineered_features = [

        "Previous_Training_Load",

        "Previous_Fatigue",

        "Previous_Soreness",

        "Previous_Pain",

        "Previous_Recovery",

        "Training_Load_Difference",

        "Calculated_Load_Change_Percent",

        "Training_Load_Ratio",

        "Physical_Stress_Score",

        "Recovery_Stress_Score",

        "Training_Stress_Score",

        "Previous_Injury_Flag",

        "Pain_Flag",

        "Minor_Issue_Flag",

        "Injury_History_Flag",

        "High_Intensity_Flag",

        "Training_Intensity_Score",

        "Session_Progress",

        "Training_Phase"
    ]

    print("\nEngineered features:")

    for feature in engineered_features:

        if feature in df.columns:

            print("✓", feature)


# ==================================================
# 14. MODEL DATA INSPECTION
# ==================================================

def inspect_model_data(df):

    print("\n==========================================")
    print("       FITPULSE MODEL DATA INSPECTION")
    print("==========================================")

    print("\nTotal rows:", len(df))
    print("Total columns:", len(df.columns))

    # --------------------------------------------------
    # All columns
    # --------------------------------------------------

    print("\n========== ALL COLUMNS ==========")

    for number, column in enumerate(
        df.columns,
        start=1
    ):

        print(
            f"{number:2}. "
            f"{column:35} "
            f"{df[column].dtype}"
        )

    # --------------------------------------------------
    # Target columns
    # --------------------------------------------------

    print("\n========== TARGET COLUMNS ==========")

    target_columns = [
        "Overload_Risk",
        "Overload_Risk_Score"
    ]

    for column in target_columns:

        if column in df.columns:

            print(f"\n{column}")

            print(
                df[column].value_counts(
                    dropna=False
                )
            )

    # --------------------------------------------------
    # Categorical columns
    # --------------------------------------------------

    print("\n========== CATEGORICAL COLUMNS ==========")

    categorical_columns = df.select_dtypes(
        include=["object", "category"]
    ).columns

    for column in categorical_columns:

        print(f"\n{column}:")

        print(
            df[column].value_counts(
                dropna=False
            )
        )

    print("\n==========================================")
    print("          INSPECTION COMPLETE")
    print("==========================================")


# ==================================================
# 15. SAVE DATASET
# ==================================================

def save_dataset(df):

    print("\n========== SAVING PROCESSED DATASET ==========")

    df.to_csv(
        OUTPUT_PATH,
        index=False
    )

    print("✓ Feature-engineered dataset saved successfully.")

    print("\nLocation:")
    print(OUTPUT_PATH)

    print("\nFinal rows:", len(df))
    print("Final columns:", len(df.columns))


# ==================================================
# 16. MAIN FEATURE ENGINEERING PIPELINE
# ==================================================

def engineer_features():

    print("==========================================")
    print("      FITPULSE FEATURE ENGINEERING")
    print("==========================================")

    # Load existing processed dataset
    df = load_dataset()

    # Previous-session information
    df = create_previous_session_features(df)

    # Training-load features
    df = create_training_load_features(df)

    # Wellness features
    df = create_wellness_features(df)

    # Injury features
    df = create_injury_features(df)

    # Intensity features
    df = create_intensity_features(df)

    # Session progression
    df = create_session_features(df)

    # Fix remaining categorical missing values
    df = clean_categorical_values(df)

    # Remove identifiers
    df = prepare_final_dataset(df)

    # Check missing values
    df = final_missing_value_check(df)

    # Check duplicates
    duplicate_check(df)

    # Show feature summary
    final_dataset_summary(df)

    # Save final processed dataset
    save_dataset(df)

    # Inspect model data
    inspect_model_data(df)


# ==================================================
# 17. RUN PROGRAM
# ==================================================

if __name__ == "__main__":

    engineer_features()