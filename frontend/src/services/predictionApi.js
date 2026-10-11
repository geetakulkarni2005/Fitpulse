import api from "./api";

export async function predictRisk(sampleIndex = 0) {
  const response = await api.post("/prediction/", {
    sample_index: Number(sampleIndex),
  });

  return response.data;
}

export async function explainRisk(sampleIndex = 0) {
  const response = await api.post("/explanation/", {
    sample_index: Number(sampleIndex),
  });

  return response.data;
}

export default {
  predictRisk,
  explainRisk,
};