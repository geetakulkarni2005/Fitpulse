import sys
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.models.train import prepare_model_data


MODEL_PATH = PROJECT_ROOT / "backend" / "models" / "lstm_model.keras"

RISK_LABELS = {
    0: "Low",
    1: "Moderate",
    2: "High"
}


def load_trained_model(model_path=MODEL_PATH):
    """
    Load the trained FitPulse LSTM model.
    """

    model_path = Path(model_path)

    if not model_path.exists():
        raise FileNotFoundError(
            f"Trained model not found: {model_path}"
        )

    return tf.keras.models.load_model(model_path)


def prepare_prediction_data():
    """
    Prepare the same test data used during model evaluation.

    Returns:
        Dictionary containing test sequences, labels,
        feature names and metadata.
    """

    prepared = prepare_model_data()

    if not isinstance(prepared, tuple):
        raise ValueError(
            "prepare_model_data() must return a tuple."
        )

    if len(prepared) < 6:
        raise ValueError(
            "prepare_model_data() returned fewer values than expected."
        )

    X_train = prepared[0]
    X_val = prepared[1]
    X_test = prepared[2]

    y_train = prepared[3]
    y_val = prepared[4]
    y_test = prepared[5]

    feature_names = None

    if len(prepared) >= 7:
        feature_names = prepared[6]

    if feature_names is None:
        feature_names = [
            f"Feature_{i + 1}"
            for i in range(X_test.shape[-1])
        ]

    return {
        "X_train": X_train,
        "X_val": X_val,
        "X_test": X_test,
        "y_train": y_train,
        "y_val": y_val,
        "y_test": y_test,
        "feature_names": list(feature_names)
    }


def predict_risk(
    model,
    prediction_data,
    sample_index=0
):
    """
    Predict overload risk for one test sequence.
    """

    X_test = prediction_data["X_test"]
    y_test = prediction_data["y_test"]

    if sample_index < 0 or sample_index >= len(X_test):
        raise IndexError(
            f"sample_index must be between 0 and {len(X_test) - 1}."
        )

    sample = X_test[sample_index:sample_index + 1]

    probabilities = model.predict(
        sample,
        verbose=0
    )[0]

    predicted_class = int(
        np.argmax(probabilities)
    )

    actual_class = int(
        y_test[sample_index]
    )

    return {
        "sample_index": sample_index,
        "actual_class": actual_class,
        "actual_risk": RISK_LABELS.get(
            actual_class,
            "Unknown"
        ),
        "predicted_class": predicted_class,
        "predicted_risk": RISK_LABELS.get(
            predicted_class,
            "Unknown"
        ),
        "probabilities": {
            "Low": float(probabilities[0]),
            "Moderate": float(probabilities[1]),
            "High": float(probabilities[2])
        }
    }


def predict_test_set(model, prediction_data):
    """
    Predict overload risk for the complete test set.
    """

    X_test = prediction_data["X_test"]
    y_test = prediction_data["y_test"]

    probabilities = model.predict(
        X_test,
        verbose=0
    )

    predicted_classes = np.argmax(
        probabilities,
        axis=1
    )

    results = []

    for index in range(len(X_test)):

        actual_class = int(y_test[index])
        predicted_class = int(predicted_classes[index])

        results.append({
            "sample_index": index,
            "actual_class": actual_class,
            "actual_risk": RISK_LABELS.get(
                actual_class,
                "Unknown"
            ),
            "predicted_class": predicted_class,
            "predicted_risk": RISK_LABELS.get(
                predicted_class,
                "Unknown"
            ),
            "probabilities": {
                "Low": float(probabilities[index][0]),
                "Moderate": float(probabilities[index][1]),
                "High": float(probabilities[index][2])
            }
        })

    return results


def print_prediction_summary(result):
    """
    Print a readable prediction result.
    """

    print("\nFitPulse Risk Prediction")
    print("=" * 55)

    print(
        f"Sample index    : {result['sample_index']}"
    )

    print(
        f"Actual risk     : {result['actual_risk']}"
    )

    print(
        f"Predicted risk  : {result['predicted_risk']}"
    )

    print("\nPrediction probabilities:")

    for risk, probability in result["probabilities"].items():

        print(
            f"{risk:<10}: {probability:.4f}"
        )


if __name__ == "__main__":

    print("FitPulse prediction module loaded.")
    print("Available functions:")
    print("  load_trained_model()")
    print("  prepare_prediction_data()")
    print("  predict_risk()")
    print("  predict_test_set()")
    print("  print_prediction_summary()")
    print("No model is automatically trained by this file.")