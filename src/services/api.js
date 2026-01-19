import Papa from "papaparse";

/* Your specific Sheet ID from the provided link */
const SHEET_ID =
  "2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw";

/* Accurate GIDs for each tab */
const GIDS = {
  dictionary: "709066844",
  b1dialogs: "29044586",
  uk: "683593084",
  ru: "119537139",
  en: "0",
  hen: "2085477207",
  huk: "1207977765",
  hru: "310253063",
};

/**
 * Fetches all game data sequentially to update progress bar accurately.
 * @param {Function} onProgress - Callback function that receives percentage (0-100).
 */
export const fetchAllGameData = async (onProgress) => {
  const gidsEntries = Object.entries(GIDS);
  const totalFiles = gidsEntries.length;
  let loadedFiles = 0;

  const fetchSheet = async (gid) => {
    /* Using the /d/e/ format for published Google Sheets as you discovered */
    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch GID: ${gid}`);
      const text = await res.text();

      // Update loading progress state
      loadedFiles++;
      if (onProgress) onProgress(Math.round((loadedFiles / totalFiles) * 100));

      return new Promise((resolve) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
        });
      });
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  /* Loading all sheets. We do it in order to maintain progress bar logic */
  const data = {
    dict: await fetchSheet(GIDS.dictionary),
    dialogs: await fetchSheet(GIDS.b1dialogs),
    codes: {
      UK: await fetchSheet(GIDS.uk),
      RU: await fetchSheet(GIDS.ru),
      EN: await fetchSheet(GIDS.en),
    },
    hints: {
      UK: await fetchSheet(GIDS.huk),
      RU: await fetchSheet(GIDS.hru),
      EN: await fetchSheet(GIDS.hen),
    },
  };

  return data;
};
