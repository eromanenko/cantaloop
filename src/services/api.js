import Papa from "papaparse";

const SHEET_ID =
  "2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw";
const GIDS = {
  dictionary: "709066844", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=709066844&single=true&output=csv
  b1dialogs: "29044586", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=29044586&single=true&output=csv
  uk: "683593084", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=683593084&single=true&output=csv
  ru: "119537139", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=119537139&single=true&output=csv
  en: "0", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=0&single=true&output=csv
  hen: "2085477207", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=2085477207&single=true&output=csv
  huk: "1207977765", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=1207977765&single=true&output=csv
  hru: "310253063", //https://docs.google.com/spreadsheets/d/e/2PACX-1vSloJQIN_5enhGpuOnsTZ_kjKv3HVdtWS97BHtT58DWBs-ZFYuerKMcHxjujUSp7HDG0yaGuz--RmNw/pub?gid=310253063&single=true&output=csv
};

export const fetchAllGameData = async () => {
  const fetchSheet = async (gid) => {
    const url = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?gid=${gid}&output=csv`;
    const res = await fetch(url);
    const text = await res.text();
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
      });
    });
  };

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
