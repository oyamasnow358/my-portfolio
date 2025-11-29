"use server";
import { google } from "googleapis";

export async function getFormResponses() {
  try {
    // 環境変数の読み込み (改行コードの処理を含む)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
        project_id: process.env.GOOGLE_PROJECT_ID,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    // 読み込む範囲 (フォームの回答シート)
    const range = "フォームの回答 1!A1:Z1000";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // 1行目をヘッダーとして辞書配列に変換
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error("Sheet API Error:", error);
    throw new Error("スプレッドシートの読み込みに失敗しました。");
  }
}