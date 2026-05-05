import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  const { id, row, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.json({ error: "รหัสผ่านไม่ถูกต้อง" });
  }

  try {
    const sheets = await getSheet();

    let targetRow = row;

    // ถ้าไม่มี row มาให้ ค้นหาจาก id แทน
    if (!targetRow) {
      const r = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: "employee!A2:A",
      });
      const rows = r.data.values || [];
      const idx = rows.findIndex(r => r[0] == id);
      if (idx === -1) return res.json({ error: "ไม่พบพนักงาน" });
      targetRow = idx + 2;
    }

    // ดึง sheetId จริงของ sheet ชื่อ "employee"
    const meta = await sheets.spreadsheets.get({ spreadsheetId: process.env.SHEET_ID });
    const sheet = meta.data.sheets.find(s => s.properties.title === "employee");
    const sheetId = sheet ? sheet.properties.sheetId : 0;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: targetRow - 1,
              endIndex: targetRow
            }
          }
        }]
      }
    });

    res.json({ success: "ลบแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}