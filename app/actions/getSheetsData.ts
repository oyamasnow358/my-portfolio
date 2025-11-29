"use server";
import { google } from "googleapis";

export async function getFormResponses() {
  try {
    // 1. 環境変数の取得
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    // 鍵は KEY2 がなければ KEY を見るようにする
    let privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY2 || process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKeyRaw || !projectId || !spreadsheetId) {
      console.error("Missing Env Vars:", { 
        email: !!clientEmail, 
        key: !!privateKeyRaw, 
        project: !!projectId, 
        sheet: !!spreadsheetId 
      });
      throw new Error("環境変数が不足しています。Vercelの設定を確認してください。");
    }

    // 2. 秘密鍵の整形 (ここを強化)
    // 文字列としての "\n" を本当の改行コードに変換し、前後の余白を削除
    const privateKey = privateKeyRaw.split(String.raw`\n`).join('\n').trim();

    console.log(`Attempting to auth with email: ${clientEmail}`);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
        project_id: projectId,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // 範囲指定
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
    // エラー内容を詳細にログ出力
    console.error("Sheet API Error Details:", JSON.stringify(error, null, 2));
    
    if (error.message.includes('invalid_grant')) {
      throw new Error("認証に失敗しました。秘密鍵またはメールアドレスが間違っています。");
    }
    throw new Error(`データの取得に失敗しました: ${error.message}`);
  }
}