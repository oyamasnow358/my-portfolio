"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Layers, Clock, GraduationCap, Video, FileText, 
  ChevronDown, ChevronUp, Download, Tag, BookOpen, Image as ImageIcon,
  ArrowUpRight, CheckCircle, User, Cpu, LineChart, Table, FileSpreadsheet,
  ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Upload, Filter
} from "lucide-react";
import Link from "next/link";
import Papa from "papaparse"; 
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ==========================================
// 定数・設定
// ==========================================
const CSV_PATH = "/lesson_cards.csv"; 
// ★ 変更: .xlsx (マクロなし) を指定
const TEMPLATE_PATH = "/template.xlsx"; 

// API認証不要のCSV公開URL (スプレッドシート)
// ここにはご自身のスプレッドシートの公開CSVリンクを入れてください
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxxxxxxxx/pub?output=csv"; 

// GoogleフォームのURL
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdqRDY5cr5wdSR8nYKmc8pyD7wzVgKli21mLUg7ECtpVLm1iw/viewform";
const ITEMS_PER_PAGE = 12;

type LessonCard = {
  id: string;
  unit_name: string;
  catch_copy: string;
  goal: string;
  target_grade: string;
  disability_type: string;
  developmental_stage: string;
  duration: string;
  materials: string;
  introduction_flow: string[];
  activity_flow: string[];
  reflection_flow: string[];
  points: string[];
  hashtags: string[];
  image: string;
  material_photos: string[];
  video_link: string;
  detail_word_url: string;
  detail_pdf_url: string;
  detail_ppt_url: string;
  detail_excel_url: string;
  ict_use: string;
  subject: string;
  group_type: string;
  unit_order: number;
  unit_lesson_title: string;
};

