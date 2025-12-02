"use client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ArrowUpRight, Layers, Video, BookOpen, 
  Activity, FileText, Brain, BarChart3, Search
} from "lucide-react";
import Link from "next/link";

// ==========================================
// データ設定
// ==========================================
const MieeLApps = [
  { 
    id: "01", 
    title: "指導支援検索", 
    en: "SEARCH SUPPORT", 
    href: "/page/page1",
    icon: <Search />,
    desc: "困りごとに応じた指導・支援を検索"
  },
  { 
    id: "02", 
    title: "発達チャート", 
    en: "DEVELOPMENT CHART", 
    href: "/page/page2",
    icon: <BarChart3 />,
    desc: "発達段階を可視化・記録する"
  },
  { 
    id: "03", 
    title: "AI 指導案作成", 
    en: "LESSON PLAN AI", 
    href: "/page/page5",
    icon: <FileText />,
    desc: "基本情報から指導案を自動生成"
  },
  { 
    id: "04", 
    title: "AI 支援/指導計画作成", 
    en: "PLANNING ASSIST", 
    href: "/page/page4",
    icon: <Brain />,
    desc: "個別の計画作成プロンプトを生成"
  },
  { 
    id: "05", 
    title: "早引き学習指導要領", 
    en: "GUIDELINES", 
    href: "/page/page3",
    icon: <BookOpen />,
    desc: "知的障害特別支援学校の要領検索"
  },
  { 
    id: "06", 
    title: "授業カードライブラリ", 
    en: "LESSON CARD LIBRARY", 
    href: "/page/page7",
    icon: <Layers />,
    desc: "実践事例の共有データベース"
  },
  { 
    id: "07", 
    title: "動画ギャラリー", 
    en: "VIDEO GALLERY", 
    href: "/page/page6",
    icon: <Video />,
    desc: "特別支援教育に関する動画集"
  },
  { 
    id: "08", 
    title: "研究・分析", 
    en: "ANALYSIS & TOOLS", 
    href: "/page/page8",
    icon: <Activity />,
    desc: "統計分析・行動分析ツール集"
  },
];

export default function SelectPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 背景装飾 */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <h1 className="text-lg font-bold tracking-widest text-slate-900">APPLICATIONS</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">MieeL 各機能</h2>
          <p className="text-gray-500 font-bold tracking-widest">SELECT APPLICATION</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MieeLApps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={app.href} className="block h-full">
                <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 group shadow-sm hover:shadow-2xl h-full flex flex-col justify-between">
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-mono text-xs text-gray-400 group-hover:text-white/60 tracking-widest">{app.id}</span>
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      {app.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-white">{app.title}</h3>
                    <p className="text-xs font-bold text-blue-600 group-hover:text-blue-300 mb-3 tracking-widest">{app.en}</p>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 group-hover:border-gray-800 flex justify-end">
                    <ArrowUpRight className="text-gray-300 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}