import api from "./api";

export async function getAthletes() {
  const response = await api.get("/athletes/");
  return response.data;
}

export async function getAthlete(athleteId) {
  const response = await api.get(
    `/athletes/${encodeURIComponent(athleteId)}`
  );

  return response.data;
}

export default {
  getAthletes,
  getAthlete,
};