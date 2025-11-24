"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, Zap, Globe, Code 
} from "lucide-react";

// --- データ定義 ---

// 1. アプリ一覧
const apps = [
  { id: "01", title: "指導支援検索", desc: "SEARCH SUPPORT", href: "#" },
  { id: "02", title: "発達チャート", desc: "DEVELOPMENT CHART", href: "#" },
  { id: "03", title: "AI指導案作成", desc: "LESSON PLAN AI", href: "#" },
  { id: "04", title: "計画作成AI", desc: "PLANNING ASSIST", href: "#" },
  { id: "05", title: "学習指導要領", desc: "GUIDELINES", href: "#" },
];

// 2. 分析ツール
const tools = [
  "Applied Behavior Analysis (ABA)", "Functional Behavior Assessment", 
  "Survey Statistical Analysis", "Multivariate Regression", 
  "T-Test & Statistical Tools", "Non-Parametric Analysis"
];

// 3. モーダルで表示する詳細データ（プロフィール＆システム）
const detailContent = {
  profile: {
    title: "ADMINISTRATOR",
    subtitle: "Special Education Teacher / Developer",
    content: (
      <div className="space-y-6">
        <p className="leading-relaxed text-gray-300">
          岩槻はるかぜ特別支援学校 教諭。<br />
          特別支援教育の現場における「経験則」に「データ」という新たな視点を加えるべく、教具としてのアプリケーション開発を行っています。
        </p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-center gap-2"><User size={16} /> KOYAMA (Administrator)</li>
          <li className="flex items-center gap-2"><Code size={16} /> Python / TypeScript / React</li>
        </ul>
      </div>
    )
  },
  system: {
    title: "SYSTEM ARCHITECTURE",
    subtitle: "Modern Web Technology Stack",
    content: (
      <div className="space-y-8">
        <p className="leading-relaxed text-gray-300">
          このプラットフォームは、最新のWeb技術を組み合わせて構築されており、高速かつセキュアな動作を実現しています。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TechSpec icon={<Zap />} label="Framework" value="Next.js 14 (App Router)" />
          <TechSpec icon={<Code />} label="Styling" value="Tailwind CSS" />
          <TechSpec icon={<Layers />} label="Animation" value="Framer Motion" />
          <TechSpec icon={<Globe />} label="Infrastructure" value="Vercel (Edge Network)" />
        </div>
      </div>
    )
  }
};

