"use server";
import { google } from "googleapis";

export async function getFormResponses() {
  try {
    // 1. 環境変数のチェック (GOOGLE_PRIVATE_KEY2 を使用)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY2; // ← ここを変更しました
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!clientEmail || !privateKeyRaw || !projectId || !spreadsheetId) {
      throw new Error("環境変数が設定されていません。Vercelの設定を確認してください。");
    }

    // 2. 秘密鍵の整形
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
        project_id: projectId,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    const range = "フォームの回答 1!A1:Z1000";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    return data;
  } catch (error: any) {
    console.error("Sheet API Error Detail:", error);
    throw new Error(`データの取得に失敗しました: ${error.message}`);
  }
}