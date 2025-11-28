"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, FileSpreadsheet, Download, ChevronDown, CheckCircle, 
  TrendingUp, BarChart2, Info, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
// 作成したアクションをすべてインポート
import { submitChartData, downloadExcel, getGuidelineData } from "./actions";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const CATEGORIES_UNDER7 = ["認知力・操作", "認知力・注意力", "集団参加", "生活動作", "言語理解", "表出言語", "記憶", "読字", "書字", "粗大運動", "微細運動", "数の概念"];
const OPTIONS_UNDER7 = ["0〜3ヶ月", "3〜6ヶ月", "6〜9ヶ月", "9〜12ヶ月", "12～18ヶ月", "18～24ヶ月", "2～3歳", "3～4歳", "4～5歳", "5～6歳", "6～7歳"];

const CATEGORIES_OVER7 = ["自己管理スキル", "行動調整スキル", "社会的コミュニケーション", "協働スキル", "実用リテラシー", "実用数学", "健康・安全スキル", "情報活用スキル", "地域利用・社会参加スキル", "進路・職業スキル"];
const OPTIONS_OVER7 = ["8〜10歳", "10〜12歳", "12～14歳", "14〜16歳", "16歳以上"];

// ==========================================
// ▲ データエリア終了
// ==========================================

export default function DevelopmentChartPage() {
  const [mode, setMode] = useState<"under7" | "over7">("under7");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // 状態管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(""); // 作成されたURL
  const [guidelines, setGuidelines] = useState<Record<string, Record<number, string>>>({}); // 目安データ

  const categories = mode === "under7" ? CATEGORIES_UNDER7 : CATEGORIES_OVER7;
  const options = mode === "under7" ? OPTIONS_UNDER7 : OPTIONS_OVER7;

  // --- 1. 初回ロード時 & モード変更時に「目安データ」を取得 ---
  useEffect(() => {
    async function loadGuidelines() {
      const result = await getGuidelineData(mode);
      if (result.success && result.data) {
        setGuidelines(result.data);
      }
    }
    loadGuidelines();
    
    // モードが変わったら状態リセット
    setAnswers({});
    setIsComplete(false);
    setSpreadsheetUrl("");
  }, [mode]);

  // --- ハンドラー ---
  const handleOptionSelect = (category: string, option: string) => {
    setAnswers(prev => ({ ...prev, [category]: option }));
  };

  // チャート作成・書き込み
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitChartData(mode, answers);
      if (result.success && result.url) {
        setSpreadsheetUrl(result.url); // URLを保存
        setIsComplete(true);
      } else {
        alert("エラーが発生しました: " + result.error);
      }
    } catch (e) {
      alert("通信エラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excelダウンロード
  const handleDownload = async () => {
    const fileName = `hattatsu_chart_${mode}.xlsx`;
    try {
      const result = await downloadExcel(mode);
      if (result.success && result.data) {
        // Base64からBlobを作成してダウンロード発火
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } else {
        alert("ダウンロードに失敗しました: " + result.error);
      }
    } catch (e) {
      alert("ダウンロード中にエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold tracking-widest text-slate-900">MieeL <span className="text-gray-400">APP</span></h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* タイトル */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-6 text-purple-600">
            <BarChart2 size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">発達チャート作成</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            お子さんの現在の発達段階を選択し、状態と次のステップをまとめたチャートを作成・保存します。
          </p>
        </motion.div>

        {/* モード切替タブ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setMode("under7")}
            className={`
              px-8 py-3 rounded-full font-bold transition-all shadow-sm
              ${mode === "under7" 
                ? "bg-blue-600 text-white shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2" 
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}
            `}
          >
            発達年齢 7歳以下用
          </button>
          <button
            onClick={() => setMode("over7")}
            className={`
              px-8 py-3 rounded-full font-bold transition-all shadow-sm
              ${mode === "over7" 
                ? "bg-purple-600 text-white shadow-purple-500/30 ring-2 ring-purple-600 ring-offset-2" 
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}
            `}
          >
            発達年齢 8歳以上用
          </button>
        </motion.div>

        {/* 入力フォーム */}
        {!isComplete ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {categories.map((category, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-gray-100 pb-2">{category}</h3>
                
                {/* 選択肢 */}
                <div className="space-y-2">
                  {options.map((option, idx) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(category, option)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                        ${answers[category] === option 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : "bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100"}
                      `}
                    >
                      {option}
                      {answers[category] === option && <CheckCircle size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>

                {/* ★修正: 目安を見る (データ表示機能追加) */}
                <details className="mt-4 group">
                  <summary className="flex items-center gap-2 text-xs font-bold text-gray-400 cursor-pointer hover:text-blue-500 transition-colors list-none">
                    <Info size={14} /> 目安を見る
                    <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100 text-xs leading-relaxed text-gray-600">
                    {/* ここでGoogle Sheetsから取得したguidelinesを表示 */}
                    {options.map((opt, idx) => {
                      const step = idx + 1; // 1, 2, 3...
                      // ガイドラインデータがあれば表示、なければ「データなし」
                      const text = guidelines[category] ? guidelines[category][step] : null;
                      
                      return text ? (
                        <div key={opt} className="mb-2 last:mb-0">
                          <span className="font-bold text-blue-600 mr-2">{opt}:</span>
                          {text}
                        </div>
                      ) : null;
                    })}
                    {(!guidelines[category]) && <p>データを読み込んでいます...</p>}
                  </div>
                </details>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* 完了画面 */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center mb-16"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">チャート作成完了！</h3>
            <p className="text-green-700 mb-8">データが正常に処理されました。以下のボタンから確認・保存してください。</p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {/* スプレッドシートボタン */}
              <a 
                href={spreadsheetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-white border border-green-200 text-green-700 rounded-xl font-bold hover:bg-green-100 transition-colors shadow-sm"
              >
                <FileSpreadsheet size={20} />
                スプレッドシートで確認
              </a>
              
              {/* ダウンロードボタン */}
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-500/30"
              >
                <Download size={20} />
                Excel形式でダウンロード
              </button>
            </div>
          </motion.div>
        )}

        {/* 送信ボタンエリア */}
        {!isComplete && (
          <div className="text-center sticky bottom-10 z-30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length === 0}
              className={`
                px-12 py-5 rounded-full font-bold text-xl tracking-widest shadow-2xl flex items-center gap-3 mx-auto transition-all
                ${Object.keys(answers).length > 0 
                  ? "bg-slate-900 text-white hover:bg-black ring-4 ring-white/50" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}
              `}
            >
              {isSubmitting ? (
                <span className="animate-pulse">処理中...</span>
              ) : (
                <>
                  <BarChart2 size={24} />
                  チャートを作成して書き込む
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* 関連リンク */}
        <div className="mt-20 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold tracking-widest text-xs">
            RELATED TOOLS
          </div>
          <a 
            href="https://bunnsekiexcel-edeeuzkkntxmhdptk54v2t.streamlit.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg text-blue-500 shadow-sm group-hover:text-blue-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-800">成長傾向分析ツール</h4>
                <p className="text-xs text-gray-500 mt-1">これまでのデータから成長グラフを作成します</p>
              </div>
            </div>
            <ArrowUpRight className="text-gray-300 group-hover:text-blue-500" />
          </a>
        </div>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}