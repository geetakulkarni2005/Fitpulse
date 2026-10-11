import api from "./api";

export async function getRecommendations(sampleIndex = 0) {
  const index = Number(sampleIndex);

  // Get the model prediction
  const predictionResponse = await api.post("/prediction/", {
    sample_index: index,
  });

  const prediction = predictionResponse.data;

  // Get the model explanation
  const explanationResponse = await api.post("/explanation/", {
    sample_index: index,
  });

  const explanation = explanationResponse.data;

  // Extract contributing feature names
  const contributingFeatures = Array.isArray(
    explanation?.top_contributing_features
  )
    ? explanation.top_contributing_features.map((item) =>
        typeof item === "string"
          ? item
          : item.feature || item.name || ""
      ).filter(Boolean)
    : [];

  // Generate recommendations using the existing backend API
  const recommendationResponse = await api.post("/recommendations/", {
    risk_level: prediction.predicted_risk,
    contributing_features: contributingFeatures,
    symptoms: [],
    top_k: 5,
  });

  return {
    ...recommendationResponse.data,
    sample_index: index,
    predicted_risk: prediction.predicted_risk,
  };
}

export default {
  getRecommendations,
};