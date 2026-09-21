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

app.put("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const relationalData = JSON.parse(rawData);

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

  fs.writeFileSync(
    dataPath,
    JSON.stringify(relationalData, null, 2),
    "utf-8"
  );

  res.json(relationalData[index]);
});

app.delete("/data/:id", (req, res) => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const relationalData = JSON.parse(rawData);

  const id = Number(req.params.id);

  const index = relationalData.findIndex((row) => row.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Запис не знайдено",
    });
  }

  const deletedRow = relationalData[index];

  relationalData.splice(index, 1);

  fs.writeFileSync(
    dataPath,
    JSON.stringify(relationalData, null, 2),
    "utf-8"
  );

  res.json(deletedRow);
});

app.listen(PORT, () => {
  console.log(`Relational API запущено: http://localhost:${PORT}`);
});