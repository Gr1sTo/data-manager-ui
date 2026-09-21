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

app.put("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const fileData = JSON.parse(rawData);

  const id = Number(req.params.id);
  const updatedRow = req.body;

  const index = fileData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Файл або папку не знайдено",
    });
  }

  fileData[index] = {
    ...fileData[index],
    ...updatedRow,
    id,
  };

  fs.writeFileSync(
    dataPath,
    JSON.stringify(fileData, null, 2),
    "utf-8"
  );

  res.json(fileData[index]);
});

app.delete("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const fileData = JSON.parse(rawData);

  const id = Number(req.params.id);

  const index = fileData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Файл або папку не знайдено",
    });
  }

  const deletedRow = fileData[index];

  fileData.splice(index, 1);

  fs.writeFileSync(
    dataPath,
    JSON.stringify(fileData, null, 2),
    "utf-8"
  );

  res.json(deletedRow);
});

app.listen(PORT, () => {
  console.log(`File API запущено: http://localhost:${PORT}`);
});
