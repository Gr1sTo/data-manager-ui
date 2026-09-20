import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "data", "files.json");

app.get("/data", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const fileData = JSON.parse(rawData);

  res.json(fileData);
});

app.listen(PORT, () => {
  console.log(`File API запущено: http://localhost:${PORT}`);
});
