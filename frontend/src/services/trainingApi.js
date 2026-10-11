import api from "./api";

export async function getTrainingHistory(athleteId) {
  const response = await api.get(
    `/training/${encodeURIComponent(athleteId)}`
  );

  return response.data;
}

export async function getTrainingSummary(athleteId) {
  const response = await api.get(
    `/training/${encodeURIComponent(athleteId)}/summary`
  );

  return response.data;
}

export async function getTrainingAnalytics(athleteId) {
  const response = await api.get(
    `/training/${encodeURIComponent(athleteId)}/analytics`
  );

  return response.data;
}

export default {
  getTrainingHistory,
  getTrainingSummary,
  getTrainingAnalytics,
};