import sys
from pathlib import Path

import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.models.predict import (
    load_trained_model,
    prepare_prediction_data,
    predict_risk,
)


def predict_athlete_risk(sample_index=0):
    """
    Predict overload risk for one test sample.
    """

    model = load_trained_model()

    prediction_data = prepare_prediction_data()

    result = predict_risk(
        model=model,
        prediction_data=prediction_data,
        sample_index=sample_index
    )

    return result


def get_prediction(sample_index=0):
    """
    Service-level prediction function used by the API.
    """

    return predict_athlete_risk(
        sample_index=sample_index
    )


if __name__ == "__main__":

    print("FitPulse Prediction Service")
    print("=" * 55)

    try:

        result = get_prediction(
            sample_index=0
        )

        print("\nPrediction successful.")
        print("-" * 55)

        if isinstance(result, dict):

            for key, value in result.items():

                if isinstance(value, np.ndarray):
                    value = value.tolist()

                print(f"{key}: {value}")

        else:
            print(result)

    except Exception as error:

        print("\nPrediction failed.")
        print("Error:", error)