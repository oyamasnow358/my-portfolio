"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Layers, Clock, GraduationCap, Video, FileText, 
  ChevronDown, ChevronUp, Download, Tag, BookOpen, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import Papa from "papaparse"; // CSVパース用 (npm install papaparse @types/papaparse)

// ==========================================
// 定数・型定義
// ==========================================
const CSV_PATH = "/lesson_cards.csv";
const LOGO_PATH = "/MieeL2.png";
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
  const [lessons, setLessons] = useState<LessonCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 検索・フィルタ
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("全て");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);

  // 詳細表示
  const [selectedLesson, setSelectedLesson] = useState<LessonCard | null>(null);
  const [showFlow, setShowFlow] = useState(false);

  // ==========================================
  // データ読み込み (CSV)
  // ==========================================
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch(CSV_PATH);
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder("utf-8");
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
  // フィルタリング処理
  // ==========================================
  const allSubjects = ["全て", ...Array.from(new Set(lessons.map(l => l.subject).filter(Boolean))).sort()];
  const allTags = Array.from(new Set(lessons.flatMap(l => l.hashtags))).sort();

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = (
      lesson.unit_name + lesson.catch_copy + lesson.subject + lesson.goal + lesson.hashtags.join("")
    ).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === "全て" || lesson.subject === selectedSubject;
    
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => lesson.hashtags.includes(tag));

    return matchesSearch && matchesSubject && matchesTags;
  });

  // ページネーション計算
  const totalPages = Math.ceil(filteredLessons.length / ITEMS_PER_PAGE);
  const currentLessons = filteredLessons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ==========================================
  // ハンドラー
  // ==========================================
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // ==========================================
  // 表示 (メイン)
  // ==========================================
  if (selectedLesson) {
    return (
      <DetailPage 
        lesson={selectedLesson} 
        onBack={() => { setSelectedLesson(null); setShowFlow(false); }}
        showFlow={showFlow}
        setShowFlow={setShowFlow}
        allLessons={lessons}
        onSelectLesson={setSelectedLesson}
      />
    );
  }

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

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600 shadow-sm">
            <Layers size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">授業カードライブラリー</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            先生方の実践授業アイデアを共有・検索できるデータベース。<br/>
            教科やタグで絞り込んで、明日の授業のヒントを見つけましょう。
          </p>
          
          <a href="https://leeson-abfy5bxayhavhoznzexj8r.streamlit.app/" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
             <span>📝</span> 授業カードを作成する (Googleフォーム)
          </a>
        </motion.div>

        {/* 検索・フィルタエリア */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-12 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">キーワード検索</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="単元名、ねらい、タグなど..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">教科で絞り込み</label>
              <select 
                value={selectedSubject}
                onChange={(e) => { setSelectedSubject(e.target.value); setCurrentPage(1); }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {allSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">タグで絞り込み</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${selectedTags.includes(tag) 
                      ? "bg-blue-100 border-blue-500 text-blue-800" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"}
                  `}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 授業カード一覧 */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">該当する授業カードはありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <AnimatePresence mode="popLayout">
              {currentLessons.map((lesson, i) => (
                <LessonCardItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  onClick={() => setSelectedLesson(lesson)} 
                  index={i} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 font-bold text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// ==========================================
// カードコンポーネント (一覧用)
// ==========================================
function LessonCardItem({ lesson, onClick, index }: { lesson: LessonCard, onClick: () => void, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100">
          {lesson.subject}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {lesson.unit_name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {lesson.catch_copy}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge icon={<GraduationCap size={12}/>} text={lesson.target_grade} />
          <Badge icon={<Clock size={12}/>} text={lesson.duration} />
        </div>

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-wrap gap-1 mb-3">
            {lesson.hashtags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded">#{tag}</span>
            ))}
          </div>
          <button className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-lg opacity-90 group-hover:opacity-100 group-hover:shadow-md transition-all">
            詳細を見る ➡
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Badge({ icon, text }: any) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
      {icon} {text}
    </span>
  );
}

// ==========================================
// 詳細ページコンポーネント
// ==========================================
function DetailPage({ lesson, onBack, showFlow, setShowFlow, allLessons, onSelectLesson }: any) {
  // 単元連携の授業を取得
  const unitLessons = allLessons
    .filter((l: LessonCard) => l.unit_name === lesson.unit_name && l.target_grade === lesson.target_grade && l.unit_name !== '単元なし')
    .sort((a: any, b: any) => a.unit_order - b.unit_order);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 詳細ヘッダー */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <ArrowLeft size={20} /> 一覧に戻る
        </button>
        <h1 className="text-sm font-bold text-gray-400">DETAIL VIEW</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* タイトルエリア */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">{lesson.subject}</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{lesson.target_grade}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{lesson.unit_name}</h1>
          <p className="text-xl text-gray-500 font-bold">{lesson.catch_copy}</p>
        </div>

        {/* メイン画像 */}
        <div className="rounded-3xl overflow-hidden shadow-lg mb-12 border border-gray-100">
          <img 
            src={lesson.image || "https://placehold.co/1200x600/f1f5f9/94a3b8?text=No+Image"} 
            alt={lesson.unit_name}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* 基本情報グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InfoCard label="対象" value={lesson.target_grade} icon={<GraduationCap />} />
          <InfoCard label="時間" value={lesson.duration} icon={<Clock />} />
          <InfoCard label="障害種" value={lesson.disability_type} icon={<User />} />
          <InfoCard label="発達段階" value={lesson.developmental_stage} icon={<Layers />} />
          <InfoCard label="教科" value={lesson.subject} icon={<BookOpen />} />
          <InfoCard label="ICT活用" value={lesson.ict_use} icon={<Cpu />} />
        </div>

        {/* ねらい & ポイント */}
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

        {/* 授業の流れ (アコーディオン) */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-12 shadow-sm">
          <button 
            onClick={() => setShowFlow(!showFlow)}
            className="w-full p-6 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <Clock className="text-gray-400" /> 授業の流れ
            </span>
            {showFlow ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          <AnimatePresence>
            {showFlow && (
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: "auto" }} 
                exit={{ height: 0 }}
                className="bg-white border-t border-gray-200"
              >
                <div className="p-8 space-y-8">
                  <FlowSection title="🚀 導入" items={lesson.introduction_flow} color="blue" />
                  <FlowSection title="💡 展開" items={lesson.activity_flow} color="green" />
                  <FlowSection title="💭 まとめ" items={lesson.reflection_flow} color="orange" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 単元連携 */}
        {unitLessons.length > 1 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Layers size={24} className="text-gray-400"/> この単元の授業
            </h3>
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
                  <span className="block text-xs font-bold opacity-70 mb-1">
                    {l.id === lesson.id ? "● 表示中" : `Lesson ${l.unit_order}`}
                  </span>
                  <span className="font-bold block truncate">{l.unit_lesson_title || l.unit_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 動画 */}
        {lesson.video_link && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Video size={24} className="text-red-500"/> 授業動画
            </h3>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
              {/* YouTube埋め込みなど（URLからID抽出が必要な場合は別途処理） */}
              <iframe 
                src={lesson.video_link.replace("watch?v=", "embed/")} 
                className="w-full h-full" 
                allowFullScreen 
              />
            </div>
          </div>
        )}

        {/* ダウンロードエリア */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Download size={32} className="text-blue-400"/> 資料ダウンロード
          </h3>
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

// --- 詳細用部品 ---
function InfoCard({ label, value, icon }: any) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-4">
      <div className="p-3 bg-white rounded-full text-gray-400 shadow-sm border border-gray-100">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase">{label}</div>
        <div className="font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function FlowSection({ title, items, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-900 border-blue-200",
    green: "bg-green-50 text-green-900 border-green-200",
    orange: "bg-orange-50 text-orange-900 border-orange-200",
  };
  
  if (!items || items.length === 0) return null;

  return (
    <div className={`p-6 rounded-xl border ${colors[color]}`}>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <ul className="space-y-3">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex gap-3">
            <span className="font-bold opacity-50">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DownloadBtn({ href, label, color, icon }: any) {
  if (!href) return null;
  
  const colors: any = {
    blue: "bg-blue-600 hover:bg-blue-500",
    red: "bg-red-600 hover:bg-red-500",
    orange: "bg-orange-600 hover:bg-orange-500",
    green: "bg-emerald-600 hover:bg-emerald-500",
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center gap-3 p-5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1
        ${colors[color]}
      `}
    >
      {icon} {label}
    </a>
  );
}