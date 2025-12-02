"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, MessageSquare, Video, BookOpen,
  School, Lightbulb, Activity, FileText, CheckCircle,
  Brain, LineChart, Sparkles, Users, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const LOGO_OP_PATH = "/MieeL.png";    
const LOGO_MAIN_PATH = "/MieeL2.png"; 

// 1. MieeL 各機能
const MieeLApps = [
  { id: "00", title: "TOPページ", en: "HOME", href: "https://aspecial-education-app.onrender.com/" },
  { id: "01", title: "指導支援検索", en: "SEARCH SUPPORT", href: "/page/page1" },
  { id: "02", title: "発達チャート", en: "DEVELOPMENT CHART", href: "/page/page2" },
  { id: "03", title: "AI 指導案作成", en: "LESSON PLAN AI", href: "/page/page5" },
  { id: "04", title: "AI 支援/指導計画作成", en: "PLANNING ASSIST", href: "/page/page4" },
  { id: "05", title: "早引き学習指導要領", en: "GUIDELINES", href: "/page/page3" },
  { id: "06", title: "授業カードライブラリ", en: "LESSON CARD LIBRARY", href: "/page/page7" },
  { id: "07", title: "動画ギャラリー", en: "VIDEO GALLERY", href: "/page/page6" },
  { id: "08", title: "研究・分析", en: "ANALYSIS & TOOLS", href: "/page/page8" },
];

