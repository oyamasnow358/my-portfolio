"use client";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, Zap, Globe, Code, Database, 
  MessageSquare, Info, Video, BookOpen
} from "lucide-react";

// ==========================================
// ▼ データ設定エリア
// ==========================================

// 1. アプリケーション一覧 (7つ)
const apps = [
  { 
    id: "01", 
    title: "指導支援検索", 
    en: "SEARCH SUPPORT", 
    href: "https://aspecial-education-app.onrender.com/%E6%8C%87%E5%B0%8E%E6%94%AF%E6%8F%B4%E5%86%85%E5%AE%B9" 
  },
  { 
    id: "02", 
    title: "発達チャート", 
    en: "DEVELOPMENT CHART", 
    href: "https://aspecial-education-app.onrender.com/%E7%99%BA%E9%81%94%E3%83%81%E3%83%A3%E3%83%BC%E3%83%88" 
  },
  { 
    id: "03", 
    title: "AI 指導案作成", 
    en: "LESSON PLAN AI", 
    href: "https://aspecial-education-app.onrender.com/AI%E3%81%AB%E3%82%88%E3%82%8B%E6%8C%87%E5%B0%8E%E6%A1%88%E4%BD%9C%E6%88%90" 
  },
  { 
    id: "04", 
    title: "AI 支援/指導計画作成", 
    en: "PLANNING ASSIST", 
    href: "https://aspecial-education-app.onrender.com/AI%E3%81%AB%E3%82%88%E3%82%8B%E6%94%AF%E6%8F%B4,%E6%8C%87%E5%B0%8E%E8%A8%88%E7%94%BB%E4%BD%9C%E6%88%90" 
  },
  { 
    id: "05", 
    title: "早引き学習指導要領", 
    en: "GUIDELINES", 
    href: "https://aspecial-education-app.onrender.com/%E7%9F%A5%E7%9A%84%E6%AE%B5%E9%9A%8E_%E6%97%A9%E5%BC%95%E3%81%8D%E5%AD%A6%E7%BF%92%E6%8C%87%E5%B0%8E%E8%A6%81%E9%A0%98" 
  },
  { 
    id: "06", 
    title: "授業カードライブラリ", 
    en: "LESSON CARD LIBRARY", 
    // ★もしURLが違う場合は修正してください
    href: "https://aspecial-education-app.onrender.com/%E6%8E%88%E6%A5%AD%E3%82%AB%E3%83%BC%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%83%BC" 
  },
  { 
    id: "07", 
    title: "動画ギャラリー", 
    en: "VIDEO GALLERY", 
    // ★もしURLが違う場合は修正してください
    href: "https://aspecial-education-app.onrender.com/%E5%8B%95%E7%94%BB%E3%82%AE%E3%83%A3%E3%83%A9%E3%83%AA%E3%83%BC" 
  },
];

// 2. 分析ツール一覧
const tools = [
  { 
    jp: "応用行動分析", 
    en: "Applied Behavior Analysis (ABA)", 
    href: "https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" 
  },
  { 
    jp: "機能的行動評価", 
    en: "Functional Behavior Assessment", 
    href: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" 
  },
  { 
    jp: "アンケート統計分析", 
    en: "Survey Statistical Analysis", 
    href: "https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" 
  },
  { 
    jp: "多変量回帰分析", 
    en: "Multivariate Regression", 
    href: "https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/" 
  },
  { 
    jp: "t検定・統計ツール", 
    en: "T-Test & Statistical Tools", 
    href: "https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" 
  },
  { 
    jp: "ノンパラメトリック分析", 
    en: "Non-Parametric Analysis", 
    href: "https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/" 
  },
];

// 3. 上部タグ（4つ）の中身
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
          <TechSpec icon={<Zap />} label="Framework" value="Next.js 14" />
          <TechSpec icon={<Code />} label="Styling" value="Tailwind CSS" />
          <TechSpec icon={<Layers />} label="Animation" value="Framer Motion" />
          <TechSpec icon={<Globe />} label="Host" value="Vercel & Render" />
        </div>
      </div>
    )
  },
  feedback: {
    title: "FEEDBACK",
    subtitle: "Send your request",
    content: (
      <div className="space-y-6 text-gray-300">
        <p>
          アプリに関するご意見・ご要望、バグ報告などがございましたら、以下のフォームよりお知らせください。
        </p>
        <a 
          href="https://docs.google.com/forms/d/1dKzh90OkxMoWDZXV31FgPvXG5EvNlMFOrvSPGvYTSC8/preview" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors"
        >
          <MessageSquare size={18} />
          アンケートフォームを開く
        </a>
      </div>
    )
  },
  about: {
    title: "ABOUT",
    subtitle: "About this project",
    content: (
      <div className="space-y-6 text-gray-300">
        <p>
          SPECIAL EDUCATION SUPPORT HUBは、特別支援教育に携わる先生方を支援するために開発された非営利のプラットフォームです。
        </p>
        <div className="p-4 bg-white/10 rounded-lg border border-white/10">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
             <Info size={16} /> 免責事項
          </h4>
          <p className="text-xs leading-relaxed opacity-80">
            本サイトの各ツールは支援の参考となることを目的としていますが、結果の正確性や妥当性を完全に保証するものではありません。実際の指導においては、対象となる児童生徒の実態に合わせて柔軟にご活用ください。
          </p>
        </div>
      </div>
    )
  }
};

