"use server";

import { google } from "googleapis";

// --- 設定: Google Sheets APIの認証 ---
async function getSheetsClient() {
  // 1. 環境変数からキーを取得
  let key = process.env.GOOGLE_PRIVATE_KEY ?? "";

  // 2. もしキーが " で囲まれてしまっていたら、それを取り除く（Vercelのインポート対策）
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  // 3. 改行文字の「\n」という文字を、本物の改行コードに変換する
  const privateKey = key.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// --- メイン処理: チャートデータの送信 ---
export async function submitChartData(mode: "under7" | "over7", answers: Record<string, string>) {
  try {
    const sheets = await getSheetsClient();

    // 1. モードに応じたIDと設定
    const spreadsheetId = mode === "under7" 
      ? process.env.SPREADSHEET_ID_UNDER7 
      : process.env.SPREADSHEET_ID_OVER7;
    
    // 書き込むシート名
    const sheetName = "シート1";

    // カテゴリーの並び順
    const categories = mode === "under7" 
      ? ["認知力・操作", "認知力・注意力", "集団参加", "生活動作", "言語理解", "表出言語", "記憶", "読字", "書字", "粗大運動", "微細運動","数の概念"]
      : ["自己管理スキル", "行動調整スキル", "社会的コミュニケーション", "協働スキル", "実用リテラシー", "実用数学", "健康・安全スキル", "情報活用スキル", "地域利用・社会参加スキル", "進路・職業スキル"];

    const options = mode === "under7"
      ? ["0〜3ヶ月", "3〜6ヶ月", "6〜9ヶ月", "9〜12ヶ月", "12～18ヶ月", "18～24ヶ月", "2～3歳", "3～4歳", "4～5歳", "5～6歳", "6～7歳"]
      : ["8〜10歳", "10〜12歳", "12～14歳", "14〜16歳", "16歳以上"];

    // 年齢テキストから数値(Age Step)への変換マップ
    const ageMap: Record<string, number> = {};
    options.forEach((opt, i) => { ageMap[opt] = i + 1; });

    // A. 書き込みデータの準備
    const valuesToWrite = categories.map(cat => [cat, "", answers[cat] || ""]);
    
    // B. 数値データの準備
    const convertedValues = categories.map(cat => {
      const val = answers[cat];
      return val ? [ageMap[val]] : [""];
    });

    // 1. データ書き込み (A3:C14) & 数値書き込み (B3:B14)
    await Promise.all([
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A3:C${3 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: valuesToWrite },
      }),
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!B3:B${3 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: convertedValues },
      })
    ]);

    // 2. データコピー (Python: sheet_data_current取得 -> A19:C30へ)
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A3:C${3 + categories.length}`,
    });
    
    const currentData = readResponse.data.values || [];

    // 3. 次のステップ計算 (+1)
    const maxStep = options.length;
    const nextStepValues = currentData.map((row: any) => {
      const currentStep = parseInt(row[1]); // B列
      if (!isNaN(currentStep)) {
        return [Math.min(maxStep, currentStep + 1)];
      }
      return [""];
    });

    // 4. 数値からテキストへの逆変換
    const reverseAgeMap = Object.fromEntries(Object.entries(ageMap).map(([k, v]) => [v, k]));
    const nextStepLabels = nextStepValues.map((row) => {
      const step = row[0];
      return [reverseAgeMap[step as number] || "該当なし"];
    });

    // 5. 結果の書き込み
    // まずA19:C30にそのままコピー
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A19:C${19 + categories.length}`,
      valueInputOption: "RAW",
      requestBody: { values: currentData },
    });

    // B19:B30 (数値+1) と C19:C30 (ラベル) を更新
    await Promise.all([
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!B19:B${19 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: nextStepValues },
      }),
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!C19:C${19 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: nextStepLabels },
      })
    ]);

    return { success: true };

  } catch (error: any) {
    console.error("Google Sheets API Error Details:", error);
    // エラーメッセージを返却
    return { success: false, error: error.message || "予期せぬエラーが発生しました" };
  }
}