"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
// アイコン
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

const LOGO_OP_PATH = "/MieeL.png";    // 黒背景用（オープニング）
const LOGO_MAIN_PATH = "/MieeL2.png"; // 白背景用（メイン画面）

// 1. MieeL 各機能 (内部リンク)
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

  useEffect(() => {
    const timer1 = setTimeout(() => setOpPhase(1), 2000);
    const timer2 = setTimeout(() => setOpPhase(2), 4500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // ロゴのゆらゆらアニメーション
  const floating = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4, ease: "easeInOut", repeat: Infinity },
    },
  };

  // フィードバックページへの遷移
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
                <p className="text-sm md:text-lg text-gray-500 mb-6 tracking-[0.2em] font-light">すぐわかる。すぐ使える。</p>
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
          {/* フィードバックボタン修正済み */}
          <HeaderTag icon={<MessageSquare size={12} />} label="FEEDBACK" onClick={goToFeedback} color="emerald" />
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-60">
        
        {/* 1. メインビジュアル */}
        <section className="px-6 md:px-20 pb-40">
           <motion.div variants={floating} animate="animate" className="mb-12">
             <img 
               src={LOGO_MAIN_PATH} alt="MieeL Logo" className="w-20 h-20 md:w-32 md:h-32 object-contain"
             />
           </motion.div>
           
           <div className="space-y-4 mb-20 text-black">
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.0 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.1 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.2 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter text-gray-400">SUPPORT.</motion.h2></div>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 5.5 }}
             className="border-l-2 border-black/10 pl-8 ml-2 max-w-2xl"
           >
             <p className="text-slate-900 text-xl md:text-2xl tracking-wide font-light mb-6">Data-Driven Education.</p>
             <p className="text-gray-700 text-sm md:text-base leading-loose">
               指導案作成から統計分析までを一元化したプラットフォーム。
             </p>
           </motion.div>
        </section>

        {/* 2. コンセプト */}
        <section className="px-6 md:px-20 mb-40">
          <ScrollReveal>
            <div className="border-t border-gray-200 pt-32">
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-5xl text-black">
                MieeLは、特別支援教育の現場における<br className="hidden md:block"/>
                <span className="text-blue-600">「経験」</span>や<span className="text-blue-600">「勘」</span>に、
                データという新たな<span className="text-blue-600">「根拠」</span>をプラスします。
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
                 <FeatureItem icon={<Brain size={48} />} title="AI Assistant" desc="指導案や支援計画の作成をAIがサポート。事務作業時間を大幅に短縮し、子どもと向き合う時間を創出します。" />
                 <FeatureItem icon={<LineChart size={48} />} title="Visualization" desc="発達検査の結果や行動記録をチャートで見える化。直感的に状況を把握し、チームでの共有を円滑にします。" />
                 <FeatureItem icon={<Sparkles size={48} />} title="Evidence" desc="専門的な統計分析ツールを内蔵。実践の成果をデータで検証し、より確かな教育実践へとつなげます。" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 3. メインメニュー */}
        <section className="px-6 md:px-20 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <StaggeredMenu>
                <MenuCard title="MieeL 各機能" sub="APPLICATIONS" icon={<Layers />} onClick={() => setSelectedPage('apps')} big />
                <MenuCard title="各機能マニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
                <MenuCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
                <MenuCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
                <MenuCard title="分析ツール" sub="FOR RESEARCHERS" icon={<Activity />} onClick={() => setSelectedPage('tools')} />
             </StaggeredMenu>
          </div>
        </section>

        {/* 4. フッター */}
        <footer className="bg-gray-50 border-t border-gray-200 pt-32 pb-20 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32 max-w-5xl mx-auto">
            <LargeFooterBtn 
              title="ADMINISTRATOR" sub="管理者プロフィール" icon={<User size={32}/>} 
              onClick={() => setSelectedPage('profile')} color="blue" delay={0.1}
            />
            {/* フィードバックボタン修正済み */}
            <LargeFooterBtn 
              title="FEEDBACK" sub="ご意見・ご要望" icon={<MessageSquare size={32}/>} 
              onClick={goToFeedback} color="emerald" delay={0.2}
            />
            <LargeFooterBtn 
              title="SYSTEM" sub="システム構成" icon={<Cpu size={32}/>} 
              onClick={() => setSelectedPage('system')} color="purple" delay={0.3}
            />
            <LargeFooterBtn 
              title="TERMS OF USE" sub="利用規約" icon={<FileText size={32}/>} 
              onClick={() => setSelectedPage('terms')} color="slate" delay={0.4}
            />
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
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
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

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="text-blue-600 mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{icon}</div>
      <h4 className="text-2xl font-bold mb-6 tracking-wide text-black">{title}</h4>
      <p className="text-gray-700 leading-loose">{desc}</p>
    </div>
  );
}

