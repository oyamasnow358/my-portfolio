"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Cpu, Copy, CheckCircle, FileText, 
  Lightbulb, Sparkles, MessageSquare, Download, Settings, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

// Excel操作用ライブラリ
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const LOGO_PATH = "/MieeL2.png"; 

export default function AiLessonPlanPage() {
  // ==========================================
  // State管理 (入力値)
  // ==========================================
  // Step 1: 基本情報
  const [grade, setGrade] = useState("小学部 5年");
  const [date, setDate] = useState("令和6年11月20日");
  const [subject, setSubject] = useState("生活単元学習「お祭りを開こう」");
  const [place, setPlace] = useState("5年1組教室");
  const [time, setTime] = useState("45分");
  const [content, setContent] = useState("模擬店の商品作り");

  // Step 1: 詳細設定 (アコーディオン内)
  const [goals, setGoals] = useState("");
  const [evalCriteria, setEvalCriteria] = useState("");
  const [flow, setFlow] = useState("");
  const [remarks, setRemarks] = useState("");

  // Step 2: プロンプト出力
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Step 3: AI回答・Excel生成
  const [jsonInput, setJsonInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ==========================================
  // ロジック関数
  // ==========================================

  // クリップボードコピー
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("コピーしました！");
  };

  // プロンプト生成
  const handleGeneratePrompt = () => {
    const prompt = `
あなたは特別支援学校および公立学校における【熟練の教員】です。
以下の【授業情報】を基に、学習指導案に必要な情報を補完し、指定の【JSON形式】のみで出力してください。
前置きや解説は一切不要です。JSONデータだけを返してください。

■ 【授業情報】
[必須項目]
・学部学年: ${grade}
・教科単元: ${subject}
・日時: ${date}
・時間: ${time}
・場所: ${place}
・本時の内容: ${content}

[任意項目]
・目標: ${goals || "未定（文脈に合わせて最大3つ生成せよ）"}
・評価の基準: ${evalCriteria || "未定（3観点：知識・技能、思考判断表現、主体的態度を含めて生成せよ）"}
・学習内容のメモ: ${flow || "未定（自然な流れで構成せよ）"}
・備考: ${remarks || "なし"}

■ 【出力フォーマット（厳守）】
以下のJSON構造を絶対に崩さずに返してください。
{
  "basic_info": {
    "grade": "${grade}",
    "subject": "${subject}",
    "date": "${date}",
    "time": "${time}",
    "place": "${place}",
    "content": "${content}"
  },
  "goals": ["目標1", "目標2", "目標3"],
  "evaluation": ["評価基準1（知識技能）", "評価基準2（思考判断）", "評価基準3（主体性）"],
  "flow": [
    {
      "time": "5",
      "activity": "導入：挨拶...",
      "notes": "配慮事項..."
    },
    {
      "time": "10",
      "activity": "展開1：...",
      "notes": "..."
    }
  ],
  "materials": "準備物リスト",
  "remarks": "備考の内容（特になければ空欄でも可）"
}
`;
    setGeneratedPrompt(prompt);
  };

  // Excel生成処理
  const handleGenerateExcel = async () => {
    if (!jsonInput.trim()) {
      alert("AIの回答（JSON）を貼り付けてください。");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. JSONパース
      let jsonData;
      try {
        const cleaned = jsonInput.replace(/```json\s*|\s*```/g, "").trim();
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}') + 1;
        const jsonStr = (start !== -1 && end !== -1) ? cleaned.substring(start, end) : cleaned;
        jsonData = JSON.parse(jsonStr);
      } catch (e) {
        throw new Error("JSONの解析に失敗しました。貼り付けたテキストを確認してください。");
      }

      // 2. テンプレート読み込み (public/指導案.xlsx)
      const response = await fetch("/指導案.xlsx");
      if (!response.ok) throw new Error("テンプレートファイル(指導案.xlsx)が見つかりません。publicフォルダに配置してください。");
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      const ws = workbook.worksheets[0]; // 1シート目を使用

      // 3. データ書き込みヘルパー
      const writeCell = (cellAddress: string, value: string) => {
        const cell = ws.getCell(cellAddress);
        cell.value = value;
        // 折り返し・左上揃え
        cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
      };

      // 基本情報
      const bi = jsonData.basic_info || {};
      writeCell('C2', bi.grade || "");
      writeCell('I2', bi.subject || "");
      writeCell('C3', bi.date || "");
      writeCell('K3', bi.time || "");
      writeCell('N3', bi.place || "");
      writeCell('C4', bi.content || "");

      // 目標 (C5, C6, C7)
      const goalsList = jsonData.goals || [];
      goalsList.slice(0, 3).forEach((g: string, i: number) => {
        writeCell(`C${5 + i}`, `・${g}`);
      });

      // 評価 (C8, C9, C10)
      const evalsList = jsonData.evaluation || [];
      evalsList.slice(0, 3).forEach((e: string, i: number) => {
        writeCell(`C${8 + i}`, `・${e}`);
      });

      // 展開 (A13, B13, K13 から2行おき)
      const flowList = jsonData.flow || [];
      let currentRow = 13;
      flowList.forEach((item: any) => {
        writeCell(`A${currentRow}`, item.time || "");
        writeCell(`B${currentRow}`, item.activity || "");
        writeCell(`K${currentRow}`, item.notes || "");
        currentRow += 2;
      });

      // 準備物・備考
      writeCell('N13', jsonData.materials || "");
      writeCell('B33', jsonData.remarks || "");

      // 4. ダウンロード
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "完成_指導案.xlsx");
      
      alert("指導案Excelを作成しました！");

    } catch (error: any) {
      console.error(error);
      alert(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold tracking-widest text-slate-900">MieeL <span className="text-gray-400">APP</span></h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-6xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-6 text-purple-600 shadow-sm">
            <Cpu size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">AI 指導案作成エージェント</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            プロンプト生成 ➡ AIに入力 ➡ Excel出力 の3ステップで<br/>
            学習指導案を自動作成します。
          </p>
        </motion.div>

        {/* AIチャットリンク */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors shadow-lg">
             <MessageSquare size={20} /> ChatGPT を開く
          </a>
          <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" 
             className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg">
             <Sparkles size={20} /> Gemini を開く
          </a>
        </div>

        {/* Step 1: 基本情報入力 */}
        <Section title="Step 1. 基本情報を入力" color="purple" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InputGroup label="🎓 学部学年" value={grade} onChange={setGrade} />
            <InputGroup label="📚 教科単元" value={subject} onChange={setSubject} />
            <InputGroup label="⏰ 時間" value={time} onChange={setTime} />
            <InputGroup label="📅 日時" value={date} onChange={setDate} />
            <InputGroup label="🏫 場所" value={place} onChange={setPlace} />
            <InputGroup label="📝 本時の内容" value={content} onChange={setContent} />
          </div>

          {/* 詳細設定 (アコーディオン) */}
          <Accordion title="⚙️ 詳細設定（目標・評価・備考など） ※空欄でもOK">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <TextAreaGroup label="🎯 目標（最大3つ）" value={goals} onChange={setGoals} placeholder="例：\n・道具を正しく使うことができる\n・友達と協力することができる" />
              <TextAreaGroup label="📊 評価の基準" value={evalCriteria} onChange={setEvalCriteria} placeholder="知識・技能、思考・判断・表現、主体的に取り組む態度の観点で生成されます。" />
              <TextAreaGroup label="💡 学習内容のメモ" value={flow} onChange={setFlow} placeholder="授業の流れや、必ず入れたい活動があれば箇条書きで。" />
              <TextAreaGroup label="📌 備考" value={remarks} onChange={setRemarks} placeholder="特記事項..." />
            </div>
          </Accordion>
        </Section>

        {/* Step 2: プロンプト生成 */}
        <Section title="Step 2. プロンプトをコピー" color="blue" delay={0.4}>
          <div className="space-y-6">
            <p className="text-sm text-gray-500">下のボタンを押すと、AIへの指令文（プロンプト）が生成されます。</p>
            <button
              onClick={handleGeneratePrompt}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FileText size={20} /> プロンプトを作成する
            </button>

            {generatedPrompt && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 relative"
              >
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prompt</span>
                  <button
                    onClick={() => copyToClipboard(generatedPrompt)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Copy size={14} /> コピー
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono bg-white p-4 rounded-lg border border-gray-100 overflow-x-auto h-64">
                  {generatedPrompt}
                </pre>
              </motion.div>
            )}
          </div>
        </Section>

        {/* Step 3: Excel出力 */}
        <Section title="Step 3. AIの回答からExcel作成" color="emerald" delay={0.6}>
          <div className="space-y-6">
            <p className="text-sm text-gray-500">AIが生成したJSONコードをここに貼り付けてください。</p>
            
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "basic_info": { ... }, "goals": [ ... ] }'
              className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
            />

            <button
              onClick={handleGenerateExcel}
              disabled={isGenerating}
              className="w-full py-5 bg-emerald-600 text-white text-lg font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <span className="animate-pulse">処理中...</span>
              ) : (
                <>
                  <Download size={24} /> 指導案Excelを出力する
                </>
              )}
            </button>
            <p className="text-center text-xs text-emerald-600 mt-2 font-bold">
              ※ publicフォルダに「指導案.xlsx」が必要です。
            </p>
          </div>
        </Section>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// ==========================================
// 部品コンポーネント
// ==========================================

function Section({ title, children, color, delay }: any) {
  const styles: any = {
    purple: "border-purple-200 bg-white",
    blue: "border-blue-200 bg-white",
    emerald: "border-emerald-200 bg-white",
  };
  
  const iconColors: any = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.8 }}
      className={`border rounded-3xl p-8 mb-8 shadow-sm hover:shadow-lg transition-all ${styles[color]}`}
    >
      <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-100">
        <div className={`p-3 rounded-2xl ${iconColors[color]}`}>
          <CheckCircle size={28} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function InputGroup({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function TextAreaGroup({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px]"
      />
    </div>
  );
}

function Accordion({ title, children }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-gray-50 flex justify-between items-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}