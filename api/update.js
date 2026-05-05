import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  try {
    const {
      id,
      name,
      nickname,
      phone,
      ec1_name,
      ec1_relation,
      ec1_phone,
      ec2_name,
      ec2_relation,
      ec2_phone,
      row,
      password
    } = req.body;

    if (!id || !row) {
      return res.status(400).json({ error: "Missing id or row" });
    }

    const sheets = await getSheet();

    // ====== 🔐 เช็คสิทธิ์ ======
    // ถ้ามี password → Admin
    // ถ้าไม่มี → Employee (อนุญาตให้แก้ได้)
    if (password) {
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    // ====== ✏️ UPDATE GOOGLE SHEET ======
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: `employee!A${row}:J${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          id,
          name,
          nickname,
          phone,
          ec1_name,
          ec1_relation,
          ec1_phone,
          ec2_name,
          ec2_relation,
          ec2_phone
        ]]
      }
    });

    res.status(200).json({ success: "อัปเดตสำเร็จ" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}