export default function LessonLibraryPage() {
  // ==========================================
  // State管理
  // ==========================================
  const [activeTab, setActiveTab] = useState<"library" | "generator">("library");

  // --- Library用 ---
  const [lessons, setLessons] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("全て");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState<LessonCard | null>(null);
  const [showFlow, setShowFlow] = useState(false);

  // --- Generator用 ---
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<string>("");

  // ==========================================
  // データ読み込み (ライブラリ用CSV)
  // ==========================================
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(CSV_PATH);
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder("utf-8");
        // @ts-ignore
        const csv = decoder.decode(result?.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((row: any, index: number) => ({
              id: row.id || String(index + 1),
              unit_name: row.unit_name || "名称未設定",
              catch_copy: row.catch_copy || "",
              goal: row.goal || "",
              target_grade: row.target_grade || "",
              disability_type: row.disability_type || "",
              developmental_stage: row.developmental_stage || "",
              duration: row.duration || "",
              materials: row.materials || "",
              introduction_flow: row.introduction_flow ? row.introduction_flow.split(';').filter((s:string)=>s.trim()) : [],
              activity_flow: row.activity_flow ? row.activity_flow.split(';').filter((s:string)=>s.trim()) : [],
              reflection_flow: row.reflection_flow ? row.reflection_flow.split(';').filter((s:string)=>s.trim()) : [],
              points: row.points ? row.points.split(';').filter((s:string)=>s.trim()) : [],
              hashtags: row.hashtags ? row.hashtags.split(',').filter((s:string)=>s.trim()) : [],
              image: row.image || "",
              material_photos: row.material_photos ? row.material_photos.split(';').filter((s:string)=>s.trim()) : [],
              video_link: row.video_link || "",
              detail_word_url: row.detail_word_url || "",
              detail_pdf_url: row.detail_pdf_url || "",
              detail_ppt_url: row.detail_ppt_url || "",
              detail_excel_url: row.detail_excel_url || "",
              ict_use: row.ict_use || "",
              subject: row.subject || "その他",
              group_type: row.group_type || "",
              unit_order: Number(row.unit_order) || 0,
              unit_lesson_title: row.unit_lesson_title || ""
            }));
            setLessons(data);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("CSV読み込みエラー:", error);
        setLoading(false);
      }
    };
    fetchCsv();
  }, []);

  // ==========================================
  // Generator機能: API経由読み込み & Excel自動生成
  // ==========================================
  const handleLoadSheetData = async () => {
    setSheetLoading(true);
    try {
      // APIルートを叩く
      // ★【修正点】キャッシュを確実に回避するため、タイムスタンプを付与
      const response = await fetch(`/api/sheets?t=${new Date().getTime()}`, { 
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "データの取得に失敗しました");
      }

      setSheetData(result.data);
      alert(`${result.data.length}件の回答データを取得しました。`);
    } catch (e: any) {
      console.error(e);
      alert(`エラー: ${e.message}`);
    } finally {
      setSheetLoading(false);
    }
  };

  const handleGenerateExcel = async () => {
    if (!selectedRowIndex) return alert("出力するデータを選択してください。");

    const rowData = sheetData[Number(selectedRowIndex)];
    if (!rowData) return;

    try {
      // 1. テンプレート読み込み
      const response = await fetch(TEMPLATE_PATH);
      if (!response.ok) throw new Error(`テンプレートファイル(${TEMPLATE_PATH})が見つかりません。publicフォルダに配置してください。`);
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      // 2. シート取得
      // ※ ExcelJSではシート名が文字化けする場合があるため、1枚目(index 0)を取得するのが安全です
      const ws = workbook.worksheets[0];
      // 特定の名前で取りたい場合は: workbook.getWorksheet("授業カード");

      if (!ws) throw new Error("シートが見つかりません。");

      // 3. マッピング定義
      const mapping: Record<string, string> = {
        '知的段階及び発達段階': 'B2',
        '単元名': 'B3',
        'キャッチコピー': 'B5',
        '授業のねらい': 'B9',
        '学部学年': 'A5',
        '障害種': 'A2',
        '授業時間': 'A4',
        '準備物': 'B15',
        '導入の内容': 'B11',
        '展開の内容': 'B12',
        'まとめの内容': 'B13',
        '授業のPOINT': 'B10',
        '検索ワード': 'B23',
        'ICT活用': 'B21',
        '教科': 'A3',
        '学習形態': 'B7',
        '授業タイトル': 'B4',
        '単元内で何回目の授業か': 'B8',
      };

      // 4. 書き込み
      Object.keys(mapping).forEach(key => {
        const cellAddr = mapping[key];
        let val = rowData[key] || "";
        // 改行変換
        if (['導入の内容', '展開の内容', 'まとめの内容', '授業のPOINT'].includes(key)) {
             val = val.replace(/;/g, "\n");
        }
        const cell = ws.getCell(cellAddr);
        cell.value = val;
        // 折り返し設定 (textWrap)
        cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
      });

      // 5. ダウンロード ( .xlsx として保存 )
      const buffer = await workbook.xlsx.writeBuffer();
      
      // ★ 修正点: MIMEタイプを xlsx 用に変更
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      const unitName = rowData['単元名'] || '授業カード';
      const timestamp = rowData['タイムスタンプ'] ? rowData['タイムスタンプ'].split(' ')[0].replace(/\//g, '') : 'date';
      
      // ★ 修正点: 拡張子を .xlsx に変更
      const filename = `${unitName}_${timestamp}.xlsx`;
      
      saveAs(blob, filename);
      alert("Excelファイルを生成しました！");

    } catch (e: any) {
      console.error(e);
      alert(`エラー: ${e.message}`);
    }
  };


  // ==========================================
  // フィルタリング処理 (完全版)
  // ==========================================
  const allSubjects = ["全て", ...Array.from(new Set(lessons.map(l => l.subject).filter(Boolean))).sort()];
  const allTags = Array.from(new Set(lessons.flatMap(l => l.hashtags))).sort();

  const filteredLessons = lessons.filter(lesson => {
    // 1. キーワード検索
    const searchTarget = (
      lesson.unit_name + lesson.catch_copy + lesson.subject + lesson.goal + lesson.hashtags.join("")
    ).toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    
    // 2. 教科フィルタ
    const matchesSubject = selectedSubject === "全て" || lesson.subject === selectedSubject;
    
    // 3. タグフィルタ
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => lesson.hashtags.includes(tag));

    return matchesSearch && matchesSubject && matchesTags;
  });

  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const currentLessons = filteredLessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setCurrentPage(1);
  };

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // ==========================================
  // 表示 (詳細ページ)
  // ==========================================
  if (selectedLesson) {
    return (
      <DetailPage 
        lesson={selectedLesson} 
        onBack={() => { setSelectedLesson(null); setShowFlow(false); }}
        showFlow={showFlow}
        setShowFlow={setShowFlow}
        allLessons={lessons}
        onSelectLesson={(l: LessonCard) => {
            setSelectedLesson(l);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // ==========================================
  // 表示 (メイン: ライブラリ & Generator)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
            <ArrowLeft size={20} /> BACK TO TOP
          </Link>
          <div className="text-sm font-bold tracking-widest text-slate-900">MieeL APP</div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* タイトルエリア */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600 shadow-sm">
            <Layers size={40} />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">授業カードライブラリー</h2>
          <p className="text-gray-500">実践事例の検索と、Excelカード作成ツール</p>
        </div>

        {/* タブ切り替え */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "library" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-500 hover:bg-gray-100"}`}
          >
            📚 検索ライブラリ
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === "generator" ? "bg-emerald-600 text-white shadow-md" : "bg-white text-gray-500 hover:bg-gray-100"}`}
          >
            📝 Excelカード作成
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* === ライブラリ検索画面 === */}
          {activeTab === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* 検索・フィルタパネル */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* キーワード検索 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Search size={14} /> キーワード検索
                    </label>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="単元名、ねらい、タグなど..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  {/* 教科絞り込み */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Filter size={14} /> 教科で絞り込み
                    </label>
                    <select 
                      value={selectedSubject}
                      onChange={(e) => { setSelectedSubject(e.target.value); setCurrentPage(1); }}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none"
                    >
                      {allSubjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* タグ絞り込み */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={14} /> タグで絞り込み
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                          ${selectedTags.includes(tag) 
                            ? "bg-blue-600 border-blue-600 text-white" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"}
                        `}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* カード一覧 */}
              {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading Data...</div>
              ) : filteredLessons.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 text-gray-500">
                  該当する授業カードはありません。
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentLessons.map((lesson, i) => (
                    <LessonCardItem key={lesson.id} lesson={lesson} onClick={() => setSelectedLesson(lesson)} index={i} />
                  ))}
                </div>
              )}

              {/* ページネーション (数字選択式) */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((p, i) => (
                    typeof p === 'number' ? (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(p)}
                        className={`
                          w-10 h-10 rounded-lg font-bold transition-all border flex items-center justify-center
                          ${currentPage === p 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-110" 
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"}
                        `}
                      >
                        {p}
                      </button>
                    ) : (
                      <span key={i} className="px-2 text-gray-400 font-bold">...</span>
                    )
                  ))}

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* === Excel作成モード === */}
          {activeTab === "generator" && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg">
                  <FileSpreadsheet size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Excel授業カード自動作成</h3>
                  <p className="text-emerald-700 text-sm">Googleフォームの回答データを取得し、Excelに出力します。</p>
                </div>
              </div>

              <div className="space-y-8 bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-emerald-100">
                
                {/* Step 1 */}
                <div>
                  <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><span className="bg-emerald-200 px-2 rounded text-sm">1</span> データを入力</h4>
                  <a href={GOOGLE_FORM_URL} target="_blank" className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-emerald-500 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-colors">
                    <ExternalLink size={16} /> Googleフォームを開く
                  </a>
                </div>

                {/* Step 2 */}
                <div>
                  <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><span className="bg-emerald-200 px-2 rounded text-sm">2</span> データを取得 (API経由)</h4>
                  <button onClick={handleLoadSheetData} disabled={sheetLoading} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-shadow shadow-md disabled:opacity-50 flex items-center gap-2">
                    {sheetLoading ? <RefreshCw className="animate-spin" /> : <Download size={18} />}
                    {sheetLoading ? "取得中..." : "最新の回答を読み込む"}
                  </button>
                </div>

                {/* Step 3 */}
                {sheetData.length > 0 && (
                  <div className="pt-6 border-t border-emerald-200">
                    <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2"><span className="bg-emerald-200 px-2 rounded text-sm">3</span> 出力設定</h4>
                    
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-emerald-700 mb-2">出力するデータを選択</label>
                      <select 
                        value={selectedRowIndex}
                        onChange={(e) => setSelectedRowIndex(e.target.value)}
                        className="w-full p-3 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                      >
                        <option value="">▼ 選択してください</option>
                        {sheetData.map((row: any, i: number) => (
                          <option key={i} value={i}>
                            [{row['タイムスタンプ']}] {row['単元名']} ({row['授業者'] || '名前なし'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={handleGenerateExcel}
                      disabled={!selectedRowIndex}
                      className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <FileSpreadsheet size={20} /> Excelを作成してダウンロード
                    </button>
                    <p className="text-xs text-emerald-600 mt-2 text-center font-bold">
                      ※ publicフォルダの「template.xlsx」を使用します。
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// ==========================================
// コンポーネント群
// ==========================================

function LessonCardItem({ lesson, onClick, index }: { lesson: LessonCard, onClick: () => void, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <img 
          src={lesson.image || "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image"} 
          alt={lesson.unit_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-xs font-bold rounded text-blue-600 shadow-sm border border-blue-100">
          {lesson.subject}
        </span>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {lesson.unit_name}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">
          {lesson.catch_copy}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200"><GraduationCap size={12}/> {lesson.target_grade}</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs font-bold text-gray-600 border border-gray-200"><Clock size={12}/> {lesson.duration}</span>
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <button className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
            詳細を見る ➡
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailPage({ lesson, onBack, showFlow, setShowFlow, allLessons, onSelectLesson }: any) {
  const unitLessons = allLessons
    .filter((l: LessonCard) => l.unit_name === lesson.unit_name && l.target_grade === lesson.target_grade && l.unit_name !== '単元なし')
    .sort((a: any, b: any) => a.unit_order - b.unit_order);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"><ArrowLeft size={20} /> 一覧に戻る</button>
        <h1 className="text-sm font-bold text-gray-400">DETAIL VIEW</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{lesson.subject}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{lesson.target_grade}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{lesson.unit_name}</h1>
          <p className="text-xl text-gray-500 font-bold">{lesson.catch_copy}</p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-lg mb-12 border border-gray-100">
          <img 
            src={lesson.image || "https://placehold.co/1200x600/f1f5f9/94a3b8?text=No+Image"} 
            alt={lesson.unit_name}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InfoCard label="対象" value={lesson.target_grade} icon={<GraduationCap />} />
          <InfoCard label="時間" value={lesson.duration} icon={<Clock />} />
          <InfoCard label="障害種" value={lesson.disability_type} icon={<User />} />
          <InfoCard label="発達段階" value={lesson.developmental_stage} icon={<Layers />} />
          <InfoCard label="教科" value={lesson.subject} icon={<BookOpen />} />
          <InfoCard label="ICT活用" value={lesson.ict_use} icon={<Cpu />} />
        </div>

        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 mb-12">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-blue-500"/> ねらい
          </h3>
          <p className="text-lg text-slate-800 leading-loose mb-8 font-medium">{lesson.goal}</p>
          
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
            <h4 className="text-sm font-bold text-blue-500 mb-3 uppercase tracking-widest">TEACHING POINTS</h4>
            <ul className="space-y-3">
              {lesson.points.map((p: string, i: number) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-blue-400">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-12 shadow-sm">
          <button onClick={() => setShowFlow(!showFlow)} className="w-full p-6 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors">
            <span className="text-lg font-bold text-slate-900 flex items-center gap-3"><Clock className="text-gray-400" /> 授業の流れ</span>
            {showFlow ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          <AnimatePresence>
            {showFlow && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="bg-white border-t border-gray-200">
                <div className="p-8 space-y-8">
                  <FlowSection title="🚀 導入" items={lesson.introduction_flow} color="blue" />
                  <FlowSection title="💡 展開" items={lesson.activity_flow} color="green" />
                  <FlowSection title="💭 まとめ" items={lesson.reflection_flow} color="orange" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {unitLessons.length > 1 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Layers size={24} className="text-gray-400"/> この単元の授業</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {unitLessons.map((l: LessonCard) => (
                <button
                  key={l.id}
                  onClick={() => onSelectLesson(l)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${l.id === lesson.id 
                      ? "border-blue-500 bg-blue-50 text-blue-900" 
                      : "border-gray-200 hover:border-blue-300 text-gray-600 hover:bg-gray-50"}
                  `}
                >
                  <span className="block text-xs font-bold opacity-70 mb-1">{l.id === lesson.id ? "● 表示中" : `Lesson ${l.unit_order}`}</span>
                  <span className="font-bold block truncate">{l.unit_lesson_title || l.unit_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {lesson.video_link && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Video size={24} className="text-red-500"/> 授業動画</h3>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
              <iframe src={lesson.video_link.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen />
            </div>
          </div>
        )}

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Download size={32} className="text-blue-400"/> 資料ダウンロード</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DownloadBtn href={lesson.detail_word_url} label="指導案 (Word)" color="blue" icon={<FileText/>} />
            <DownloadBtn href={lesson.detail_pdf_url} label="指導案 (PDF)" color="red" icon={<FileText/>} />
            <DownloadBtn href={lesson.detail_ppt_url} label="授業スライド (PPT)" color="orange" icon={<ImageIcon/>} />
            <DownloadBtn href={lesson.detail_excel_url} label="評価シート (Excel)" color="green" icon={<LineChart/>} />
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: any) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-4">
      <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm border border-gray-100">{icon}</div>
      <div><div className="text-xs font-bold text-gray-400 uppercase">{label}</div><div className="font-bold text-slate-900">{value}</div></div>
    </div>
  );
}

function FlowSection({ title, items, color }: any) {
  const colors: any = { blue: "bg-blue-50 text-blue-900 border-blue-200", green: "bg-green-50 text-green-900 border-green-200", orange: "bg-orange-50 text-orange-900 border-orange-200" };
  if (!items || items.length === 0) return null;
  return (
    <div className={`p-6 rounded-xl border ${colors[color]}`}>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <ul className="space-y-3">{items.map((item: string, i: number) => <li key={i} className="flex gap-3"><span className="font-bold opacity-50">{i + 1}.</span>{item}</li>)}</ul>
    </div>
  );
}

function DownloadBtn({ href, label, color, icon }: any) {
  if (!href) return null;
  const colors: any = { blue: "bg-blue-600 hover:bg-blue-500", red: "bg-red-600 hover:bg-red-500", orange: "bg-orange-600 hover:bg-orange-500", green: "bg-emerald-600 hover:bg-emerald-500" };
  return <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 p-5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${colors[color]}`}>{icon} {label}</a>;
}