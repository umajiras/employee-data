import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  const { row, data, password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.json({ error: "รหัสผ่านไม่ถูกต้อง" });
  }

  try {
    const sheets = await getSheet();

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: `employee!A${row}:J${row}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          data.id, data.name, data.nickname, data.phone,
          data.ec1_name, data.ec1_relation, data.ec1_phone,
          data.ec2_name, data.ec2_relation, data.ec2_phone
        ]]
      }
    });

    res.json({ success: "อัปเดตแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}