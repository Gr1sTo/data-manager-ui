import { API_CONFIG } from "./config";

const BASE_URL = API_CONFIG.document;

export async function getDocumentData() {
  const response = await fetch(`${BASE_URL}/data`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати документоорієнтовані дані");
  }

  return response.json();
}