// ==========================================
// ▲ 設定エリア終了
// ==========================================


export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* 背景画像 */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <motion.div 
          style={{ y }} 
          className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* --- 上部固定ヘッダー (タイトル + 4つのタグ) --- */}
      <header className="fixed w-full top-0 left-0 p-6 z-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        
        {/* 左上: タイトル */}
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <h1 className="text-xs font-bold tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            SUPPORT HUB <span className="text-gray-500">v2.0</span>
          </h1>
        </div>

        {/* 右上: 4つのタグ (白っぽく、小さく) */}
        <nav className="pointer-events-auto flex gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
          <HeaderTag icon={<User size={12} />} label="PROFILE" onClick={() => setSelectedId('profile')} />
          <HeaderTag icon={<Cpu size={12} />} label="SYSTEM" onClick={() => setSelectedId('system')} />
          <HeaderTag icon={<MessageSquare size={12} />} label="FEEDBACK" onClick={() => setSelectedId('feedback')} />
          <HeaderTag icon={<Info size={12} />} label="ABOUT" onClick={() => setSelectedId('about')} />
        </nav>
      </header>


      <div className="relative z-10">
        
        {/* 1. メインビジュアル */}
        <main className="pt-48 px-6 md:px-12 pb-20 border-b border-white/20">
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1 }}
          >
            <div className="overflow-hidden mb-2">
              <motion.h2 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter"
              >
                SPECIAL
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h2 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter"
              >
                EDUCATION
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-10">
              <motion.h2 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter text-gray-500"
              >
                SUPPORT.
              </motion.h2>
            </div>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gray-400 max-w-xl text-lg leading-relaxed pl-2 border-l-2 border-white/30"
            >
              Data-Driven Education.<br />
              指導案作成から統計分析までを一元化したプラットフォーム。
            </motion.p>
          </motion.div>
        </main>

        {/* 2. アプリ一覧 (7つ) - グリッドレイアウト */}
        <section className="border-b border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-b md:border-b-0 md:border-r border-white/20">
              {apps.slice(0, 4).map((app) => (
                <AppCard key={app.id} {...app} />
              ))}
            </div>
            <div>
              {apps.slice(4).map((app) => (
                <AppCard key={app.id} {...app} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. 分析ツール (日本語メイン) */}
        <section className="p-6 md:p-12">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <h2 className="text-4xl font-bold">ANALYSIS TOOLS</h2>
              <p className="text-gray-500 text-sm">研究・分析用ツール群</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/20 border border-white/20">
            {tools.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <a 
                  href={item.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-white hover:text-black transition-colors duration-300 p-8 flex flex-col justify-center group h-40 block"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xl">{item.jp}</span>
                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 group-hover:text-black/60 tracking-tight">
                    {item.en}
                  </span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <footer className="p-12 text-center text-gray-600 text-xs border-t border-white/20">
          &copy; 2025 SPECIAL EDUCATION SUPPORT HUB.
        </footer>
      </div>

      {/* --- モーダル (詳細表示) --- */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111] border border-white/20 p-8 md:p-12 max-w-2xl w-full relative shadow-2xl rounded-xl"
              onClick={(e) => e.stopPropagation()}
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

// --- 部品: ヘッダー用タグボタン (白っぽく、小さく) ---
function HeaderTag({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2 px-4 py-2 
        bg-white/90 text-black 
        hover:bg-blue-500 hover:text-white 
        rounded-full text-[10px] font-bold tracking-wider 
        transition-all duration-300 shadow-lg hover:shadow-blue-500/50
        whitespace-nowrap
      "
    >
      {icon}
      {label}
    </button>
  );
}

// --- 部品: 毎回ヌルっと動く ScrollReveal ---
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }} 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// --- 部品: アプリカード ---
function AppCard({ id, title, en, href }: { id: string, title: string, en: string, href: string }) {
  // 授業カードライブラリなどのためのアイコン選択
  let Icon = ArrowUpRight;
  if (title.includes("動画")) Icon = Video;
  if (title.includes("授業カード")) Icon = Database;
  if (title.includes("指導要領")) Icon = BookOpen;

  return (
    <ScrollReveal>
      <a 
        href={href} 
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block p-10 border-b border-white/20 hover:bg-white hover:text-black transition-colors duration-500 group min-h-[200px] flex flex-col justify-between"
      >
        <div className="flex justify-between w-full">
          <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{id}</span>
          <Icon className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-1">{title}</h3>
          <p className="text-xs text-gray-500 tracking-wider group-hover:text-black/60 font-mono">{en}</p>
        </div>
      </a>
    </ScrollReveal>
  );
}

// --- 部品: 技術仕様リスト ---
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