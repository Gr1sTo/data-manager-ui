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

// =========================
// Шляхи до даних
// =========================

// Реляційні дані тепер зберігаються
// як окремі JSON-таблиці
const relationalDir = path.join(
  __dirname,
  "data",
  "relational"
);

const documentPath = path.join(
  __dirname,
  "data",
  "document.json"
);

const filesPath = path.join(
  __dirname,
  "data",
  "files.json"
);

const tableLabels = {
  users: "Користувачі",
  devices: "Пристрої",
  projects: "Проєкти",
};

// =========================
// Допоміжні функції
// =========================

function readJson(filePath) {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
}

function writeJson(filePath, data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

function getTablePath(table) {
  return path.join(
    relationalDir,
    `${table}.json`
  );
}

function tableExists(table) {
  return fs.existsSync(getTablePath(table));
}

function readTable(table) {
  return readJson(getTablePath(table));
}

function writeTable(table, data) {
  writeJson(getTablePath(table), data);
}

function findRecordIndex(data, id) {
  return data.findIndex(
    (record) => String(record.id) === String(id)
  );
}

// =====================================================
// RELATIONAL API
// =====================================================

// =========================
// GET /api/relational/tables
// Список таблиць
// =========================

app.get("/api/relational/tables", (req, res) => {
  try {
    const files = fs
      .readdirSync(relationalDir)
      .filter((file) => file.endsWith(".json"));

    const tables = files.map((file) => {
      const name = path.basename(file, ".json");
      const data = readTable(name);

      return {
        name,
        label: tableLabels[name] || name,
        recordsCount: Array.isArray(data)
          ? data.length
          : 0,
      };
    });

    res.json(tables);
  } catch (error) {
    console.error(
      "Помилка отримання списку таблиць:",
      error
    );

    res.status(500).json({
      message: "Не вдалося отримати список таблиць",
    });
  }
});

// =========================
// GET /api/relational/tables/:table
// Дані таблиці
// =========================

app.get(
  "/api/relational/tables/:table",
  (req, res) => {
    const { table } = req.params;

    if (!tableExists(table)) {
      return res.status(404).json({
        message: `Таблицю "${table}" не знайдено`,
      });
    }

    try {
      res.json(readTable(table));
    } catch (error) {
      console.error(
        `Помилка читання таблиці ${table}:`,
        error
      );

      res.status(500).json({
        message: "Не вдалося отримати дані таблиці",
      });
    }
  }
);

// =========================
// GET /api/relational/tables/:table/:id
// Один запис
// =========================

app.get(
  "/api/relational/tables/:table/:id",
  (req, res) => {
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
      console.error(
        "Помилка отримання запису:",
        error
      );

      res.status(500).json({
        message: "Не вдалося отримати запис",
      });
    }
  }
);

// =========================
// POST /api/relational/tables/:table
// Додати запис
// =========================

app.post(
  "/api/relational/tables/:table",
  (req, res) => {
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
      console.error(
        "Помилка створення запису:",
        error
      );

      res.status(500).json({
        message: "Не вдалося створити запис",
      });
    }
  }
);

// =========================
// PUT /api/relational/tables/:table/:id
// Редагувати запис
// =========================

app.put(
  "/api/relational/tables/:table/:id",
  (req, res) => {
    const { table, id } = req.params;

    if (!tableExists(table)) {
      return res.status(404).json({
        message: `Таблицю "${table}" не знайдено`,
      });
    }

    try {
      const data = readTable(table);

      const recordIndex = findRecordIndex(
        data,
        id
      );

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
      console.error(
        "Помилка оновлення запису:",
        error
      );

      res.status(500).json({
        message: "Не вдалося оновити запис",
      });
    }
  }
);

// =========================
// DELETE /api/relational/tables/:table/:id
// Видалити запис
// =========================

app.delete(
  "/api/relational/tables/:table/:id",
  (req, res) => {
    const { table, id } = req.params;

    if (!tableExists(table)) {
      return res.status(404).json({
        message: `Таблицю "${table}" не знайдено`,
      });
    }

    try {
      const data = readTable(table);

      const recordIndex = findRecordIndex(
        data,
        id
      );

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
      console.error(
        "Помилка видалення запису:",
        error
      );

      res.status(500).json({
        message: "Не вдалося видалити запис",
      });
    }
  }
);

// =====================================================
// DOCUMENT API
// =====================================================

app.get("/api/document/data", (req, res) => {
  res.json(readJson(documentPath));
});

app.put("/api/document/data/:id", (req, res) => {
  const documentData = readJson(documentPath);

  const id = req.params.id;
  const updatedRow = req.body;

  const index = documentData.findIndex(
    (row) => row.id === id
  );

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

app.delete("/api/document/data/:id", (req, res) => {
  const documentData = readJson(documentPath);

  const id = req.params.id;

  const index = documentData.findIndex(
    (row) => row.id === id
  );

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

// =====================================================
// FILE API
// =====================================================

app.get("/api/file/data", (req, res) => {
  res.json(readJson(filesPath));
});

app.put("/api/file/data/:id", (req, res) => {
  const fileData = readJson(filesPath);

  const id = Number(req.params.id);
  const updatedRow = req.body;

  const index = fileData.findIndex(
    (row) => row.id === id
  );

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

app.delete("/api/file/data/:id", (req, res) => {
  const fileData = readJson(filesPath);

  const id = Number(req.params.id);

  const index = fileData.findIndex(
    (row) => row.id === id
  );

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

// =====================================================
// START
// =====================================================

app.listen(PORT, () => {
  console.log(
    `DataManager_Ryzhenko_Demo API запущено: http://localhost:${PORT}`
  );
});