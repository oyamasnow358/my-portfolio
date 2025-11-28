"use server";

import { google } from "googleapis";

// 認証の設定
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // 改行コードの修正
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// メイン処理: スプレッドシートへの書き込み
export async function submitChartData(mode: "under7" | "over7", answers: Record<string, string>) {
  try {
    const sheets = await getSheetsClient();

    // モードごとの設定 (Pythonコードと一致させる)
    const spreadsheetId = mode === "under7" 
      ? process.env.SPREADSHEET_ID_UNDER7 
      : process.env.SPREADSHEET_ID_OVER7;
    
    const sheetName = "シート1"; // 書き込み先シート名

    // カテゴリー定義
    const categories = mode === "under7" 
      ? ["認知力・操作", "認知力・注意力", "集団参加", "生活動作", "言語理解", "表出言語", "記憶", "読字", "書字", "粗大運動", "微細運動", "数の概念"]
      : ["自己管理スキル", "行動調整スキル", "社会的コミュニケーション", "協働スキル", "実用リテラシー", "実用数学", "健康・安全スキル", "情報活用スキル", "地域利用・社会参加スキル", "進路・職業スキル"];

    // 選択肢定義
    const options = mode === "under7"
      ? ["0〜3ヶ月", "3〜6ヶ月", "6〜9ヶ月", "9〜12ヶ月", "12～18ヶ月", "18～24ヶ月", "2～3歳", "3～4歳", "4～5歳", "5～6歳", "6～7歳"]
      : ["8〜10歳", "10〜12歳", "12～14歳", "14〜16歳", "16歳以上"];

    // 年齢テキスト -> 数値(Age Step) の変換マップ
    const ageMap: Record<string, number> = {};
    options.forEach((opt, i) => { ageMap[opt] = i + 1; });

    // -------------------------------------------
    // 1. 書き込みデータの準備
    // -------------------------------------------
    
    // A列〜C列: [カテゴリー, (空白), 選択した値]
    const valuesToWrite = categories.map(cat => [cat, "", answers[cat] || ""]);
    
    // B列用: 選択した値に対応する数値
    const convertedValues = categories.map(cat => {
      const val = answers[cat];
      return val ? [ageMap[val]] : [""];
    });

    // -------------------------------------------
    // 2. 現在の状態を書き込み (上段: A3〜C14)
    // -------------------------------------------
    await Promise.all([
      // テキスト書き込み
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A3:C${3 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: valuesToWrite },
      }),
      // 数値書き込み (B列)
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!B3:B${3 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: convertedValues },
      })
    ]);

    // -------------------------------------------
    // 3. 次のステップ計算 (下段: A19〜C30)
    // -------------------------------------------
    
    // 現在のデータを一度読み込む (Pythonのロジック再現のため)
    // ※今回は計算済みデータを使えばよいので省略可能ですが、Pythonロジックに忠実にいきます
    const currentData = valuesToWrite; // A列, C列の情報
    const currentSteps = convertedValues; // B列(数値)の情報

    // 次のステップ (+1) の計算
    const maxStep = options.length;
    const nextStepValues = currentSteps.map((row) => {
      const step = parseInt(row[0] as string);
      if (!isNaN(step)) {
        return [Math.min(maxStep, step + 1)]; // 最大値を超えないように+1
      }
      return [""];
    });

    // 数値 -> テキスト への逆変換 (C列用)
    const reverseAgeMap = Object.fromEntries(Object.entries(ageMap).map(([k, v]) => [v, k]));
    const nextStepLabels = nextStepValues.map((row) => {
      const step = row[0];
      return [reverseAgeMap[step as number] || "該当なし"];
    });

    // 下段への書き込み
    await Promise.all([
      // A列 (カテゴリー名) コピー
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A19:A${19 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: categories.map(c => [c]) },
      }),
      // B列 (数値+1) 書き込み
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!B19:B${19 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: nextStepValues },
      }),
      // C列 (次の段階テキスト) 書き込み
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!C19:C${19 + categories.length}`,
        valueInputOption: "RAW",
        requestBody: { values: nextStepLabels },
      })
    ]);

    return { success: true };

  } catch (error: any) {
    console.error("Google Sheets Error:", error);
    return { success: false, error: error.message };
  }
}