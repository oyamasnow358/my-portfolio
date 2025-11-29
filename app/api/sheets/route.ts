import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 環境変数の読み込み
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // 改行コードの修正 (\n という文字列を 本当の改行 に変換)
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY2 || "").replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // 環境変数が足りない場合
    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.error("Missing Env Vars");
      return NextResponse.json({ error: "環境変数が設定されていません" }, { status: 500 });
    }

    // Google認証
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = "フォームの回答 1!A1:Z1000";

    // データ取得
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 1行目をヘッダーにしてJSON化
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    return NextResponse.json({ data });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}