"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, Zap, Globe, Code, Database, 
  MessageSquare, Info, Video, BookOpen,
  Users, School, Lightbulb, Activity
} from "lucide-react";

// ==========================================
// ▼ データ設定エリア
// ==========================================

// ★ロゴ画像のパス
// publicフォルダに入れたファイル名だけでOKです
const LOGO_PATH = "/mirairo.png"; 

// 1. Mirairoアプリ一覧
const mirairoApps = [
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
    href: "https://aspecial-education-app.onrender.com/%E6%8E%88%E6%A5%AD%E3%82%AB%E3%83%BC%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%83%BC" 
  },
  { 
    id: "07", 
    title: "動画ギャラリー", 
    en: "VIDEO GALLERY", 
    href: "https://aspecial-education-app.onrender.com/%E5%8B%95%E7%94%BB%E3%82%AE%E3%83%A3%E3%83%A9%E3%83%AA%E3%83%BC" 
  },
];

// 2. 分析ツール一覧
const analysisTools = [
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

// 3. つながり (Network) データ
const networkData = [
  { name: "IT Teacher A", role: "High School Info Dept.", desc: "Network Specialist" },
  { name: "IT Teacher B", role: "Special Ed. Coordinator", desc: "iPad Utilization" },
  { name: "Researcher C", role: "University Lab", desc: "Data Analysis Support" },
  // ★ここに追加してください
];

// ==========================================
// ▲ 設定エリア終了
// ==========================================

export default function Home() {
  const [opPhase, setOpPhase] = useState(0); // 0:ロゴ, 1:文字, 2:完了
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // オープニングアニメーション制御
  useEffect(() => {
    // 1.5秒後に文字フェーズへ
    const timer1 = setTimeout(() => setOpPhase(1), 2000);
    // さらに2.5秒後(計4.5秒後)にメイン画面へ
    const timer2 = setTimeout(() => setOpPhase(2), 4500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* 0. オープニングアニメーション */}
      <AnimatePresence mode="wait">
        {opPhase < 2 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            {/* フェーズ0: ロゴ表示 */}
            {opPhase === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 1 }}
              >
                {/* 
                  ★注意: もしロゴが「黒い文字」の画像の場合、
                  className="... invert" をつけると色が反転して白くなり、見やすくなります。
                  元から白い文字やカラフルなロゴなら invert は消してください。
                */}
                <img src={LOGO_PATH} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
              </motion.div>
            )}

            {/* フェーズ1: キャッチコピー表示 */}
            {opPhase === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <p className="text-sm md:text-lg text-gray-400 mb-4 tracking-widest font-light">
                  すぐわかる。すぐ使える。
                </p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                  Mirairo
                </h1>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景画像 */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <motion.div 
          style={{ y }} 
          className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* --- ヘッダー (固定タグ) --- */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <h1 className="text-xs font-bold tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Mirairo <span className="text-gray-500">v2.0</span>
          </h1>
        </div>
        <nav className="pointer-events-auto flex gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
          <HeaderTag icon={<User size={12} />} label="PROFILE" onClick={() => setSelectedPage('profile')} />
          <HeaderTag icon={<Cpu size={12} />} label="SYSTEM" onClick={() => setSelectedPage('system')} />
          <HeaderTag icon={<MessageSquare size={12} />} label="FEEDBACK" onClick={() => setSelectedPage('feedback')} />
          <HeaderTag icon={<Info size={12} />} label="ABOUT" onClick={() => setSelectedPage('about')} />
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-48 pb-20 px-6 md:px-12">
        
        {/* メインビジュアルエリア */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1 }}
           className="mb-20 border-l-2 border-white/20 pl-6 md:pl-10"
        >
          {/* 追加: メインビジュアル上のロゴ */}
          <motion.img 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 4.8, duration: 1 }} // OPが終わった後にふわっと出る
            src={LOGO_PATH} 
            alt="Mirairo Logo" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain mb-8"
          />

          <h2 className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter mb-6">
            SPECIAL<br/>
            EDUCATION<br/>
            SUPPORT.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl tracking-wide max-w-xl leading-relaxed">
            Data-Driven Education.<br/>
            指導案作成から統計分析までを一元化したプラットフォーム。
          </p>
        </motion.div>

        {/* --- メインメニュー (5つのカード) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/20 border border-white/20">
          
          <MenuCard 
            title="Mirairo アプリ" 
            sub="APPLICATIONS" 
            icon={<Layers />} 
            onClick={() => setSelectedPage('apps')}
            big
          />
          <MenuCard 
            title="アプリマニュアル" 
            sub="MANUAL & GUIDE" 
            icon={<BookOpen />} 
            onClick={() => setSelectedPage('manual')}
          />
          <MenuCard 
            title="つながり" 
            sub="NETWORK" 
            icon={<Users />} 
            onClick={() => setSelectedPage('network')}
          />
          <MenuCard 
            title="導入校" 
            sub="CASE STUDY" 
            icon={<School />} 
            onClick={() => setSelectedPage('school')}
          />
          <MenuCard 
            title="分析ツール" 
            sub="FOR RESEARCHERS" 
            icon={<Activity />} 
            onClick={() => setSelectedPage('tools')}
          />

        </section>

        <footer className="mt-20 pt-10 border-t border-white/10 text-center text-gray-600 text-xs">
          &copy; 2025 Mirairo Project. All Rights Reserved.
        </footer>
      </div>

      {/* --- ページ遷移 (フルスクリーンモーダル) --- */}
      <AnimatePresence>
        {selectedPage && (
          <PageContent page={selectedPage} onClose={() => setSelectedPage(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// ▼ サブコンポーネント群
// ==========================================

function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#000" }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        bg-black p-8 md:p-12 cursor-pointer group relative overflow-hidden flex flex-col justify-between
        ${big ? 'md:col-span-2' : ''} h-[250px] md:h-[300px]
      `}
    >
      <div className="flex justify-between items-start">
        <div className="text-gray-500 group-hover:text-black transition-colors">
          {icon}
        </div>
        <ArrowUpRight className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 group-hover:text-black/60 mb-2 tracking-widest">{sub}</p>
        <h3 className="text-3xl md:text-4xl font-bold">{title}</h3>
      </div>
    </motion.div>
  );
}

function HeaderTag({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white/90 text-black hover:bg-blue-500 hover:text-white rounded-full text-[10px] font-bold tracking-wider transition-all shadow-lg whitespace-nowrap"
    >
      {icon} {label}
    </button>
  );
}

function PageContent({ page, onClose }: { page: string, onClose: () => void }) {
  const renderContent = () => {
    switch(page) {
      case 'apps':
        return (
          <div>
             <div className="mb-10 border-b border-white/20 pb-10">
                <h2 className="text-5xl font-bold mb-4">Mirairo Apps</h2>
                <p className="text-gray-400">現場の困りごとを解決する、特化型アプリケーション群。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mirairoApps.map((app, i) => (
                  <a key={i} href={app.href} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group rounded-lg">
                    <div className="flex justify-between mb-4">
                       <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{app.id}</span>
                       <ArrowUpRight size={16} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{app.title}</h3>
                    <p className="text-xs text-gray-500 group-hover:text-black/60 font-mono">{app.en}</p>
                  </a>
                ))}
             </div>
          </div>
        );
      case 'manual':
        return (
          <div className="text-center py-20">
             <BookOpen size={64} className="mx-auto mb-6 text-gray-600" />
             <h2 className="text-4xl font-bold mb-4">Manual</h2>
             <p className="text-gray-400 mb-8">各アプリの詳しい使い方や、活用事例をまとめたマニュアルです。</p>
             <div className="p-6 border border-white/20 rounded-lg inline-block">
                <p className="text-sm text-gray-500">現在、マニュアルページは準備中です。<br/>PDF版の配布をお待ちください。</p>
             </div>
          </div>
        );
      case 'network':
        return (
          <div>
             <div className="mb-10 border-b border-white/20 pb-10">
                <h2 className="text-5xl font-bold mb-4">Network</h2>
                <p className="text-gray-400">ICTを活用した教育を推進するメンバー。</p>
             </div>
             <div className="mb-8 p-8 bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-500">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                   <User size={32} />
                 </div>
                 <div>
                   <span className="text-blue-400 text-xs font-bold tracking-widest">ADMINISTRATOR</span>
                   <h3 className="text-2xl font-bold">KOYAMA</h3>
                   <p className="text-sm text-gray-400">Special Education Teacher / App Developer</p>
                 </div>
               </div>
               <p className="text-gray-300 text-sm leading-relaxed">
                 特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。
               </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {networkData.map((person, i) => (
                 <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-lg flex items-start gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                     <Users size={16} />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg">{person.name}</h4>
                     <p className="text-xs text-blue-400 mb-1">{person.role}</p>
                     <p className="text-xs text-gray-500">{person.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'school':
        return (
          <div>
             <div className="mb-10 border-b border-white/20 pb-10">
                <h2 className="text-5xl font-bold mb-4">Introduction</h2>
                <p className="text-gray-400">Mirairoアプリ導入校・研究協力校。</p>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-xl mb-8">
               <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                 <School className="text-blue-400" />
                 埼玉県立岩槻はるかぜ特別支援学校
               </h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-4">
                 知的障害のある児童生徒が通う特別支援学校。ICTの積極的な活用や、データに基づいた指導の実践研究を行っています。
               </p>
               <div className="flex gap-2">
                 <span className="px-2 py-1 bg-white/10 text-[10px] rounded">小学部</span>
                 <span className="px-2 py-1 bg-white/10 text-[10px] rounded">中学部</span>
                 <span className="px-2 py-1 bg-white/10 text-[10px] rounded">高等部</span>
               </div>
             </div>
             <div className="p-8 border border-dashed border-white/20 rounded-xl text-center">
               <Lightbulb className="mx-auto text-yellow-500 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">Future Curriculum Design</h3>
               <p className="text-sm text-gray-500 mb-4">
                 次年度より開始される「教育課程の未来デザイン」研究プロジェクトの詳細をここに掲載予定です。
               </p>
               <span className="text-xs bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full">Coming Soon</span>
             </div>
          </div>
        );
      case 'tools':
        return (
          <div>
             <div className="mb-10 border-b border-white/20 pb-10">
                <h2 className="text-5xl font-bold mb-4">Analysis Tools</h2>
                <p className="text-gray-400">研究論文・データ分析のための専門ツール集。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/20 border border-white/20">
                {analysisTools.map((tool, i) => (
                  <a key={i} href={tool.href} target="_blank" rel="noopener noreferrer" className="bg-black p-8 hover:bg-white hover:text-black transition-colors group block">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">{tool.jp}</span>
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{tool.en}</span>
                  </a>
                ))}
             </div>
          </div>
        );
      case 'profile':
        return (
          <div className="py-10">
             <h2 className="text-4xl font-bold mb-6">ADMINISTRATOR</h2>
             <div className="flex items-center gap-4 mb-6">
               <User size={48} className="text-blue-500" />
               <div>
                 <h3 className="text-2xl font-bold">KOYAMA</h3>
                 <p className="text-sm text-gray-400">Developer & Teacher</p>
               </div>
             </div>
             <p className="text-gray-300 leading-relaxed">
                埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                プログラミング（Python, React）を活用し、特別支援教育の課題解決に取り組んでいます。
             </p>
          </div>
        );
       case 'system':
         return (
            <div className="py-10">
               <h2 className="text-4xl font-bold mb-6">SYSTEM</h2>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded">Next.js 14</div>
                  <div className="p-4 bg-white/10 rounded">Tailwind CSS</div>
                  <div className="p-4 bg-white/10 rounded">Framer Motion</div>
                  <div className="p-4 bg-white/10 rounded">Vercel</div>
               </div>
            </div>
         );
       case 'feedback':
         return (
            <div className="py-10">
               <h2 className="text-4xl font-bold mb-6">FEEDBACK</h2>
               <p className="mb-6 text-gray-300">ご意見・ご要望はこちらから。</p>
               <a 
                 href="https://docs.google.com/forms/d/1dKzh90OkxMoWDZXV31FgPvXG5EvNlMFOrvSPGvYTSC8/preview" 
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500"
               >
                 <MessageSquare size={18} /> アンケートフォーム
               </a>
            </div>
         );
       case 'about':
         return (
            <div className="py-10">
               <h2 className="text-4xl font-bold mb-6">ABOUT</h2>
               <p className="text-gray-300 leading-relaxed">
                  Mirairo Projectは、特別支援教育に携わるすべての先生方を支援するための非営利プロジェクトです。<br/>
                  本サイト上のツールは自由にご利用いただけますが、研究発表等で利用される際は管理者までご一報ください。
               </p>
            </div>
         );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-6 md:p-20 relative">
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 z-[70] p-2 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <X size={32} />
        </button>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto pt-10"
        >
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}