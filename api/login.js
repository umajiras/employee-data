import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  const { id, phone } = req.body;

  const sheets = await getSheet();

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "employee!A2:J",
  });

  const rows = r.data.values || [];

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] == id && rows[i][3] == phone) {
      return res.json({
        id: rows[i][0],
        name: rows[i][1],
        nickname: rows[i][2],
        phone: rows[i][3],
      });
    }
  }

  res.json(null);
}