// ★修正ポイント: カードが黒くなる演出を復活
function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
      onClick={onClick}
      // ▼ マウスホバー時に背景を黒(#000)、文字を白(#fff)にする設定
      whileHover={{ backgroundColor: "#000000", color: "#ffffff", scale: 1.02 }}
      className={`
        bg-gray-100 border border-gray-200 p-10 md:p-14 
        cursor-pointer group relative overflow-hidden flex flex-col justify-between
        ${big ? 'md:col-span-2' : ''} h-[280px] md:h-[350px] rounded-3xl
        hover:shadow-2xl hover:border-black transition-colors duration-300
      `}
    >
      <div className="flex justify-between items-start">
        <div className="text-gray-400 group-hover:text-white transition-colors duration-300">{icon}</div>
        <ArrowUpRight className="text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 group-hover:text-white/80 mb-3 tracking-[0.2em]">{sub}</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 group-hover:text-white">{title}</h3>
      </div>
    </motion.div>
  );
}

// ★修正ポイント: フッターボタンもヌルっと動くように
function LargeFooterBtn({ title, sub, icon, onClick, color, delay = 0 }: { title: string, sub: string, icon: any, onClick: () => void, color: "blue" | "emerald" | "purple" | "slate", delay?: number }) {
  const styles = {
    blue: "bg-blue-50 border-blue-200 hover:border-blue-500 text-blue-900",
    emerald: "bg-emerald-50 border-emerald-200 hover:border-emerald-500 text-emerald-900",
    purple: "bg-purple-50 border-purple-200 hover:border-purple-500 text-purple-900",
    slate: "bg-slate-100 border-slate-200 hover:border-slate-500 text-slate-900",
  };

  const iconColors = {
    blue: "text-blue-500 group-hover:text-blue-700",
    emerald: "text-emerald-500 group-hover:text-emerald-700",
    purple: "text-purple-500 group-hover:text-purple-700",
    slate: "text-slate-500 group-hover:text-slate-700",
  };

  return (
    <motion.button 
      onClick={onClick}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, backgroundColor: "#ffffff" }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-6 p-8 w-full text-left 
        border rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-xl
        ${styles[color]} 
      `}
    >
      <div className={`transition-colors duration-300 ${iconColors[color]}`}>{icon}</div>
      <div>
        <h4 className="text-xl font-bold tracking-widest mb-1 transition-colors">{title}</h4>
        <p className="text-xs opacity-70 group-hover:opacity-100 transition-opacity font-light">{sub}</p>
      </div>
    </motion.button>
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
// ▼ モーダルコンテンツ (各リストアイテムにもホバーエフェクト追加)
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
                  // 外部・内部リンクの分岐
                  app.href.startsWith("http") ? (
                    <a key={i} href={app.href} target="_blank" rel="noopener noreferrer" 
                       className="block p-8 bg-gray-50 border border-gray-200 hover:bg-black hover:text-white transition-all duration-500 group rounded-2xl hover:shadow-xl"
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
                       className="block p-8 bg-gray-50 border border-gray-200 hover:bg-black hover:text-white transition-all duration-500 group rounded-2xl hover:shadow-xl"
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
             <div className="grid grid-cols-1 gap-12">
               {manuals.map((manual, i) => (
                 <ScrollReveal key={i}>
                   <div className="p-10 bg-gray-50 border border-gray-200 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-500 group">
                     <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-slate-900">
                       <BookOpen size={28} className="text-blue-600"/> {manual.title}
                     </h3>
                     <p className="text-gray-700 mb-8 text-sm leading-loose">{manual.desc}</p>
                     
                     <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                       <h4 className="text-xs font-bold text-blue-600 mb-4 tracking-widest">HOW TO USE</h4>
                       <ul className="space-y-4">
                         {manual.steps.map((step, idx) => (
                           <li key={idx} className="flex gap-4 text-sm text-gray-700 items-start leading-relaxed">
                             <CheckCircle size={18} className="shrink-0 mt-0.5 text-green-500" />
                             {step}
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </ScrollReveal>
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
                 <div className="w-20 h-20 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"><User size={40} /></div>
                 <div>
                   <span className="text-blue-600 text-xs font-bold tracking-[0.2em] mb-2 block">ADMINISTRATOR</span>
                   <h3 className="text-3xl font-bold text-slate-900">KOYAMA</h3>
                   <p className="text-sm text-gray-600 mt-1">Special Education Teacher</p>
                 </div>
               </div>
               <p className="text-slate-800 text-sm leading-loose">特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {networkData.map((person, i) => (
                 <div key={i} className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-black transition-colors duration-500 group shadow-sm">
                     <h4 className="font-bold text-xl mb-2 text-slate-900">{person.name}</h4>
                     <p className="text-xs text-blue-600 mb-2 tracking-wide">{person.role}</p>
                     <p className="text-xs text-gray-600">{person.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'school':
        return (
          <div>
             <ModalHeader title="Introduction" sub="MieeLアプリ導入校・研究協力校" />
             <div className="p-10 bg-gray-50 border border-gray-200 rounded-3xl mb-10 hover:bg-white hover:shadow-xl transition-colors duration-500 group">
               <h3 className="text-2xl font-bold mb-4 flex items-center gap-4 text-slate-900"><School className="text-blue-600" size={32} /> 埼玉県立岩槻はるかぜ特別支援学校</h3>
               <p className="text-gray-700 text-sm leading-loose">知的障害のある児童生徒が通う特別支援学校。ICTの積極活用やデータに基づいた指導を実践。</p>
             </div>
             <div className="p-12 border border-dashed border-gray-300 rounded-3xl text-center hover:border-gray-400 transition-colors">
               <Lightbulb className="mx-auto text-yellow-500 mb-6" size={40} />
               <h3 className="text-2xl font-bold mb-4 text-slate-900">Future Curriculum Design</h3>
               <p className="text-sm text-gray-600">次年度より開始される「教育課程の未来デザイン」研究プロジェクト詳細掲載予定。</p>
             </div>
          </div>
        );
      case 'tools':
        return (
          <div>
             <ModalHeader title="Analysis Tools" sub="研究論文・データ分析のための専門ツール" />
             <div className="p-12 bg-gray-50 border border-gray-200 rounded-3xl text-center">
                <p className="text-gray-600 mb-8 text-lg">分析ツールの詳細と使い方は、専用ページに移動しました。</p>
                <Link href="/page/page9" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg">
                   分析方法ページへ移動 ➡
                </Link>
             </div>
          </div>
        );
      case 'profile':
        return (
          <div className="py-20 text-center">
             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-600"><User size={48} className="text-blue-600" /></div>
             <h2 className="text-5xl font-bold mb-4 text-slate-900">KOYAMA</h2>
             <p className="text-blue-600 text-sm tracking-[0.2em] mb-12">ADMINISTRATOR</p>
             <p className="text-gray-600 leading-loose max-w-xl mx-auto">
                埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                プログラミング（Python, React）を活用し、特別支援教育の課題解決に取り組んでいます。
             </p>
          </div>
        );
       case 'system':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-bold mb-12 text-slate-900">SYSTEM ARCHITECTURE</h2>
               <div className="flex flex-wrap justify-center gap-6">
                 {['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Render'].map(tag => (
                   <span key={tag} className="px-6 py-3 border border-gray-300 rounded-full text-sm font-mono text-gray-600">{tag}</span>
                 ))}
               </div>
            </div>
         );
       case 'terms':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-bold mb-8 text-slate-900">TERMS OF USE</h2>
               <div className="max-w-2xl mx-auto text-left space-y-8 text-gray-600 text-sm leading-loose">
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
      className="fixed inset-0 z-[150] bg-white/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-6 md:p-20 relative">
        <button onClick={onClose} className="fixed top-6 right-6 z-[160] p-3 bg-gray-100 text-slate-900 rounded-full hover:bg-black hover:text-white transition-colors"><X size={32} /></button>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto pt-20 pb-20">
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-16 border-b border-gray-200 pb-10">
      <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-slate-900">{title}</h2>
      <p className="text-gray-500 text-lg font-light tracking-wide">{sub}</p>
    </div>
  );
}