"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, MessageSquare, Video, BookOpen,
  School, Lightbulb, Activity, FileText, CheckCircle,
  Brain, LineChart, Sparkles, Users
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
      setOpPhase(2); // 訪問済みなら即メイン画面
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

  // ゆらゆらアニメーション
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
      
      {/* 0. オープニングアニメーション (黒背景) */}
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
      <header className="fixed w-full top-0 left-0 p-8 z-40 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none transition-all duration-500">
        <div className="pointer-events-auto bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200 shadow-sm hover:border-gray-400 transition-all">
          <h1 className="text-xs font-bold tracking-widest flex items-center gap-3 text-black">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            MieeL <span className="text-gray-500">v2.0</span>
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
        
        {/* 1. メインビジュアル + コンセプト (統合) */}
        <section className="px-6 md:px-20 pb-32">
           <motion.div variants={floating} animate="animate" className="mb-12">
             <img 
               src={LOGO_MAIN_PATH} alt="MieeL Logo" className="w-24 h-24 md:w-40 md:h-40 object-contain"
             />
           </motion.div>
           
           {/* タイトル */}
           <div className="space-y-4 mb-16 text-black">
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="text-6xl md:text-9xl font-black tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="text-6xl md:text-9xl font-black tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} className="text-6xl md:text-9xl font-black tracking-tighter text-gray-400">SUPPORT.</motion.h2></div>
           </div>

           {/* 説明文 */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, delay: 0.6 }}
             className="border-l-4 border-blue-600 pl-8 ml-2 mb-24 max-w-3xl"
           >
             <p className="text-slate-900 text-xl md:text-3xl font-bold mb-6 leading-tight">
               Data-Driven Education.<br/>
               特別支援教育の現場における「経験」に「データ」をプラス。<br/>
               指導案作成から統計分析までを一元化したプラットフォーム。
             </p>
           </motion.div>

           {/* ★追加・移動: デザインされた機能紹介セクション (ここへ移動) */}
           <ScrollReveal>
             <div className="pt-10 border-t border-gray-200">
               <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 flex items-center gap-4">
                 Design for <span className="text-blue-600">Future</span> Education.
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <FeatureItem icon={<Brain size={36} />} title="AI Assistant" desc="指導案や支援計画の作成をAIが強力にサポート。事務作業時間を短縮し、子どもと向き合う時間を創出します。" color="bg-purple-50 text-purple-600" />
                  <FeatureItem icon={<LineChart size={36} />} title="Visualization" desc="発達検査の結果や行動記録をチャートで見える化。直感的に状況を把握し、チームでの共有を円滑にします。" color="bg-green-50 text-green-600" />
                  <FeatureItem icon={<Sparkles size={36} />} title="Evidence" desc="専門的な統計分析ツールを内蔵。実践の成果をデータで検証し、より確かな教育実践へとつなげます。" color="bg-orange-50 text-orange-600" />
               </div>
             </div>
           </ScrollReveal>
        </section>

        {/* 2. MieeL 各機能 (リスト) */}
        <section className="px-6 md:px-20 mb-40">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-4">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900">MieeL 各機能</h3>
             <p className="text-sm font-bold text-gray-400 tracking-widest hidden md:block">APPLICATIONS</p>
          </div>

          <StaggeredMenu>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mieelApps.map((app, i) => (
                <MenuCard key={i} title={app.title} sub={app.en} icon={<Layers />} href={app.href} />
              ))}
            </div>
          </StaggeredMenu>
        </section>

        {/* 3. インフォメーション */}
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

        {/* 4. フッター */}
        <footer className="bg-gray-50 border-t border-gray-200 pt-32 pb-20 px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32 max-w-6xl mx-auto">
            <FooterLink title="ADMINISTRATOR" icon={<User size={20}/>} onClick={() => setSelectedPage('profile')} />
            <FooterLink title="FEEDBACK" icon={<MessageSquare size={20}/>} onClick={goToFeedback} />
            <FooterLink title="SYSTEM" icon={<Cpu size={20}/>} onClick={() => setSelectedPage('system')} />
            <FooterLink title="TERMS OF USE" icon={<FileText size={20}/>} onClick={() => setSelectedPage('terms')} />
          </div>
          <div className="text-center text-gray-500 text-xs tracking-widest">
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
      initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }}
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
      initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-50px" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  );
}

