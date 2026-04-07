/**
 * Game data service.
 *
 * CSV files are converted to JSON arrays at build time by vite-plugin-csv.
 * No runtime parsing needed — PapaParse is gone.
 */

import dict from "../db/dictionary.csv";
import dialogs from "../db/b1dialogs.csv";
import codesUK from "../db/b1uk.csv";
import codesRU from "../db/b1ru.csv";
import codesEN from "../db/b1en.csv";
import hintsEN from "../db/b1hen.csv";
import hintsUK from "../db/b1huk.csv";
import hintsRU from "../db/b1hru.csv";

/**
 * Returns all game data from bundled CSV files.
 * @param {Function} [onProgress] - Optional callback (receives 100 immediately).
 */
export const fetchAllGameData = (onProgress) => {
  const data = {
    dict,
    dialogs,
    codes: { UK: codesUK, RU: codesRU, EN: codesEN },
    hints: { UK: hintsUK, RU: hintsRU, EN: hintsEN },
  };

  if (onProgress) onProgress(100);

  return data;
};
