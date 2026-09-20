import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "data", "relational.json");

app.get("/data", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const relationalData = JSON.parse(rawData);

  res.json(relationalData);
});

app.listen(PORT, () => {
  console.log(`Relational API запущено: http://localhost:${PORT}`);
});