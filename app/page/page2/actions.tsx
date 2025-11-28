"use server";

import { google } from "googleapis";

// --- 共通: 認証クライアントの取得 ---
async function getAuth() {
  let key = process.env.GOOGLE_PRIVATE_KEY ?? "";
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  const privateKey = key.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.readonly"
    ],
  });
}

// --- 共通: IDの取得 ---
function getSpreadsheetId(mode: "under7" | "over7") {
  return mode === "under7" 
    ? process.env.SPREADSHEET_ID_UNDER7 
    : process.env.SPREADSHEET_ID_OVER7;
}

// ==========================================================
// 1. チャートデータの送信 (修正: 完全インメモリ計算)
// ==========================================================
export async function submitChartData(mode: "under7" | "over7", answers: Record<string, string>) {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSpreadsheetId(mode);
    const sheetName = "シート1";

    // カテゴリーと選択肢の定義
    const categories = mode === "under7" 
      ? ["認知力・操作", "認知力・注意力", "集団参加", "生活動作", "言語理解", "表出言語", "記憶", "読字", "書字", "粗大運動", "微細運動", "数の概念"]
      : ["自己管理スキル", "行動調整スキル", "社会的コミュニケーション", "協働スキル", "実用リテラシー", "実用数学", "健康・安全スキル", "情報活用スキル", "地域利用・社会参加スキル", "進路・職業スキル"];

    const options = mode === "under7"
      ? ["0〜3ヶ月", "3〜6ヶ月", "6〜9ヶ月", "9〜12ヶ月", "12～18ヶ月", "18～24ヶ月", "2～3歳", "3～4歳", "4～5歳", "5～6歳", "6～7歳"]
      : ["8〜10歳", "10〜12歳", "12～14歳", "14〜16歳", "16歳以上"];

    // 年齢マップ作成
    const ageMap: Record<string, number> = {};
    options.forEach((opt, i) => { ageMap[opt] = i + 1; });
    const reverseAgeMap = Object.fromEntries(Object.entries(ageMap).map(([k, v]) => [v, k]));
    const maxStep = options.length;

    // --- 計算処理 (すべてサーバーメモリ内で完結させる) ---

    // 1. 現在の状態 (上段用)
    const currentStatusRows = categories.map(cat => {
      const selectedOption = answers[cat] || "";
      const ageNum = selectedOption ? ageMap[selectedOption] : "";
      
      // [カテゴリー名, 年齢数値(B列), 年齢テキスト(C列)]
      return [cat, ageNum, selectedOption];
    });

    // 2. 次のステップ (下段用)
    const nextStepRows = currentStatusRows.map(row => {
      const cat = row[0];
      const currentNum = row[1];
      
      let nextNum: number | string = "";
      let nextText = "該当なし";

      if (typeof currentNum === 'number') {
        // 最大値を超えないように +1
        nextNum = Math.min(maxStep, currentNum + 1);
        // 数値からテキストに戻す
        // nextNumはnumber型なのでtoStringしてキー検索など微調整
        nextText = reverseAgeMap[nextNum.toString()] || "該当なし";
      }

      // [カテゴリー名, 次の数値(B列), 次のテキスト(C列)]
      return [cat, nextNum, nextText];
    });

    // --- 書き込みデータの整形 ---
    // 上段 (A3:C14)
    const rangeUpper = `${sheetName}!A3:C${3 + categories.length}`;
    const dataUpper = currentStatusRows;

    // 下段 (A19:C30)
    const rangeLower = `${sheetName}!A19:C${19 + categories.length}`;
    const dataLower = nextStepRows;

    // --- 一括書き込み実行 ---
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED", // 数値を正しく数値として認識させる
        data: [
          {
            range: rangeUpper,
            values: dataUpper
          },
          {
            range: rangeLower,
            values: dataLower
          }
        ]
      }
    });

    // 成功URL
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    return { success: true, url: spreadsheetUrl };

  } catch (error: any) {
    console.error("Submit Error:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================================
// 2. Excelダウンロード機能
// ==========================================================
export async function downloadExcel(mode: "under7" | "over7") {
  try {
    const auth = await getAuth();
    const drive = google.drive({ version: "v3", auth });
    const fileId = getSpreadsheetId(mode);

    if (!fileId) throw new Error("Spreadsheet ID not found");

    const response = await drive.files.export({
      fileId: fileId,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }, { responseType: "arraybuffer" });

    const buffer = Buffer.from(response.data as ArrayBuffer);
    const base64 = buffer.toString("base64");

    return { success: true, data: base64 };

  } catch (error: any) {
    console.error("Download Error:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================================
// 3. 目安データの取得
// ==========================================================
export async function getGuidelineData(mode: "under7" | "over7") {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = getSpreadsheetId(mode);
    const sheetName = mode === "under7" ? "シート2" : "シート3";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:V`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return { success: false, error: "No data found" };

    const headers = rows[0].map((h: string) => h.trim());
    const dataMap: Record<string, Record<number, string>> = {};
    headers.forEach((h: string) => { dataMap[h] = {}; });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > 21) {
        const ageStep = parseInt(row[21]); // V列
        if (!isNaN(ageStep)) {
          headers.forEach((header: string, colIndex: number) => {
            if (colIndex < row.length && row[colIndex]) {
              dataMap[header][ageStep] = row[colIndex];
            }
          });
        }
      }
    }

    return { success: true, data: dataMap };

  } catch (error: any) {
    console.error("Guideline Fetch Error:", error);
    return { success: false, error: error.message };
  }
}