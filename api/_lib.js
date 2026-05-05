import { google } from "googleapis";

export async function getSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export function mapRow(row, i) {
  return {
    row: i + 2,
    id: row[0],
    name: row[1],
    nickname: row[2],
    phone: row[3],
    ec1_name: row[4],
    ec1_relation: row[5],
    ec1_phone: row[6],
    ec2_name: row[7],
    ec2_relation: row[8],
    ec2_phone: row[9],
  };
}