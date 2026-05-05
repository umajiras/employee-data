import { getSheet } from "./_lib.js";

export default async function handler(req, res) {
  const { id, phone } = req.body;

  const sheets = await getSheet();

  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "employee!A2:J",
  });

    const rows = response.data.values || [];

    const data = rows.map((r, i) => ({
    row: i + 2,   // 👈 ใส่ตรงนี้
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

    const emp = data.find(e => e.id === id);

    res.json(emp);
}