// コンセプトエリアのアイテム
function FeatureItem({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group p-8 rounded-3xl border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300">
      <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-6 ${color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <h4 className="text-2xl font-bold mb-4 tracking-tight text-slate-900">{title}</h4>
      <p className="text-gray-600 leading-loose text-sm">{desc}</p>
    </div>
  );
}

// アプリ用カード (リンク対応)
function MenuCard({ title, sub, icon, href }: { title: string, sub: string, icon: any, href: string }) {
  const cardContent = (
    <div className="bg-white border border-gray-200 p-10 md:p-12 rounded-3xl hover:shadow-2xl hover:border-black hover:bg-slate-900 hover:text-white transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
      <div className="flex justify-between items-start mb-8">
        <div className="text-gray-400 group-hover:text-white transition-colors duration-300">{icon}</div>
        <ArrowUpRight className="text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 group-hover:text-white/60 mb-3 tracking-widest">{sub}</p>
        <h3 className="text-2xl md:text-3xl font-black group-hover:text-white">{title}</h3>
      </div>
    </div>
  );

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
      {href.startsWith("http") ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{cardContent}</a>
      ) : (
        <Link href={href} className="block h-full">{cardContent}</Link>
      )}
    </motion.div>
  );
}

// 情報用カード (モーダル用)
function InfoCard({ title, sub, icon, onClick }: { title: string, sub: string, icon: any, onClick: () => void }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false }}
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-200 p-10 rounded-3xl cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all group"
    >
      <div className="text-gray-400 group-hover:text-blue-600 mb-6 transition-colors">{icon}</div>
      <p className="text-xs font-bold text-gray-400 mb-2 tracking-widest">{sub}</p>
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{title}</h3>
    </motion.div>
  );
}

// フッターリンクコンポーネント (定義漏れ修正済み)
function FooterLink({ title, icon, onClick }: { title: string, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group w-full p-4 rounded-xl hover:bg-gray-100 transition-all flex items-center gap-4">
      <div className="text-gray-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      <h4 className="text-sm font-bold text-gray-500 group-hover:text-black tracking-widest transition-colors">{title}</h4>
    </button>
  );
}

function HeaderTag({ icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: "blue" | "purple" | "emerald" }) {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100 hover:border-blue-500",
    purple: "bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100 hover:border-purple-500",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-500",
  };
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest 
        transition-all duration-300 backdrop-blur-md border shadow-sm
        ${styles[color]}
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
      case 'manual':
        return (
          <div>
             <ModalHeader title="各機能マニュアル" sub="アプリの使い方・活用ガイド" />
             <div className="grid grid-cols-1 gap-12">
               {manuals.map((manual, i) => (
                 // モーダル内は即時表示 (アニメーション単純化)
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-10 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-lg transition-all duration-300"
                 >
                   <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-slate-900">
                     <BookOpen size={28} className="text-blue-600"/> {manual.title}
                   </h3>
                   <p className="text-gray-600 mb-8 text-sm leading-loose">{manual.desc}</p>
                   <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                     <h4 className="text-xs font-bold text-blue-600 mb-4 tracking-widest">HOW TO USE</h4>
                     <ul className="space-y-4">
                       {manual.steps.map((step, idx) => (
                         <li key={idx} className="flex gap-4 text-sm text-slate-700 items-start leading-relaxed">
                           <CheckCircle size={18} className="shrink-0 mt-0.5 text-green-500" />
                           {step}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
        );
      case 'network':
        return (
          <div>
             <ModalHeader title="Network" sub="ICTを活用した教育を推進するメンバー" />
             <div className="mb-10 p-10 bg-blue-50 border-l-4 border-blue-600 rounded-r-3xl">
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
             <div className="p-10 bg-slate-50 border border-slate-200 rounded-3xl mb-10">
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
      case 'profile':
        return (
          <div className="py-20 text-center">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-400"><User size={48} /></div>
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

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-12 border-b border-gray-100 pb-8">
      <p className="text-blue-600 text-xs font-bold tracking-widest mb-2">{sub}</p>
      <h2 className="text-4xl md:text-5xl font-black text-slate-900">{title}</h2>
    </div>
  );
}