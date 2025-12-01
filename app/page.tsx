"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, MessageSquare, Video, BookOpen,
  School, Lightbulb, Activity, FileText, CheckCircle,
  Brain, LineChart, Sparkles, Users, ChevronRight, BarChart3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const LOGO_OP_PATH = "/MieeL.png";    // 黒背景用（オープニング）
const LOGO_MAIN_PATH = "/MieeL2.png"; // 白背景用（メイン画面）

// 1. MieeL 各機能 (カードとして表示・ページ遷移)
const mieelApps = [
  { 
    id: "01", 
    title: "指導支援検索", 
    en: "SEARCH SUPPORT", 
    desc: "困りごとに応じた指導・支援を検索",
    icon: <SearchIcon />,
    href: "/page/page1",
    color: "bg-blue-50 text-blue-600"
  },
  { 
    id: "02", 
    title: "発達チャート", 
    en: "DEVELOPMENT CHART", 
    desc: "発達段階を可視化・記録する",
    icon: <BarChart3 />,
    href: "/page/page2",
    color: "bg-green-50 text-green-600"
  },
  { 
    id: "03", 
    title: "AI 指導案作成", 
    en: "LESSON PLAN AI", 
    desc: "基本情報から指導案を自動生成",
    icon: <FileText />,
    href: "/page/page5",
    color: "bg-purple-50 text-purple-600"
  },
  { 
    id: "04", 
    title: "AI 支援計画作成", 
    en: "PLANNING ASSIST", 
    desc: "個別の計画作成プロンプトを生成",
    icon: <Brain />,
    href: "/page/page4",
    color: "bg-orange-50 text-orange-600"
  },
  { 
    id: "05", 
    title: "学習指導要領", 
    en: "GUIDELINES", 
    desc: "知的障害特別支援学校の要領検索",
    icon: <BookOpen />,
    href: "/page/page3",
    color: "bg-pink-50 text-pink-600"
  },
  { 
    id: "06", 
    title: "授業カード", 
    en: "LESSON LIBRARY", 
    desc: "実践事例の共有データベース",
    icon: <Layers />,
    href: "/page/page7",
    color: "bg-indigo-50 text-indigo-600"
  },
  { 
    id: "07", 
    title: "動画ギャラリー", 
    en: "VIDEO GALLERY", 
    desc: "特別支援教育に関する動画集",
    icon: <Video />,
    href: "/page/page6",
    color: "bg-red-50 text-red-600"
  },
  { 
    id: "08", 
    title: "研究・分析", 
    en: "ANALYSIS TOOLS", 
    desc: "統計分析・行動分析ツール集",
    icon: <Activity />,
    href: "/page/page9",
    color: "bg-cyan-50 text-cyan-600"
  },
];

// 2. マニュアルデータ
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

