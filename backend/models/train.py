import os
import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.utils.class_weight import compute_class_weight


# ============================================================
# PATHS
# ============================================================

CURRENT_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_ROOT = os.path.abspath(
    os.path.join(CURRENT_DIR, "..", "..")
)

DATA_PATH = os.path.join(
    PROJECT_ROOT,
    "data",
    "processed",
    "processed_training_data.csv"
)


# ============================================================
# SETTINGS
# ============================================================

TARGET_COLUMN = "Overload_Risk"

SEQUENCE_LENGTH = 7

RANDOM_SEED = 42


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():

    print("=" * 70)
    print("FITPULSE MODEL PREPARATION")
    print("=" * 70)

    df = pd.read_csv(DATA_PATH)

    print(f"\nRows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")

    return df


# ============================================================
# PREPARE FEATURES
# ============================================================

def prepare_features(df):

    target_mapping = {
        "Low": 0,
        "Moderate": 1,
        "High": 2
    }

    y = df[TARGET_COLUMN].map(target_mapping)

    if y.isna().any():

        raise ValueError(
            "Unknown values found in Overload_Risk."
        )

    y = y.astype(int).values

    print("\nTarget:")

    target_counts = df[TARGET_COLUMN].value_counts()

    for label in ["Low", "Moderate", "High"]:

        count = target_counts.get(label, 0)

        percentage = (
            count / len(df) * 100
        )

        print(
            f" {label:<9} "
            f"{count:>5} "
            f"({percentage:.2f}%)"
        )

    # --------------------------------------------------------
    # Features that must NOT be used
    # --------------------------------------------------------

    leakage_columns = [
        "Overload_Risk",
        "Overload_Risk_Score"
    ]

    feature_df = df.drop(
        columns=[
            column
            for column in leakage_columns
            if column in df.columns
        ],
        errors="ignore"
    ).copy()

    # These are identifiers and should not be model inputs.
    feature_df = feature_df.drop(
        columns=[
            "Athlete_ID",
            "Athlete_Name",
            "Session_ID",
            "Session_Date"
        ],
        errors="ignore"
    )

    # --------------------------------------------------------
    # Identify categorical and numerical columns
    # --------------------------------------------------------

    categorical_columns = feature_df.select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    numerical_columns = feature_df.select_dtypes(
        include=[np.number]
    ).columns.tolist()

    print(
        f"\nNumerical features: "
        f"{len(numerical_columns)}"
    )

    print(
        f"Categorical features: "
        f"{len(categorical_columns)}"
    )

    # --------------------------------------------------------
    # One-hot encode categorical features
    # --------------------------------------------------------

    feature_df = pd.get_dummies(
        feature_df,
        columns=categorical_columns,
        dtype=float
    )

    # Make sure everything is numeric.
    feature_df = feature_df.apply(
        pd.to_numeric,
        errors="coerce"
    )

    # Replace any unexpected missing values.
    feature_df = feature_df.fillna(0)

    X = feature_df.values.astype(np.float32)

    print(
        f"Final feature count: "
        f"{X.shape[1]}"
    )

    print(
        f"Missing feature values: "
        f"{np.isnan(X).sum()}"
    )

    return X, y


# ============================================================
# ATHLETE-WISE SPLIT
# ============================================================

def split_by_athlete(df):

    athletes = (
        df["Athlete_ID"]
        .dropna()
        .unique()
    )

    rng = np.random.default_rng(
        RANDOM_SEED
    )

    athletes = np.array(athletes)

    rng.shuffle(athletes)

    total_athletes = len(athletes)

    train_count = int(
        total_athletes * 0.70
    )

    validation_count = int(
        total_athletes * 0.15
    )

    train_athletes = athletes[
        :train_count
    ]

    validation_athletes = athletes[
        train_count:
        train_count + validation_count
    ]

    test_athletes = athletes[
        train_count + validation_count:
    ]

    print("\n" + "=" * 70)
    print("ATHLETE-WISE DATA SPLIT")
    print("=" * 70)

    print(
        f"\nTotal athletes: "
        f"{total_athletes}"
    )

    print(
        f"Train athletes: "
        f"{len(train_athletes)}"
    )

    print(
        f"Validation athletes: "
        f"{len(validation_athletes)}"
    )

    print(
        f"Test athletes: "
        f"{len(test_athletes)}"
    )

    train_mask = df["Athlete_ID"].isin(
        train_athletes
    )

    validation_mask = df["Athlete_ID"].isin(
        validation_athletes
    )

    test_mask = df["Athlete_ID"].isin(
        test_athletes
    )

    return (
        train_mask,
        validation_mask,
        test_mask
    )


# ============================================================
# FEATURE SCALING
# ============================================================

def scale_features(
    X_train,
    X_validation,
    X_test
):

    print("\n" + "=" * 70)
    print("FEATURE SCALING")
    print("=" * 70)

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(
        X_train
    )

    X_validation_scaled = scaler.transform(
        X_validation
    )

    X_test_scaled = scaler.transform(
        X_test
    )

    print(
        "\n✓ Scaling statistics calculated "
        "using TRAIN data only."
    )

    return (
        X_train_scaled.astype(np.float32),
        X_validation_scaled.astype(np.float32),
        X_test_scaled.astype(np.float32)
    )


# ============================================================
# CREATE FUTURE-PREDICTION SEQUENCES
# ============================================================

