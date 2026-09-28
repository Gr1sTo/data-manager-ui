import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data", "relational");

const tableLabels = {
  users: "Користувачі",
  devices: "Пристрої",
  projects: "Проєкти",
};

// =========================
// Допоміжні функції
// =========================

function getTableFilePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function tableExists(table) {
  return fs.existsSync(getTableFilePath(table));
}

function readTable(table) {
  const filePath = getTableFilePath(table);

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeTable(table, data) {
  const filePath = getTableFilePath(table);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

function findRecordIndex(data, id) {
  return data.findIndex(
    (record) => String(record.id) === String(id)
  );
}

// =========================
// GET /tables
// Список доступних таблиць
// =========================

app.get("/tables", (req, res) => {
  try {
    const files = fs
      .readdirSync(DATA_DIR)
      .filter((file) => file.endsWith(".json"));

    const tables = files.map((file) => {
      const name = path.basename(file, ".json");
      const data = readTable(name);

      return {
        name,
        label: tableLabels[name] || name,
        recordsCount: Array.isArray(data) ? data.length : 0,
      };
    });

    res.json(tables);
  } catch (error) {
    console.error("Помилка отримання таблиць:", error);

    res.status(500).json({
      message: "Не вдалося отримати список таблиць",
    });
  }
});

// =========================
// GET /tables/:table
// Усі записи таблиці
// =========================

app.get("/tables/:table", (req, res) => {
  const { table } = req.params;

  if (!tableExists(table)) {
    return res.status(404).json({
      message: `Таблицю "${table}" не знайдено`,
    });
  }

  try {
    const data = readTable(table);

    res.json(data);
  } catch (error) {
    console.error(`Помилка читання таблиці ${table}:`, error);

    res.status(500).json({
      message: "Не вдалося отримати дані таблиці",
    });
  }
});

// =========================
// GET /tables/:table/:id
// Один запис
// =========================

app.get("/tables/:table/:id", (req, res) => {
  const { table, id } = req.params;

  if (!tableExists(table)) {
    return res.status(404).json({
      message: `Таблицю "${table}" не знайдено`,
    });
  }

  try {
    const data = readTable(table);

    const record = data.find(
      (item) => String(item.id) === String(id)
    );

    if (!record) {
      return res.status(404).json({
        message: `Запис з id "${id}" не знайдено`,
      });
    }

    res.json(record);
  } catch (error) {
    console.error("Помилка отримання запису:", error);

    res.status(500).json({
      message: "Не вдалося отримати запис",
    });
  }
});

// =========================
// POST /tables/:table
// Створити запис
// =========================

app.post("/tables/:table", (req, res) => {
  const { table } = req.params;

  if (!tableExists(table)) {
    return res.status(404).json({
      message: `Таблицю "${table}" не знайдено`,
    });
  }

  try {
    const data = readTable(table);

    const numericIds = data
      .map((record) => Number(record.id))
      .filter((id) => Number.isFinite(id));

    const nextId =
      numericIds.length > 0
        ? Math.max(...numericIds) + 1
        : 1;

    const newRecord = {
      ...req.body,
      id: nextId,
    };

    data.push(newRecord);

    writeTable(table, data);

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Помилка створення запису:", error);

    res.status(500).json({
      message: "Не вдалося створити запис",
    });
  }
});

// =========================
// PUT /tables/:table/:id
// Оновити запис
// =========================

app.put("/tables/:table/:id", (req, res) => {
  const { table, id } = req.params;

  if (!tableExists(table)) {
    return res.status(404).json({
      message: `Таблицю "${table}" не знайдено`,
    });
  }

  try {
    const data = readTable(table);

    const recordIndex = findRecordIndex(data, id);

    if (recordIndex === -1) {
      return res.status(404).json({
        message: `Запис з id "${id}" не знайдено`,
      });
    }

    const updatedRecord = {
      ...data[recordIndex],
      ...req.body,
      id: data[recordIndex].id,
    };

    data[recordIndex] = updatedRecord;

    writeTable(table, data);

    res.json(updatedRecord);
  } catch (error) {
    console.error("Помилка оновлення запису:", error);

    res.status(500).json({
      message: "Не вдалося оновити запис",
    });
  }
});

// =========================
// DELETE /tables/:table/:id
// Видалити запис
// =========================

app.delete("/tables/:table/:id", (req, res) => {
  const { table, id } = req.params;

  if (!tableExists(table)) {
    return res.status(404).json({
      message: `Таблицю "${table}" не знайдено`,
    });
  }

  try {
    const data = readTable(table);

    const recordIndex = findRecordIndex(data, id);

    if (recordIndex === -1) {
      return res.status(404).json({
        message: `Запис з id "${id}" не знайдено`,
      });
    }

    const deletedRecord = data[recordIndex];

    data.splice(recordIndex, 1);

    writeTable(table, data);

    res.json(deletedRecord);
  } catch (error) {
    console.error("Помилка видалення запису:", error);

    res.status(500).json({
      message: "Не вдалося видалити запис",
    });
  }
});

// =========================
// Запуск сервера
// =========================

app.listen(PORT, () => {
  console.log(
    `Relational Demo API запущено на http://localhost:${PORT}`
  );
});