// 3. つながり (Network)
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

  // 初回のみオープニングアニメーション
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("mieel_visited");
    if (hasVisited) {
      setOpPhase(2);
    } else {
      sessionStorage.setItem("mieel_visited", "true");
      const timer1 = setTimeout(() => setOpPhase(1), 2000);
      const timer2 = setTimeout(() => setOpPhase(2), 4500);
      return () => { 
        clearTimeout(timer1); 
        clearTimeout(timer2); 
      };
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* 0. オープニングアニメーション (黒背景) */}
      <AnimatePresence mode="wait">
        {opPhase < 2 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
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

      {/* 背景パララックス (白ベース) */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* 固定ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-500">
        <div className="pointer-events-auto px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
          <h1 className="text-sm font-bold tracking-widest flex items-center gap-3 text-slate-800">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            MieeL <span className="text-gray-400 font-normal">v2.0</span>
          </h1>
        </div>
        <nav className="pointer-events-auto flex gap-3 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
          <HeaderTag icon={<User size={14} />} label="PROFILE" onClick={() => setSelectedPage('profile')} />
          <HeaderTag icon={<Cpu size={14} />} label="SYSTEM" onClick={() => setSelectedPage('system')} />
          <HeaderTag icon={<MessageSquare size={14} />} label="FEEDBACK" onClick={goToFeedback} highlight />
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-48">
        
        {/* 1. メインビジュアル */}
        <section className="px-6 md:px-20 pb-32">
           <motion.div variants={floating} animate="animate" className="mb-12">
             <img 
               src={LOGO_MAIN_PATH} alt="MieeL Logo" className="w-24 h-24 md:w-40 md:h-40 object-contain"
             />
           </motion.div>
           
           <div className="space-y-2 mb-16 text-slate-900">
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="text-6xl md:text-9xl font-black tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="text-6xl md:text-9xl font-black tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} className="text-6xl md:text-9xl font-black tracking-tighter text-gray-300">SUPPORT.</motion.h2></div>
           </div>

           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 0.6 }}
             className="border-l-4 border-blue-600 pl-8 ml-2 max-w-2xl"
           >
             <p className="text-slate-900 text-xl md:text-2xl font-bold mb-4">Data-Driven Education.</p>
             <p className="text-gray-600 text-sm md:text-base leading-loose">
               特別支援教育の現場における「経験」に「データ」をプラス。<br/>
               指導案作成から統計分析までを一元化したプラットフォーム。
             </p>
           </motion.div>
        </section>

        {/* 2. MieeL 各機能 (メイングリッド) */}
        <section className="px-6 md:px-20 mb-40">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-4">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900">MieeL Apps</h3>
             <p className="text-sm font-bold text-gray-400 tracking-widest hidden md:block">APPLICATIONS</p>
          </div>

          <StaggeredMenu>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mieelApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </StaggeredMenu>
        </section>

        {/* 3. コンセプト & 機能紹介 */}
        <section className="px-6 md:px-20 mb-40 bg-white py-20 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <ScrollReveal>
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-16 text-slate-900 text-center">
                Design for <span className="text-blue-600">Future</span> Education.
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <FeatureItem icon={<Brain size={40} />} title="AI Assistant" desc="指導案や支援計画の作成をAIが強力にサポート。事務作業時間を短縮し、子どもと向き合う時間を創出します。" color="bg-purple-100 text-purple-600" />
                 <FeatureItem icon={<LineChart size={40} />} title="Visualization" desc="発達検査の結果や行動記録をチャートで見える化。直感的に状況を把握し、チームでの共有を円滑にします。" color="bg-green-100 text-green-600" />
                 <FeatureItem icon={<Sparkles size={40} />} title="Evidence" desc="専門的な統計分析ツールを内蔵。実践の成果をデータで検証し、より確かな教育実践へとつなげます。" color="bg-orange-100 text-orange-600" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 4. インフォメーション (マニュアル・導入校・つながり) */}
        <section className="px-6 md:px-20 mb-40">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-4">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900">Information</h3>
             <p className="text-sm font-bold text-gray-400 tracking-widest hidden md:block">GUIDE & NETWORK</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <InfoCard title="各機能マニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
             <InfoCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
             <InfoCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
          </div>
        </section>

        {/* 5. フッター */}
        <footer className="bg-slate-900 text-white pt-32 pb-10 px-6 md:px-20 rounded-t-[3rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 max-w-6xl mx-auto">
            <FooterLink title="ADMINISTRATOR" sub="管理者プロフィール" icon={<User size={24}/>} onClick={() => setSelectedPage('profile')} />
            <FooterLink title="FEEDBACK" sub="ご意見・ご要望" icon={<MessageSquare size={24}/>} onClick={goToFeedback} />
            <FooterLink title="SYSTEM" sub="システム構成" icon={<Cpu size={24}/>} onClick={() => setSelectedPage('system')} />
            <FooterLink title="TERMS OF USE" sub="利用規約" icon={<FileText size={24}/>} onClick={() => setSelectedPage('terms')} />
          </div>
          
          <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs tracking-widest">
            <p>&copy; 2025 MieeL Project. All Rights Reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </footer>
      </div>

      {/* --- モーダル (詳細ページ) --- */}
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

// 検索アイコン用コンポーネント
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
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
      initial="hidden" whileInView="visible" viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group p-8 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
      <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 ${color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <h4 className="text-2xl font-bold mb-4 tracking-tight text-slate-900">{title}</h4>
      <p className="text-gray-600 leading-loose text-sm">{desc}</p>
    </div>
  );
}

// アプリカード (メイン機能)
function AppCard({ app }: { app: any }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const isExternal = app.href.startsWith("http");

  const Content = () => (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -10 }}
      className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-100 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden group"
    >
      {/* 背景の装飾 */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${app.color.split(' ')[0]} opacity-20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150`} />

      <div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 ${app.color}`}>
          {app.icon}
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{app.title}</h3>
        <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider">{app.en}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{app.desc}</p>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );

  return isExternal ? (
    <a href={app.href} target="_blank" rel="noopener noreferrer"><Content /></a>
  ) : (
    <Link href={app.href}><Content /></Link>
  );
}

// 情報カード (マニュアル等)
function InfoCard({ title, sub, icon, onClick }: { title: string, sub: string, icon: any, onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-200 p-8 rounded-2xl cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all group flex items-center gap-6"
    >
      <div className="p-4 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">{sub}</p>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
      </div>
    </motion.div>
  );
}

// フッターリンク
function FooterLink({ title, sub, icon, onClick }: { title: string, sub: string, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group flex items-start gap-4 w-full p-4 rounded-xl hover:bg-white/5 transition-all">
      <div className="text-slate-500 group-hover:text-blue-400 mt-1 transition-colors">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-white mb-1 tracking-widest">{title}</h4>
        <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">{sub}</p>
      </div>
    </button>
  );
}

