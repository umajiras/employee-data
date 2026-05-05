import { getSheet, mapRow } from "./_lib.js";

export default async function handler(req, res) {
  try {
    const sheets = await getSheet();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "employee!A2:J",
    });

    const rows = response.data.values || [];
    const data = rows.map(mapRow);

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}