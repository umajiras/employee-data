import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  const { password, data } = req.body || {};

  // ✅ กัน undefined
  if (!data) {
    return res.status(400).json({ error: "ไม่มีข้อมูล" });
  }

  // ✅ ตรวจ password
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
  }

  try {
    const sheets = await getSheet();

    // ✅ กัน field หาย (สำคัญมาก)
    const row = [
      data.id || "",
      data.name || "",
      data.nickname || "",
      data.phone || "",
      data.ec1_name || "",
      data.ec1_relation || "",
      data.ec1_phone || "",
      data.ec2_name || "",
      data.ec2_relation || "",
      data.ec2_phone || ""
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "employee!A:J",
      valueInputOption: "RAW",
      requestBody: {
        values: [row]
      }
    });

    res.json({ success: "เพิ่มพนักงานแล้ว" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}