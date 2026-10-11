import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getEvidence() {
  const response = await api.get("/evidence/");
  return response.data;
}

export async function simulateTrainingChange(
  sampleIndex = 0,
  trainingLoadChangePercent = -10
) {
  const response = await api.post("/simulator/", {
    sample_index: Number(sampleIndex),
    training_load_change_percent: Number(
      trainingLoadChangePercent
    ),
  });

  return response.data;
}

export async function getHealth() {
  const response = await api.get("/");
  return response.data;
}

export default api;