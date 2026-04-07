import Papa from "papaparse";

/* Import CSV files as raw strings via Vite */
import dictionaryCsv from "../db/dictionary.csv?raw";
import b1dialogsCsv from "../db/b1dialogs.csv?raw";
import b1ukCsv from "../db/b1uk.csv?raw";
import b1ruCsv from "../db/b1ru.csv?raw";
import b1enCsv from "../db/b1en.csv?raw";
import b1henCsv from "../db/b1hen.csv?raw";
import b1hukCsv from "../db/b1huk.csv?raw";
import b1hruCsv from "../db/b1hru.csv?raw";

const parseCsv = (csvString) =>
  Papa.parse(csvString, { header: true, skipEmptyLines: true }).data;

/**
 * Returns all game data synchronously from bundled CSV files.
 * @param {Function} [onProgress] - Optional callback (receives 100 immediately).
 */
export const fetchAllGameData = (onProgress) => {
  const data = {
    dict: parseCsv(dictionaryCsv),
    dialogs: parseCsv(b1dialogsCsv),
    codes: {
      UK: parseCsv(b1ukCsv),
      RU: parseCsv(b1ruCsv),
      EN: parseCsv(b1enCsv),
    },
    hints: {
      UK: parseCsv(b1hukCsv),
      RU: parseCsv(b1hruCsv),
      EN: parseCsv(b1henCsv),
    },
  };

  if (onProgress) onProgress(100);

  return data;
};
