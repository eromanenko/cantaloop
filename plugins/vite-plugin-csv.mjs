import { readFileSync } from "node:fs";

/**
 * Vite plugin: CSV → JSON at build/dev time.
 *
 * Transforms `import data from './file.csv'` into a pre-parsed JSON array.
 * Source CSV files stay on disk for easy editing; PapaParse is NOT needed at runtime.
 *
 * Handles:
 *  - Quoted fields with commas and newlines inside quotes
 *  - Escaped quotes (double-quote inside quoted field)
 *  - Both \r\n and \n line endings
 *  - Skips empty rows
 */
export default function csvPlugin() {
  return {
    name: "vite-plugin-csv",
    transform(code, id) {
      if (!id.endsWith(".csv")) return null;

      const raw = readFileSync(id, "utf-8");
      const rows = parseCsv(raw);

      return {
        code: `export default ${JSON.stringify(rows)};`,
        map: null,
      };
    },
  };
}

/**
 * Minimal RFC-4180 CSV parser (no dependencies).
 * Returns an array of objects keyed by header row values.
 */
function parseCsv(text) {
  const lines = splitCsvRows(text);
  if (lines.length === 0) return [];

  const headers = splitCsvFields(lines[0]);
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = splitCsvFields(lines[i]);
    // Skip empty rows
    if (fields.length === 1 && fields[0] === "") continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = fields[j] ?? "";
    }
    result.push(obj);
  }

  return result;
}

/** Split CSV text into rows, respecting quoted fields that contain newlines. */
function splitCsvRows(text) {
  const rows = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      // Handle \r\n
      if (ch === "\r" && text[i + 1] === "\n") i++;
      if (current.trim() !== "") rows.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current.trim() !== "") rows.push(current);
  return rows;
}

/** Split a single CSV row into fields, handling quoted values. */
function splitCsvFields(row) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];

    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields;
}
