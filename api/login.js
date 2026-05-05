import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  try {
    const { id, phone } = req.body;

    if (!id || !phone) {
      return res.status(400).json({ error: "Missing id or phone" });
    }

    const sheets = await getSheet();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "employee!A2:J",
    });

    const rows = response.data.values || [];

    const data = rows.map((r, i) => ({
      row: i + 2,   // 👈 สำคัญมาก
      id: r[0],
      name: r[1],
      nickname: r[2],
      phone: r[3],
      ec1_name: r[4],
      ec1_relation: r[5],
      ec1_phone: r[6],
      ec2_name: r[7],
      ec2_relation: r[8],
      ec2_phone: r[9],
    }));

    // 🔐 ตรวจ login
    const emp = data.find(
      e => e.id === id && e.phone === phone
    );

    if (!emp) {
      return res.status(401).json({ error: "รหัสไม่ถูกต้อง" });
    }

    res.status(200).json(emp);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}