// ヘッダータグ
function HeaderTag({ icon, label, onClick, highlight }: { icon: any, label: string, onClick: () => void, highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all border
        ${highlight 
          ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-700" 
          : "bg-white text-slate-600 border-gray-200 hover:border-gray-400 hover:text-slate-900"}
      `}
    >
      {icon} {label}
    </button>
  );
}

// ==========================================
// ▼ モーダルコンテンツ (詳細表示)
// ==========================================
function PageContent({ page, onClose }: { page: string, onClose: () => void }) {
  const renderContent = () => {
    switch(page) {
      case 'manual':
        return (
          <div>
             <ModalHeader title="各機能マニュアル" sub="アプリの使い方・活用ガイド" />
             <div className="space-y-4">
               {manuals.map((manual, i) => (
                 <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-gray-100">
                   <h3 className="text-xl font-bold mb-2 text-slate-900 flex items-center gap-3">
                     <BookOpen size={20} className="text-blue-600"/> {manual.title}
                   </h3>
                   <p className="text-gray-600 text-sm mb-6 leading-relaxed ml-8">{manual.desc}</p>
                   <div className="ml-8 grid gap-3">
                     {manual.steps.map((step, idx) => (
                       <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                         <CheckCircle size={16} className="shrink-0 mt-1 text-green-500" />
                         <span>{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'network':
        return (
          <div>
             <ModalHeader title="Network" sub="ICTを活用した教育を推進するメンバー" />
             <div className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
               <div className="flex items-center gap-6 mb-4">
                 <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm"><User size={32} /></div>
                 <div>
                   <span className="text-blue-600 text-xs font-bold tracking-widest mb-1 block">ADMINISTRATOR</span>
                   <h3 className="text-2xl font-black text-slate-900">KOYAMA</h3>
                   <p className="text-xs text-gray-500 mt-1 font-bold">Special Education Teacher</p>
                 </div>
               </div>
               <p className="text-slate-700 text-sm leading-loose">
                 特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。
               </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {networkData.map((person, i) => (
                 <div key={i} className="p-6 bg-white border border-gray-200 rounded-2xl">
                     <h4 className="font-bold text-lg mb-1 text-slate-900">{person.name}</h4>
                     <p className="text-xs text-blue-600 font-bold mb-2">{person.role}</p>
                     <p className="text-xs text-gray-500">{person.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'school':
        return (
          <div>
             <ModalHeader title="Introduction" sub="MieeLアプリ導入校・研究協力校" />
             <div className="p-8 bg-white border border-gray-200 rounded-3xl mb-6 shadow-sm">
               <h3 className="text-xl font-bold mb-3 flex items-center gap-3 text-slate-900">
                 <School className="text-blue-600" /> 埼玉県立岩槻はるかぜ特別支援学校
               </h3>
               <p className="text-gray-600 text-sm leading-loose ml-9">
                 知的障害のある児童生徒が通う特別支援学校。ICTの積極活用やデータに基づいた指導を実践。
               </p>
             </div>
             <div className="p-8 bg-yellow-50 border border-yellow-100 rounded-3xl text-center">
               <Lightbulb className="mx-auto text-yellow-500 mb-4" size={32} />
               <h3 className="text-lg font-bold mb-2 text-yellow-900">Future Curriculum Design</h3>
               <p className="text-xs text-yellow-700">次年度より開始される「教育課程の未来デザイン」研究プロジェクト詳細掲載予定。</p>
             </div>
          </div>
        );
      case 'profile':
        return (
          <div className="py-12 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400"><User size={40} /></div>
             <h2 className="text-4xl font-black mb-2 text-slate-900">KOYAMA</h2>
             <p className="text-blue-600 text-xs font-bold tracking-widest mb-8">ADMINISTRATOR</p>
             <p className="text-gray-600 leading-loose max-w-lg mx-auto text-sm">
                埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                プログラミング（Python, React）を活用し、特別支援教育の課題解決に取り組んでいます。
             </p>
          </div>
        );
       case 'system':
         return (
            <div className="py-12 text-center">
               <h2 className="text-3xl font-bold mb-8 text-slate-900">SYSTEM ARCHITECTURE</h2>
               <div className="flex flex-wrap justify-center gap-4">
                 {['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Render'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600">{tag}</span>
                 ))}
               </div>
            </div>
         );
       case 'terms':
         return (
            <div className="py-8">
               <ModalHeader title="TERMS OF USE" sub="利用規約" />
               <div className="prose prose-sm text-gray-600 leading-loose">
                 <p>本サイトは、特別支援教育の発展を目的とした非営利の研究用プラットフォームです。</p>
                 <ul className="list-disc pl-5 space-y-2">
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
      className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }} 
        animate={{ y: 0, opacity: 1, scale: 1 }} 
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-gray-100 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
          <X size={20} />
        </button>
        
        <div className="p-8 md:p-12">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-10 border-b border-gray-100 pb-6">
      <p className="text-blue-600 text-xs font-bold tracking-widest mb-2">{sub}</p>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900">{title}</h2>
    </div>
  );
}