// --- メインコンポーネント ---
export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* ヘッダー */}
      <header className="flex justify-between items-center p-8 border-b border-white/20 fixed w-full top-0 bg-black/80 backdrop-blur-md z-40">
        <h1 className="text-sm font-bold tracking-widest">SUPPORT HUB</h1>
        <div className="text-xs text-gray-500 font-mono">VER 2.0</div>
      </header>

      {/* 1. メインビジュアル */}
      <main className="pt-40 px-6 md:px-12 pb-20 border-b border-white/20">
        <ScrollReveal>
          <h2 className="text-7xl md:text-9xl font-bold leading-[0.9] tracking-tighter mb-10">
            SPECIAL<br />
            EDUCATION<br />
            <span className="text-gray-600">SUPPORT.</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            Data-Driven Education.<br />
            指導案作成から統計分析までを一元化したプラットフォーム。
          </p>
        </ScrollReveal>
      </main>

      {/* 2. アプリ一覧（グリッド） */}
      <section className="border-b border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左列 */}
          <div className="border-b md:border-b-0 md:border-r border-white/20">
            {apps.slice(0, 3).map((app) => (
              <AppCard key={app.id} {...app} />
            ))}
          </div>
          {/* 右列 */}
          <div>
            {apps.slice(3).map((app) => (
              <AppCard key={app.id} {...app} />
            ))}
            
            {/* 巨大なリンク：授業カード */}
            <ScrollReveal delay={0.2}>
              <a href="#" className="block h-[300px] p-10 relative group bg-neutral-900 hover:bg-white transition-colors duration-500 border-t border-white/20 overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <span className="text-xs font-mono text-gray-500 group-hover:text-black">NEW ARRIVAL</span>
                  <ArrowUpRight className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <div className="absolute bottom-10 left-10 relative z-10">
                  <h3 className="text-4xl font-bold mb-2 group-hover:text-black">授業カード<br/>ライブラリ</h3>
                  <p className="text-gray-500 text-sm group-hover:text-black">全国の実践事例を共有・検索</p>
                </div>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. プロフィール & システム (クリックでモーダル表示) */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-white/20">
        {/* プロフィール */}
        <div 
          onClick={() => setSelectedId('profile')}
          className="p-16 border-b md:border-b-0 md:border-r border-white/20 hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer group h-[400px] flex flex-col justify-between"
        >
          <div className="flex justify-between">
             <User className="text-gray-500 group-hover:text-black" size={32} />
             <ArrowUpRight className="text-gray-500 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <ScrollReveal>
            <h3 className="text-4xl font-bold mb-2">ADMINISTRATOR</h3>
            <p className="text-sm text-gray-500 group-hover:text-black/60 font-mono">WHO IS DEVELOPING?</p>
          </ScrollReveal>
        </div>

        {/* システム構成 */}
        <div 
          onClick={() => setSelectedId('system')}
          className="p-16 hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer group h-[400px] flex flex-col justify-between"
        >
          <div className="flex justify-between">
             <Cpu className="text-gray-500 group-hover:text-black" size={32} />
             <ArrowUpRight className="text-gray-500 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <ScrollReveal delay={0.1}>
            <h3 className="text-4xl font-bold mb-2">SYSTEM</h3>
            <p className="text-sm text-gray-500 group-hover:text-black/60 font-mono">HOW IT WORKS?</p>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. 分析ツールリスト */}
      <section className="p-6 md:p-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <h2 className="text-4xl font-bold">ANALYSIS TOOLS</h2>
            <p className="text-gray-500 text-sm">研究・分析用ツール群</p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/20 border border-white/20">
          {tools.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <a href="#" className="bg-black hover:bg-white hover:text-black transition-colors duration-300 p-6 flex justify-between items-center group h-32 block">
                <span className="font-bold text-lg">{item}</span>
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <footer className="p-12 text-center text-gray-600 text-xs border-t border-white/20">
        &copy; 2025 SPECIAL EDUCATION SUPPORT HUB.
      </footer>

      {/* --- モーダル (ポップアップ詳細) --- */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-neutral-900 border border-white/20 p-8 md:p-12 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()} // 中身をクリックしても閉じないように
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="text-xs font-mono text-blue-400 block mb-2">
                  {/* @ts-ignore */}
                  {detailContent[selectedId].title}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {/* @ts-ignore */}
                  {detailContent[selectedId].subtitle}
                </h2>
                <div className="h-1 w-20 bg-blue-500 mt-4"></div>
              </div>

              <div className="text-gray-300">
                {/* @ts-ignore */}
                {detailContent[selectedId].content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- 部品: スクロールでヌルっと出るラッパー ---
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // 下から
      whileInView={{ opacity: 1, y: 0 }} // 元の位置へ
      viewport={{ once: true, margin: "-10%" }} // 画面に少し入ったら発動
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay }} // ヌルっとした動き
    >
      {children}
    </motion.div>
  );
}

// --- 部品: アプリカード ---
function AppCard({ id, title, desc, href }: { id: string, title: string, desc: string, href: string }) {
  return (
    <ScrollReveal>
      <a href={href} className="block p-10 border-b border-white/20 hover:bg-white hover:text-black transition-colors duration-500 group min-h-[200px] flex flex-col justify-between">
        <div className="flex justify-between w-full">
          <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{id}</span>
          <ArrowUpRight className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
        <div>
          <h3 className="text-3xl font-bold mb-1">{title}</h3>
          <p className="text-xs text-gray-500 tracking-wider group-hover:text-black/60">{desc}</p>
        </div>
      </a>
    </ScrollReveal>
  );
}

// --- 部品: 技術仕様リスト (Modal内用) ---
function TechSpec({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-black/50 border border-white/10 rounded">
      <div className="text-blue-400">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-bold text-sm">{value}</div>
      </div>
    </div>
  );
}