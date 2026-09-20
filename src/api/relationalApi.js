import { API_CONFIG } from "./config";

const BASE_URL = API_CONFIG.relational;

export async function getRelationalData() {
  const response = await fetch(`${BASE_URL}/data`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати реляційні дані");
  }

  return response.json();
}