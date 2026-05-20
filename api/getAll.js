import { getSheet, mapRow } from "./_lib.js";

export default async function handler(req, res) {

  const token = req.headers.authorization;

  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).json({
      error: "Forbidden"
    });
  }

  try {
    const sheets = await getSheet();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "employee!A2:J",
    });

    const rows = response.data.values || [];

    const data = rows
      .map((r, i) => {
        if (!r || !r[0]) return null;
        return mapRow(r, i);
      })
      .filter(Boolean);

    res.status(200).json({ data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}