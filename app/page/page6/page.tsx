"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Youtube, Video, ExternalLink, PlayCircle, Info, ArrowUpRight // ← これを追加しました
} from "lucide-react";
import Link from "next/link";

const LOGO_PATH = "/MieeL2.png"; 

// ==========================================
// データ定義
// ==========================================
const YOUTUBE_DATA = [
  {
    title: "ダウン症",
    videoId: "7gBd_iYF7TI",
    desc: "ダウン症に関する基本的な情報、特性、そして支援のポイントを解説します。社会生活や学習における具体的なアプローチについても触れています。",
    available: true
  },
  {
    title: "自閉症スペクトラム（ASD）",
    videoId: "FyFmvcWrrvM",
    desc: "自閉症スペクトラム障害（ASD）の基本的な理解を深めます。コミュニケーションや社会性の特性、感覚過敏などについて詳しく説明し、効果的な支援方法を提案します。",
    available: true
  },
  {
    title: "自閉症スペクトラムの5種類",
    videoId: "b7nnOId_NVo",
    desc: "かつての分類（アスペルガー症候群、カナー型自閉症など）とその特徴について解説します。",
    available: true
  },
  {
    title: "応用行動分析（ABA）",
    videoId: "CTd1gLHEFYM",
    desc: "応用行動分析（ABA）の基本原則と、それが特別支援教育においてどのように活用されるかを解説します。",
    available: true
  },
  {
    title: "注意欠如・多動症（ADHD）",
    videoId: "pzM3-J1LUG4",
    desc: "ADHDの特性を理解し、集中力の困難、多動性、衝動性に対する具体的な支援策を学びます。",
    available: true
  },
  {
    title: "高機能学習障害（LD）",
    videoId: "j9_vT7bJ47I",
    desc: "読み書き、計算など特定の学習領域に困難を抱えるLDについて、その特性と個別の指導法を解説します。",
    available: true
  },
  {
    title: "卒業後の進路",
    videoId: "rFjB2v3Hw24",
    desc: "特別支援学校卒業後の進路選択について、就労支援、進学、地域生活支援などを解説します。",
    available: false
  },
  {
    title: "動作法",
    videoId: null,
    desc: "身体運動を通して心の状態を安定させ、自己肯定感を育む支援方法です。",
    available: false
  },
  {
    title: "最新のICT教材",
    videoId: null,
    desc: "タブレットアプリ、オンラインツール、ロボット教材など、学習意欲を高めるための多様なツールを紹介します。",
    available: false
  },
  {
    title: "スイッチ教材",
    videoId: null,
    desc: "重度の肢体不自由や認知発達の遅れがある子どもたちへのスイッチ教材活用事例を紹介します。",
    available: false
  }
];

export default function VideoGalleryPage() {
  // State: 選択中のタブ (利用可能なものだけフィルタリング)
  const availableTopics = YOUTUBE_DATA.filter(item => item.available);
  const [activeTab, setActiveTab] = useState(availableTopics[0].title);

  // 現在選択されているトピックのデータを取得
  const currentData = availableTopics.find(t => t.title === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
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
          <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-6 text-red-600 shadow-sm">
            <Youtube size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">YouTube 動画ギャラリー</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            特別支援教育に関する動画と解説をまとめています。<br/>
            気になるトピックを選んでご覧ください。
          </p>
        </motion.div>

        {/* タブナビゲーション */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max mx-auto justify-center">
            {availableTopics.map((topic) => (
              <button
                key={topic.title}
                onClick={() => setActiveTab(topic.title)}
                className={`
                  px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === topic.title 
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}
                `}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* コンテンツエリア (アニメーション付き切り替え) */}
        <AnimatePresence mode="wait">
          {currentData && (
            <motion.div
              key={currentData.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-12">
                
                {/* 左側: 解説 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <Video className="text-red-500" size={28} />
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{currentData.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-loose text-lg mb-8">
                    {currentData.desc}
                  </p>
                  
                  {currentData.videoId ? (
                    <a 
                      href={`https://www.youtube.com/watch?v=${currentData.videoId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
                    >
                      <ExternalLink size={20} /> YouTubeで直接見る
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-gray-400 bg-gray-100 px-4 py-2 rounded-lg">
                      <Info size={18} /> 動画準備中
                    </div>
                  )}
                </div>

                {/* 右側: 動画埋め込み */}
                <div className="flex-1">
                  {currentData.videoId ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentData.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-2xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 border border-gray-200">
                      <PlayCircle size={48} className="mb-2 opacity-50" />
                      <span className="text-sm font-bold">動画は現在準備中です</span>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 関連リンクエリア */}
        <div className="mt-20">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ExternalLink size={20} /> 関連ツール＆リンク
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LinkCard title="応用行動分析 (ABA)" href="https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" tag="教育・心理" />
            <LinkCard title="機能的行動評価" href="https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" tag="教育・心理" />
            <LinkCard title="アンケート分析" href="https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" tag="統計" />
            <LinkCard title="t検定・統計ツール" href="https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" tag="統計" />
          </div>
        </div>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// --- 部品: リンクカード ---
function LinkCard({ title, href, tag }: { title: string, href: string, tag: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-red-200 transition-all group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">{tag}</span>
        <ArrowUpRight size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">{title}</h4>
    </a>
  );
}