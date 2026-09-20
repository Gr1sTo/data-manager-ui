import { API_CONFIG } from "./config";

const BASE_URL = API_CONFIG.file;

export async function getFileData() {
  const response = await fetch(`${BASE_URL}/data`);

  if (!response.ok) {
    throw new Error("Не вдалося отримати файлові дані");
  }

  return response.json();
}