// 2. 分析ツール一覧
const analysisTools = [
  { jp: "応用行動分析", en: "Applied Behavior Analysis", href: "https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" },
  { jp: "機能的行動評価", en: "Functional Behavior Assessment", href: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" },
  { jp: "アンケート統計分析", en: "Survey Statistical Analysis", href: "https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" },
  { jp: "多変量回帰分析", en: "Multivariate Regression", href: "https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/" },
  { jp: "t検定・統計ツール", en: "T-Test & Statistical Tools", href: "https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" },
  { jp: "ノンパラメトリック", en: "Non-Parametric Analysis", href: "https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/" },
];

// 3. マニュアルデータ
const manuals = [
  {
    title: "指導支援内容 マニュアル",
    desc: "お子さんの日常生活の困りごとに応じた、具体的な指導・支援のアイデアを検索することができます。",
    steps: ["カテゴリー→項目→詳細の順に選択", "「指導・支援を表示」をクリック", "詳細内容を確認"]
  },
  {
    title: "発達チャート作成 マニュアル",
    desc: "発達段階を記録し、レーダーチャートで視覚的に確認・保存できます。",
    steps: ["12のカテゴリーで発達段階を選択", "「チャートを作成」をクリック", "スプレッドシートまたはExcelで保存"]
  },
  {
    title: "AI計画作成サポート マニュアル",
    desc: "個別の支援計画や指導計画作成用のプロンプトを簡単に作成します。",
    steps: ["プロンプトの種類を選択", "実態や課題を入力", "生成された文面をコピーしてChatGPTへ"]
  },
  {
    title: "AI指導案作成 マニュアル",
    desc: "基本情報を入力するだけで、AIを活用して学習指導案を自動生成します。",
    steps: ["基本情報を入力", "プロンプトを生成してAIに入力", "AIの回答（JSON）を貼り付けてExcel出力"]
  },
  {
    title: "授業カードライブラリ マニュアル",
    desc: "先生方の実践事例を共有・検索できるデータベースです。",
    steps: ["キーワードやタグで検索", "カードをクリックして詳細を表示", "指導案や教材をダウンロード"]
  }
];

// 4. つながり (Network)
const networkData = [
  { name: "IT Teacher A", role: "High School Info Dept.", desc: "Network Specialist" },
  { name: "IT Teacher B", role: "Special Ed. Coordinator", desc: "iPad Utilization" },
  { name: "Researcher C", role: "University Lab", desc: "Data Analysis Support" },
];

// ==========================================
// ▲ 設定エリア終了
// ==========================================

export default function Home() {
  const [opPhase, setOpPhase] = useState(0); 
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const router = useRouter();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("mieel_visited");
    if (hasVisited) {
      setOpPhase(2);
    } else {
      sessionStorage.setItem("mieel_visited", "true");
      const timer1 = setTimeout(() => setOpPhase(1), 2000);
      const timer2 = setTimeout(() => setOpPhase(2), 4500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, []);

  const floating = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
    },
  };

  const goToFeedback = () => {
    router.push("/fpafe");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* 0. オープニングアニメーション */}
      <AnimatePresence mode="wait">
        {opPhase < 2 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            {opPhase === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                transition={{ duration: 1.5 }}
              >
                <img src={LOGO_OP_PATH} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
              </motion.div>
            )}
            {opPhase === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 1 }}
                className="text-center"
              >
                <p className="text-xl md:text-3xl text-gray-400 mb-8 tracking-[0.3em] font-bold">
                  すぐわかる。すぐ使える。
                </p>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">MieeL</h1>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* 固定ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-8 z-40 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-500">
        <div className="pointer-events-auto px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:border-blue-200 transition-all bg-white">
          <h1 className="text-xs font-bold tracking-widest flex items-center gap-3 text-slate-900">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            MieeL <span className="text-gray-400">v2.0</span>
          </h1>
        </div>
        <nav className="pointer-events-auto flex gap-4 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
          <HeaderTag icon={<User size={12} />} label="PROFILE" onClick={() => setSelectedPage('profile')} color="blue" />
          <HeaderTag icon={<Cpu size={12} />} label="SYSTEM" onClick={() => setSelectedPage('system')} color="purple" />
          <HeaderTag icon={<MessageSquare size={12} />} label="FEEDBACK" onClick={goToFeedback} color="emerald" />
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-60">
        
        {/* 1. メインビジュアル */}
        <section className="px-6 md:px-20 pb-40">
           <motion.div variants={floating} animate="animate" className="mb-12">
             <img 
               src={LOGO_MAIN_PATH} alt="MieeL Logo" className="w-24 h-24 md:w-40 md:h-40 object-contain"
             />
           </motion.div>
           
           <div className="space-y-4 mb-20 text-slate-900">
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="text-7xl md:text-9xl font-black tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="text-7xl md:text-9xl font-black tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} className="text-7xl md:text-9xl font-black tracking-tighter text-gray-300">SUPPORT.</motion.h2></div>
           </div>

           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 0.6 }}
             className="relative pl-8 ml-2 max-w-3xl"
           >
             <div className="absolute inset-0 -left-4 bg-gradient-to-r from-blue-50 to-transparent -z-10 blur-xl rounded-full opacity-50"></div>
             <div className="border-l-4 border-blue-600 pl-6">
               <p className="text-slate-900 text-2xl md:text-4xl font-bold mb-4 leading-tight">
                 Data-Driven Education.
               </p>
               <p className="text-gray-600 font-medium text-lg md:text-xl leading-loose">
                 特別支援教育の現場における<span className="text-blue-600 font-bold">「経験」</span>に<span className="text-blue-600 font-bold">「データ」</span>をプラス。<br/>
                 指導案作成から統計分析までを一元化したプラットフォーム。
               </p>
             </div>
           </motion.div>
        </section>

        {/* 2. コンセプト */}
        <section className="px-6 md:px-20 mb-40">
          <ScrollReveal>
            <div className="border-t border-gray-200 pt-32">
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-5xl text-slate-900">
                MieeLは、特別支援教育の現場における<br className="hidden md:block"/>
                <span className="text-blue-600">「経験」</span>や<span className="text-blue-600">「勘」</span>に、
                データという新たな<span className="text-blue-600">「根拠」</span>をプラスします。
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
                 <FeatureItem icon={<Brain size={48} />} title="AI Assistant" desc="指導案や支援計画の作成をAIが強力にサポート。事務作業時間を短縮し、子どもと向き合う時間を創出します。" color="bg-purple-50 text-purple-600" />
                 <FeatureItem icon={<LineChart size={48} />} title="Visualization" desc="発達検査の結果や行動記録をチャートで見える化。直感的に状況を把握し、チームでの共有を円滑にします。" color="bg-green-50 text-green-600" />
                 <FeatureItem icon={<Sparkles size={48} />} title="Evidence" desc="専門的な統計分析ツールを内蔵。実践の成果をデータで検証し、より確かな教育実践へとつなげます。" color="bg-orange-50 text-orange-600" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 3. メインメニュー */}
        <section className="px-6 md:px-20 mb-40">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-4">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900">MieeL 各機能</h3>
             <p className="text-sm font-bold text-gray-400 tracking-widest hidden md:block">APPLICATIONS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <StaggeredMenu>
                {/* クリックでモーダルを開く */}
                <MenuCard title="MieeL 各機能" sub="APPLICATIONS" icon={<Layers />} onClick={() => setSelectedPage('apps')} big />
                <MenuCard title="各機能マニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
                <MenuCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
                <MenuCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
                <MenuCard title="分析ツール" sub="FOR RESEARCHERS" icon={<Activity />} onClick={() => setSelectedPage('tools')} />
             </StaggeredMenu>
          </div>
        </section>

        {/* 4. フッター (★修正: ボタン背景を黒に) */}
        <footer className="bg-white border-t border-gray-200 pt-32 pb-20 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 max-w-7xl mx-auto">
            <StylishFooterBtn title="ADMINISTRATOR" sub="管理者プロフィール" icon={<User size={24}/>} onClick={() => setSelectedPage('profile')} color="blue" />
            <StylishFooterBtn title="FEEDBACK" sub="ご意見・ご要望" icon={<MessageSquare size={24}/>} onClick={goToFeedback} color="emerald" />
            <StylishFooterBtn title="SYSTEM" sub="システム構成" icon={<Cpu size={24}/>} onClick={() => setSelectedPage('system')} color="purple" />
            <StylishFooterBtn title="TERMS OF USE" sub="利用規約" icon={<FileText size={24}/>} onClick={() => setSelectedPage('terms')} color="gray" />
          </div>
          <div className="text-center text-gray-400 text-xs tracking-widest">
            &copy; 2025 MieeL Project. All Rights Reserved.
          </div>
        </footer>
      </div>

      {/* --- モーダル --- */}
      <AnimatePresence>
        {selectedPage && (
          <PageContent page={selectedPage} onClose={() => setSelectedPage(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// ▼ 部品コンポーネント
// ==========================================

function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggeredMenu({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group p-8 rounded-3xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-300">
      <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 ${color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <h4 className="text-2xl font-bold mb-4 tracking-tight text-slate-900">{title}</h4>
      <p className="text-gray-600 leading-loose text-sm">{desc}</p>
    </div>
  );
}

// メニューカード
function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
      onClick={onClick}
      whileHover={{ backgroundColor: "#1a1a1a", color: "#ffffff", scale: 1.02 }}
      className={`
        bg-white border border-gray-200 p-10 md:p-12 rounded-3xl cursor-pointer group relative overflow-hidden flex flex-col justify-between h-full
        hover:shadow-2xl hover:border-gray-800 transition-colors duration-300
      `}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="text-gray-400 group-hover:text-white transition-colors duration-300">{icon}</div>
        <ArrowUpRight className="text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 group-hover:text-white/60 mb-3 tracking-widest">{sub}</p>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-white">{title}</h3>
      </div>
    </motion.div>
  );
}

// ★修正: おしゃれな黒背景フッターボタン
function StylishFooterBtn({ title, sub, icon, onClick, color }: { title: string, sub: string, icon: any, onClick: () => void, color: string }) {
  const colors: any = {
    blue: "hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]",
    emerald: "hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]",
    purple: "hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]",
    gray: "hover:border-gray-400 hover:shadow-[0_0_25px_rgba(100,116,139,0.5)]",
  };

  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex flex-col items-start justify-center p-8 w-full text-left 
        bg-black border border-gray-800 rounded-2xl transition-all duration-300 group shadow-lg
        ${colors[color]}
      `}
    >
      <div className="mb-4 text-gray-400 group-hover:text-white transition-colors">{icon}</div>
      <h4 className="text-lg font-bold tracking-widest mb-1 text-white">{title}</h4>
      <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">{sub}</p>
    </motion.button>
  );
}

function HeaderTag({ icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: "blue" | "purple" | "emerald" }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-5 py-2.5 bg-gray-50 text-gray-600 hover:bg-white hover:text-black rounded-full text-[10px] font-bold tracking-widest 
        transition-all duration-300 backdrop-blur-md border border-transparent hover:border-gray-200 hover:shadow-md
      `}
    >
      {icon} {label}
    </button>
  );
}

// ==========================================
// ▼ モーダルコンテンツ
// ==========================================
function PageContent({ page, onClose }: { page: string, onClose: () => void }) {
  
  const renderContent = () => {
    switch(page) {
      case 'apps':
        return (
          <div>
             <ModalHeader title="MieeL 各機能" sub="現場の困りごとを解決するアプリケーション" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MieeLApps.map((app, i) => (
                  app.href.startsWith("http") ? (
                    <a key={i} href={app.href} target="_blank" rel="noopener noreferrer" 
                       className="block p-8 bg-white/5 border border-gray-200 hover:bg-black hover:text-white transition-all duration-500 group rounded-2xl"
                    >
                      <div className="flex justify-between mb-6">
                         <span className="font-mono text-xs text-gray-500 group-hover:text-white/60 tracking-widest">{app.id}</span>
                         <ArrowUpRight size={18} className="text-gray-400 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-white">{app.title}</h3>
                      <p className="text-xs text-gray-600 group-hover:text-white/80 font-mono tracking-wide">{app.en}</p>
                    </a>
                  ) : (
                    <Link key={i} href={app.href} 
                       className="block p-8 bg-white/5 border border-gray-200 hover:bg-black hover:text-white transition-all duration-500 group rounded-2xl"
                    >
                      <div className="flex justify-between mb-6">
                         <span className="font-mono text-xs text-gray-500 group-hover:text-white/60 tracking-widest">{app.id}</span>
                         <ArrowUpRight size={18} className="text-gray-400 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-white">{app.title}</h3>
                      <p className="text-xs text-gray-600 group-hover:text-white/80 font-mono tracking-wide">{app.en}</p>
                    </Link>
                  )
                ))}
             </div>
          </div>
        );

      case 'manual':
        return (
          <div>
             <ModalHeader title="各機能マニュアル" sub="アプリの使い方・活用ガイド" />
             <div className="space-y-6">
               {manuals.map((manual, i) => (
                 <AccordionItem key={i} title={manual.title} icon={<BookOpen size={20} />}>
                   <p className="text-gray-600 mb-6 text-sm leading-loose border-l-2 border-blue-500 pl-4">{manual.desc}</p>
                   <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                     <h4 className="text-xs font-bold text-blue-600 mb-4 tracking-widest">HOW TO USE</h4>
                     <ul className="space-y-3">
                       {manual.steps.map((step, idx) => (
                         <li key={idx} className="flex gap-4 text-sm text-slate-700 items-start leading-relaxed">
                           <CheckCircle size={18} className="shrink-0 mt-0.5 text-blue-500" />
                           {step}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </AccordionItem>
               ))}
             </div>
          </div>
        );

      case 'network':
        return (
          <div>
             <ModalHeader title="Network" sub="ICTを活用した教育を推進するメンバー" />
             <div className="mb-10 p-10 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl">
               <div className="flex items-center gap-6 mb-6">
                 <div className="w-20 h-20 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-md"><User size={40} /></div>
                 <div>
                   <span className="text-blue-600 text-xs font-bold tracking-widest mb-2 block">ADMINISTRATOR</span>
                   <h3 className="text-3xl font-black text-slate-900">KOYAMA</h3>
                   <p className="text-sm text-gray-600 mt-1 font-bold">Special Education Teacher</p>
                 </div>
               </div>
               <p className="text-slate-700 text-sm leading-loose">特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {networkData.map((person, i) => (
                 <div key={i} className="p-8 bg-white border border-gray-200 rounded-3xl hover:border-blue-400 transition-colors duration-300 shadow-sm">
                     <h4 className="font-bold text-xl mb-2 text-slate-900">{person.name}</h4>
                     <p className="text-xs text-blue-600 mb-2 tracking-wide font-bold">{person.role}</p>
                     <p className="text-xs text-gray-600 leading-relaxed">{person.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        );

      case 'school':
        return (
          <div>
             <ModalHeader title="Introduction" sub="MieeLアプリ導入校・研究協力校" />
             <div className="p-10 bg-white border border-gray-200 rounded-3xl mb-10 shadow-sm">
               <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-slate-900"><School className="text-blue-600" size={32} /> 埼玉県立岩槻はるかぜ特別支援学校</h3>
               <p className="text-gray-600 text-sm leading-loose ml-10">知的障害のある児童生徒が通う特別支援学校。ICTの積極活用やデータに基づいた指導を実践。</p>
             </div>
             <div className="p-12 border-2 border-dashed border-yellow-200 bg-yellow-50 rounded-3xl text-center">
               <Lightbulb className="mx-auto text-yellow-500 mb-6" size={40} />
               <h3 className="text-xl font-bold mb-3 text-slate-900">Future Curriculum Design</h3>
               <p className="text-sm text-gray-600">次年度より開始される「教育課程の未来デザイン」研究プロジェクト詳細掲載予定。</p>
             </div>
          </div>
        );

      // ★修正: 分析ツールの一覧を復活
      case 'tools':
        return (
          <div>
             <ModalHeader title="Analysis Tools" sub="研究論文・データ分析のための専門ツール" />
             
             <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center mb-10">
                <p className="text-gray-500 mb-6 font-bold">解説付きのメインページはこちら</p>
                <Link href="/page/page9" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg">
                   分析方法ページへ移動 ➡
                </Link>
             </div>

             <h4 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2"><ExternalLink size={20}/> ツール直接リンク</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisTools.map((tool, i) => (
                  <a key={i} href={tool.href} target="_blank" rel="noopener noreferrer" className="bg-white p-6 border border-gray-200 rounded-xl hover:bg-black hover:text-white transition-colors duration-300 group block shadow-sm">
                    <div className="flex justify-between items-start">
                       <div>
                          <span className="font-bold text-lg block mb-1 group-hover:text-white text-slate-900">{tool.jp}</span>
                          <span className="font-mono text-xs text-gray-400 group-hover:text-white/60 tracking-wider">{tool.en}</span>
                       </div>
                       <ArrowUpRight size={16} className="text-gray-300 group-hover:text-white" />
                    </div>
                  </a>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div className="py-20 text-center">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-500"><User size={48} className="text-blue-600" /></div>
             <h2 className="text-5xl font-black mb-4 text-slate-900">KOYAMA</h2>
             <p className="text-blue-600 text-xs font-bold tracking-widest mb-12">ADMINISTRATOR</p>
             <p className="text-gray-600 leading-loose max-w-xl mx-auto">
                埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                プログラミング（Python, React）を活用し、特別支援教育の課題解決に取り組んでいます。
             </p>
          </div>
        );
       case 'system':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-black mb-12 text-slate-900">SYSTEM ARCHITECTURE</h2>
               <div className="flex flex-wrap justify-center gap-6">
                 {['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Render'].map(tag => (
                   <span key={tag} className="px-6 py-3 border border-gray-200 rounded-full text-sm font-bold text-gray-600 bg-white shadow-sm">{tag}</span>
                 ))}
               </div>
            </div>
         );
       case 'terms':
         return (
            <div className="py-10">
               <ModalHeader title="TERMS OF USE" sub="利用規約" />
               <div className="prose prose-slate max-w-none text-gray-600 leading-loose">
                 <p>本サイトは、特別支援教育の発展を目的とした非営利の研究用プラットフォームです。</p>
                 <ul className="list-disc pl-5 space-y-4">
                   <li>本サイト上のツールは、どなたでも自由にご利用いただけます。</li>
                   <li>個人情報（児童生徒の氏名など）を直接入力する際は、各自治体のガイドラインに従ってください。</li>
                   <li>本サイトを利用して得られた結果（指導案や分析結果）の利用責任は利用者に帰属します。</li>
                   <li>研究発表等で本サイトのツールを利用される場合は、管理者までご一報いただけますと幸いです。</li>
                 </ul>
               </div>
            </div>
         );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-10 p-3 bg-gray-100 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
          <X size={24} />
        </button>
        
        <div className="p-12 md:p-20">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

// アコーディオンコンポーネント
function AccordionItem({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 text-lg font-bold text-slate-800">
          <span className="text-blue-600">{icon}</span>
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-8 bg-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-12 border-b border-gray-100 pb-8">
      <p className="text-blue-500 text-xs font-bold tracking-widest mb-2">{sub}</p>
      <h2 className="text-4xl md:text-5xl font-black text-slate-900">{title}</h2>
    </div>
  );
}