def create_future_prediction_sequences(
    X,
    y,
    df,
    sequence_length=7
):

    sequences = []
    targets = []

    working_df = df.copy()

    working_df["_original_index"] = np.arange(
        len(working_df)
    )

    working_df = working_df.sort_values(
        ["Athlete_ID", "Session_Number"]
    )

    for athlete_id, athlete_group in working_df.groupby(
        "Athlete_ID",
        sort=False
    ):

        athlete_group = athlete_group.sort_values(
            "Session_Number"
        )

        original_indices = (
            athlete_group["_original_index"]
            .values
        )

        session_numbers = (
            athlete_group["Session_Number"]
            .values
        )

        # Need 7 previous sessions + 1 future session.
        if len(original_indices) <= sequence_length:
            continue

        for start in range(
            0,
            len(original_indices) - sequence_length
        ):

            sequence_indices = original_indices[
                start:
                start + sequence_length
            ]

            target_index = original_indices[
                start + sequence_length
            ]

            sequence_sessions = session_numbers[
                start:
                start + sequence_length + 1
            ]

            # Require consecutive sessions.
            if not np.all(
                np.diff(sequence_sessions) == 1
            ):
                continue

            sequences.append(
                X[sequence_indices]
            )

            targets.append(
                y[target_index]
            )

    if len(sequences) == 0:

        raise ValueError(
            "No valid future-prediction sequences "
            "were created."
        )

    return (
        np.asarray(
            sequences,
            dtype=np.float32
        ),
        np.asarray(
            targets,
            dtype=np.int32
        )
    )


# ============================================================
# CLASS WEIGHTS
# ============================================================

def calculate_class_weights(y_train):

    classes = np.unique(
        y_train
    )

    weights = compute_class_weight(
        class_weight="balanced",
        classes=classes,
        y=y_train
    )

    class_weights = {
        int(class_id): float(weight)
        for class_id, weight
        in zip(classes, weights)
    }

    return class_weights


# ============================================================
# MAIN DATA PREPARATION FUNCTION
# ============================================================

def prepare_model_data():

    df = load_dataset()

    # --------------------------------------------------------
    # Keep original dataframe for athlete/session information.
    # --------------------------------------------------------

    (
        train_mask,
        validation_mask,
        test_mask
    ) = split_by_athlete(df)

    # --------------------------------------------------------
    # Prepare all features.
    # --------------------------------------------------------

    X, y = prepare_features(df)

    # --------------------------------------------------------
    # Split rows using athlete-wise masks.
    # --------------------------------------------------------

    X_train = X[train_mask.values]
    y_train = y[train_mask.values]

    X_validation = X[
        validation_mask.values
    ]

    y_validation = y[
        validation_mask.values
    ]

    X_test = X[
        test_mask.values
    ]

    y_test = y[
        test_mask.values
    ]

    df_train = df[
        train_mask
    ].copy()

    df_validation = df[
        validation_mask
    ].copy()

    df_test = df[
        test_mask
    ].copy()

    # --------------------------------------------------------
    # Scale using TRAIN data only.
    # --------------------------------------------------------

    (
        X_train,
        X_validation,
        X_test
    ) = scale_features(
        X_train,
        X_validation,
        X_test
    )

    print(
        f"\nTrain rows: "
        f"{len(X_train):,}"
    )

    print(
        f"Validation rows: "
        f"{len(X_validation):,}"
    )

    print(
        f"Test rows: "
        f"{len(X_test):,}"
    )

    # --------------------------------------------------------
    # Create future prediction sequences.
    #
    # 7 previous sessions → NEXT session risk
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("CREATING FUTURE-PREDICTION SEQUENCES")
    print("=" * 70)

    (
        X_train_seq,
        y_train_seq
    ) = create_future_prediction_sequences(
        X_train,
        y_train,
        df_train,
        SEQUENCE_LENGTH
    )

    (
        X_validation_seq,
        y_validation_seq
    ) = create_future_prediction_sequences(
        X_validation,
        y_validation,
        df_validation,
        SEQUENCE_LENGTH
    )

    (
        X_test_seq,
        y_test_seq
    ) = create_future_prediction_sequences(
        X_test,
        y_test,
        df_test,
        SEQUENCE_LENGTH
    )

    print(
        f"\nTraining shape: "
        f"{X_train_seq.shape}"
    )

    print(
        f"Validation shape: "
        f"{X_validation_seq.shape}"
    )

    print(
        f"Test shape: "
        f"{X_test_seq.shape}"
    )

    print(
        "\n✓ 7 previous sessions are used "
        "to predict the NEXT session."
    )

    print(
        "✓ Athlete-wise split completed."
    )

    print(
        "✓ Training-only scaling completed."
    )

    print(
        "✓ Future-session targets created."
    )

    # --------------------------------------------------------
    # Class weights
    # --------------------------------------------------------

    class_weights = calculate_class_weights(
        y_train_seq
    )

    feature_count = X_train_seq.shape[2]

    return (
        X_train_seq,
        y_train_seq,
        X_validation_seq,
        y_validation_seq,
        X_test_seq,
        y_test_seq,
        class_weights,
        feature_count
    )


# ============================================================
# RUN PREPARATION ONLY
# ============================================================

if __name__ == "__main__":

    prepare_model_data()