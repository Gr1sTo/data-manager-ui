import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 6023;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const relationalPath = path.join(__dirname, "data", "relational.json");
const documentPath = path.join(__dirname, "data", "document.json");
const filesPath = path.join(__dirname, "data", "files.json");

function readJson(filePath) {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
}

app.get("/api/relational/data", (req, res) => {
  res.json(readJson(relationalPath));
});

app.get("/api/document/data", (req, res) => {
  res.json(readJson(documentPath));
});

app.get("/api/file/data", (req, res) => {
  res.json(readJson(filesPath));
});

function writeJson(filePath, data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

app.put("/api/relational/data/:id", (req, res) => {
  const relationalData = readJson(relationalPath);

  const id = Number(req.params.id);
  const updatedRow = req.body;

  const index = relationalData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Запис не знайдено",
    });
  }

  relationalData[index] = {
    ...relationalData[index],
    ...updatedRow,
    id,
  };

  writeJson(relationalPath, relationalData);

  res.json(relationalData[index]);
});

app.put("/api/document/data/:id", (req, res) => {
  const documentData = readJson(documentPath);

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

  writeJson(documentPath, documentData);

  res.json(documentData[index]);
});

app.put("/api/file/data/:id", (req, res) => {
  const fileData = readJson(filesPath);

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

  writeJson(filesPath, fileData);

  res.json(fileData[index]);
});

app.delete("/api/relational/data/:id", (req, res) => {
  const relationalData = readJson(relationalPath);

  const id = Number(req.params.id);
  const index = relationalData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Запис не знайдено",
    });
  }

  const deletedRow = relationalData[index];

  relationalData.splice(index, 1);

  writeJson(relationalPath, relationalData);

  res.json(deletedRow);
});

app.delete("/api/document/data/:id", (req, res) => {
  const documentData = readJson(documentPath);

  const id = req.params.id;
  const index = documentData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Документ не знайдено",
    });
  }

  const deletedRow = documentData[index];

  documentData.splice(index, 1);

  writeJson(documentPath, documentData);

  res.json(deletedRow);
});

app.delete("/api/file/data/:id", (req, res) => {
  const fileData = readJson(filesPath);

  const id = Number(req.params.id);
  const index = fileData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Файл або папку не знайдено",
    });
  }

  const deletedRow = fileData[index];

  fileData.splice(index, 1);

  writeJson(filesPath, fileData);

  res.json(deletedRow);
});

app.listen(PORT, () => {
  console.log(
    `DataManager_Ryzhenko_Demo API запущено: http://localhost:${PORT}`
  );
});