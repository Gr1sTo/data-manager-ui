import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "data", "document.json");

app.get("/data", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const documentData = JSON.parse(rawData);

  res.json(documentData);
});

app.put("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const documentData = JSON.parse(rawData);

  const id = req.params.id;
  const updatedRow = req.body;

  const index = documentData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Документ не знайдено",
    });
  }

  documentData[index] = {
    ...documentData[index],
    ...updatedRow,
    id,
  };

  fs.writeFileSync(
    dataPath,
    JSON.stringify(documentData, null, 2),
    "utf-8"
  );

  res.json(documentData[index]);
});

app.delete("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const documentData = JSON.parse(rawData);

  const id = req.params.id;

  const index = documentData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Документ не знайдено",
    });
  }

  const deletedRow = documentData[index];

  documentData.splice(index, 1);

  fs.writeFileSync(
    dataPath,
    JSON.stringify(documentData, null, 2),
    "utf-8"
  );

  res.json(deletedRow);
});

app.listen(PORT, () => {
  console.log(`Document API запущено: http://localhost:${PORT}`);
});