"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, MessageSquare, Info, Video, BookOpen,
  School, Lightbulb, Activity, FileText, CheckCircle,
  Brain, LineChart, Sparkles, Database
} from "lucide-react";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const LOGO_PATH = "/mirairo.png"; 

// 1. Mirairoアプリ一覧
const mirairoApps = [
  { id: "00", title: "TOPページ", en: "HOME", href: "https://aspecial-education-app.onrender.com/" },
  { id: "01", title: "指導支援検索", en: "SEARCH SUPPORT", href: "https://aspecial-education-app.onrender.com/%E6%8C%87%E5%B0%8E%E6%94%AF%E6%8F%B4%E5%86%85%E5%AE%B9" },
  { id: "02", title: "発達チャート", en: "DEVELOPMENT CHART", href: "https://aspecial-education-app.onrender.com/%E7%99%BA%E9%81%94%E3%83%81%E3%83%A3%E3%83%BC%E3%83%88" },
  { id: "03", title: "AI 指導案作成", en: "LESSON PLAN AI", href: "https://aspecial-education-app.onrender.com/AI%E3%81%AB%E3%82%88%E3%82%8B%E6%8C%87%E5%B0%8E%E6%A1%88%E4%BD%9C%E6%88%90" },
  { id: "04", title: "AI 支援/指導計画作成", en: "PLANNING ASSIST", href: "https://aspecial-education-app.onrender.com/AI%E3%81%AB%E3%82%88%E3%82%8B%E6%94%AF%E6%8F%B4,%E6%8C%87%E5%B0%8E%E8%A8%88%E7%94%BB%E4%BD%9C%E6%88%90" },
  { id: "05", title: "早引き学習指導要領", en: "GUIDELINES", href: "https://aspecial-education-app.onrender.com/%E7%9F%A5%E7%9A%84%E6%AE%B5%E9%9A%8E_%E6%97%A9%E5%BC%95%E3%81%8D%E5%AD%A6%E7%BF%92%E6%8C%87%E5%B0%8E%E8%A6%81%E9%A0%98" },
  { id: "06", title: "授業カードライブラリ", en: "LESSON CARD LIBRARY", href: "https://aspecial-education-app.onrender.com/%E6%8E%88%E6%A5%AD%E3%82%AB%E3%83%BC%E3%83%89%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%83%BC" },
  { id: "07", title: "動画ギャラリー", en: "VIDEO GALLERY", href: "https://aspecial-education-app.onrender.com/%E5%8B%95%E7%94%BB%E3%82%AE%E3%83%A3%E3%83%A9%E3%83%AA%E3%83%BC" },
];

// 2. 分析ツール一覧
const analysisTools = [
  { jp: "応用行動分析", en: "Applied Behavior Analysis (ABA)", href: "https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" },
  { jp: "機能的行動評価", en: "Functional Behavior Assessment", href: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" },
  { jp: "アンケート統計分析", en: "Survey Statistical Analysis", href: "https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" },
  { jp: "多変量回帰分析", en: "Multivariate Regression", href: "https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/" },
  { jp: "t検定・統計ツール", en: "T-Test & Statistical Tools", href: "https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" },
  { jp: "ノンパラメトリック分析", en: "Non-Parametric Analysis", href: "https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/" },
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

  useEffect(() => {
    const timer1 = setTimeout(() => setOpPhase(1), 2000);
    const timer2 = setTimeout(() => setOpPhase(2), 4500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // ふわふわ浮くアニメーション定義
  const floating = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* 0. オープニングアニメーション */}
      <AnimatePresence mode="wait">
        {opPhase < 2 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            {opPhase === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                transition={{ duration: 1.5 }}
              >
                <img src={LOGO_PATH} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
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
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">Mirairo</h1>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 固定ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-8 z-40 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none transition-all duration-500">
        <div className="pointer-events-auto bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5 hover:border-white/20 transition-all">
          <h1 className="text-xs font-bold tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            Mirairo <span className="text-gray-600">v2.0</span>
          </h1>
        </div>
        <nav className="pointer-events-auto flex gap-4 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-hide">
          <HeaderTag icon={<User size={12} />} label="PROFILE" onClick={() => setSelectedPage('profile')} />
          <HeaderTag icon={<Cpu size={12} />} label="SYSTEM" onClick={() => setSelectedPage('system')} />
          <HeaderTag icon={<MessageSquare size={12} />} label="FEEDBACK" onClick={() => setSelectedPage('feedback')} />
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-60">
        
        {/* 1. メインビジュアル (余白たっぷり・フローティング) */}
        <section className="px-6 md:px-20 pb-40">
           <motion.div variants={floating} animate="animate" className="mb-12">
             <motion.img 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 5, duration: 1.5 }}
               src={LOGO_PATH} alt="Mirairo Logo" className="w-20 h-20 md:w-32 md:h-32 object-contain"
             />
           </motion.div>
           
           <div className="space-y-4 mb-20">
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.0 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.1 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 5.2 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter text-gray-600">SUPPORT.</motion.h2></div>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 5.5 }}
             className="border-l border-white/20 pl-8 ml-2 max-w-2xl"
           >
             <p className="text-white text-xl md:text-2xl tracking-wide font-light mb-6">Data-Driven Education.</p>
             <p className="text-gray-400 font-light text-sm md:text-base leading-loose">
               指導案作成から統計分析までを一元化したプラットフォーム。
             </p>
           </motion.div>
        </section>

        {/* 2. コンセプト (スペースを大きく取る) */}
        <section className="px-6 md:px-20 mb-40">
          <ScrollReveal>
            <div className="border-t border-white/10 pt-32">
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-5xl">
                Mirairoは、特別支援教育の現場における<br className="hidden md:block"/>
                <span className="text-blue-500">「経験」</span>や<span className="text-blue-500">「勘」</span>に、
                データという新たな<span className="text-blue-500">「根拠」</span>をプラスします。
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
                 <FeatureItem icon={<Brain size={48} />} title="AI Assistant" desc="指導案や支援計画の作成をAIがサポート。事務作業時間を大幅に短縮し、子どもと向き合う時間を創出します。" />
                 <FeatureItem icon={<LineChart size={48} />} title="Visualization" desc="発達検査の結果や行動記録をチャートで見える化。直感的に状況を把握し、チームでの共有を円滑にします。" />
                 <FeatureItem icon={<Sparkles size={48} />} title="Evidence" desc="専門的な統計分析ツールを内蔵。実践の成果をデータで検証し、より確かな教育実践へとつなげます。" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 3. メインメニュー (ゆったり配置・順番に出現) */}
        <section className="px-6 md:px-20 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <StaggeredMenu>
                <MenuCard title="Mirairo アプリ" sub="APPLICATIONS" icon={<Layers />} onClick={() => setSelectedPage('apps')} big />
                <MenuCard title="アプリマニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
                <MenuCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
                <MenuCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
                <MenuCard title="分析ツール" sub="FOR RESEARCHERS" icon={<Activity />} onClick={() => setSelectedPage('tools')} />
             </StaggeredMenu>
          </div>
        </section>

        {/* 4. フッター */}
        <footer className="bg-neutral-950 border-t border-white/5 pt-32 pb-20 px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32 max-w-6xl mx-auto">
            <FooterLink title="ADMINISTRATOR" icon={<User size={16}/>} onClick={() => setSelectedPage('profile')} />
            <FooterLink title="FEEDBACK" icon={<MessageSquare size={16}/>} onClick={() => setSelectedPage('feedback')} />
            <FooterLink title="SYSTEM" icon={<Cpu size={16}/>} onClick={() => setSelectedPage('system')} />
            <FooterLink title="TERMS OF USE" icon={<FileText size={16}/>} onClick={() => setSelectedPage('terms')} />
          </div>
          <div className="text-center text-gray-700 text-xs tracking-widest">
            &copy; 2025 Mirairo Project. All Rights Reserved.
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

// ヌルっと出るアニメーション (再利用可能)
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

// メニューの順番出現用ラッパー
function StaggeredMenu({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="contents" // Gridレイアウトを壊さないためにcontents指定
    >
      {children}
    </motion.div>
  );
}

// コンセプト機能のアイテム
function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="text-blue-500 mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{icon}</div>
      <h4 className="text-2xl font-bold mb-6 tracking-wide">{title}</h4>
      <p className="text-gray-400 leading-loose font-light">{desc}</p>
    </div>
  );
}

// メニューカード
function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ backgroundColor: "#ffffff", color: "#000000", scale: 1.02 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-sm border border-white/5 p-10 md:p-14 
        cursor-pointer group relative overflow-hidden flex flex-col justify-between
        ${big ? 'md:col-span-2' : ''} h-[280px] md:h-[350px] rounded-2xl
      `}
    >
      <div className="flex justify-between items-start">
        <div className="text-gray-500 group-hover:text-black transition-colors duration-500">{icon}</div>
        <ArrowUpRight className="text-gray-500 group-hover:text-black transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 group-hover:text-black/60 mb-3 tracking-[0.2em]">{sub}</p>
        <h3 className="text-3xl md:text-4xl font-bold">{title}</h3>
      </div>
    </motion.div>
  );
}

// フッターリンク
function FooterLink({ title, icon, onClick }: { title: string, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group w-full p-4 rounded hover:bg-white/5 transition-all">
      <div className="text-gray-600 group-hover:text-blue-400 mb-3 transition-colors">{icon}</div>
      <h4 className="text-xs font-bold text-gray-400 group-hover:text-white tracking-[0.2em] transition-colors">{title}</h4>
    </button>
  );
}

// ヘッダータグ
function HeaderTag({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-2.5 bg-white/10 text-white hover:bg-white hover:text-black rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 backdrop-blur-md border border-white/5 hover:border-white"
    >
      {icon} {label}
    </button>
  );
}

// モーダルコンテンツ
function PageContent({ page, onClose }: { page: string, onClose: () => void }) {
  const renderContent = () => {
    switch(page) {
      case 'apps':
        return (
          <div>
             <ModalHeader title="Mirairo Apps" sub="現場の困りごとを解決するアプリケーション" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mirairoApps.map((app, i) => (
                  <a key={i} href={app.href} target="_blank" rel="noopener noreferrer" 
                     className="block p-8 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 group rounded-xl"
                  >
                    <div className="flex justify-between mb-6">
                       <span className="font-mono text-xs text-gray-500 group-hover:text-black/60 tracking-widest">{app.id}</span>
                       <ArrowUpRight size={18} className="text-gray-500 group-hover:text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                    <p className="text-xs text-gray-500 group-hover:text-black/60 font-mono tracking-wide">{app.en}</p>
                  </a>
                ))}
             </div>
          </div>
        );
      case 'manual':
        return (
          <div>
             <ModalHeader title="Manual & Guide" sub="アプリの使い方・活用マニュアル" />
             <div className="grid grid-cols-1 gap-12">
               {manuals.map((manual, i) => (
                 <ScrollReveal key={i}>
                   <div className="p-10 bg-white/5 border border-white/5 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 group">
                     <h3 className="text-2xl font-bold mb-4 flex items-center gap-4">
                       <BookOpen size={28} className="text-blue-500 group-hover:text-blue-600"/> {manual.title}
                     </h3>
                     <p className="text-gray-400 group-hover:text-black/70 mb-8 text-sm leading-loose">{manual.desc}</p>
                     
                     <div className="bg-black/20 group-hover:bg-gray-100 p-8 rounded-xl transition-colors">
                       <h4 className="text-xs font-bold text-blue-400 group-hover:text-blue-600 mb-4 tracking-widest">HOW TO USE</h4>
                       <ul className="space-y-4">
                         {manual.steps.map((step, idx) => (
                           <li key={idx} className="flex gap-4 text-sm text-gray-300 group-hover:text-black items-start leading-relaxed">
                             <CheckCircle size={18} className="shrink-0 mt-0.5 text-gray-600 group-hover:text-black/30" />
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
             <div className="mb-10 p-10 bg-gradient-to-r from-blue-900/10 to-transparent border-l-4 border-blue-500 rounded-r-xl">
               <div className="flex items-center gap-6 mb-6">
                 <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center"><User size={40} /></div>
                 <div>
                   <span className="text-blue-400 text-xs font-bold tracking-[0.2em] mb-2 block">ADMINISTRATOR</span>
                   <h3 className="text-3xl font-bold">KOYAMA</h3>
                   <p className="text-sm text-gray-400 mt-1">Special Education Teacher</p>
                 </div>
               </div>
               <p className="text-gray-300 text-sm leading-loose">特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {networkData.map((person, i) => (
                 <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-colors duration-500 group">
                     <h4 className="font-bold text-xl mb-2">{person.name}</h4>
                     <p className="text-xs text-blue-400 group-hover:text-blue-600 mb-2 tracking-wide">{person.role}</p>
                     <p className="text-xs text-gray-500 group-hover:text-black/60">{person.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'school':
        return (
          <div>
             <ModalHeader title="Introduction" sub="Mirairoアプリ導入校・研究協力校" />
             <div className="p-10 bg-white/5 border border-white/5 rounded-2xl mb-10 hover:bg-white hover:text-black transition-colors duration-500 group">
               <h3 className="text-2xl font-bold mb-4 flex items-center gap-4"><School className="text-blue-500 group-hover:text-blue-600" size={32} /> 埼玉県立岩槻はるかぜ特別支援学校</h3>
               <p className="text-gray-400 group-hover:text-black/70 text-sm leading-loose">知的障害のある児童生徒が通う特別支援学校。ICTの積極活用やデータに基づいた指導を実践。</p>
             </div>
             <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center hover:border-white/30 transition-colors">
               <Lightbulb className="mx-auto text-yellow-500/80 mb-6" size={40} />
               <h3 className="text-2xl font-bold mb-4">Future Curriculum Design</h3>
               <p className="text-sm text-gray-500">次年度より開始される「教育課程の未来デザイン」研究プロジェクト詳細掲載予定。</p>
             </div>
          </div>
        );
      case 'tools':
        return (
          <div>
             <ModalHeader title="Analysis Tools" sub="研究論文・データ分析のための専門ツール" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                {analysisTools.map((tool, i) => (
                  <a key={i} href={tool.href} target="_blank" rel="noopener noreferrer" className="bg-black/50 p-10 hover:bg-white hover:text-black transition-colors duration-500 group block">
                    <span className="font-bold text-xl block mb-2">{tool.jp}</span>
                    <span className="font-mono text-xs text-gray-500 group-hover:text-black/60 tracking-wider">{tool.en}</span>
                  </a>
                ))}
             </div>
          </div>
        );
      case 'profile':
        return (
          <div className="py-20 text-center">
             <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8"><User size={48} className="text-blue-500" /></div>
             <h2 className="text-5xl font-bold mb-4">KOYAMA</h2>
             <p className="text-blue-400 text-sm tracking-[0.2em] mb-12">ADMINISTRATOR</p>
             <p className="text-gray-300 leading-loose max-w-xl mx-auto">
                埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                プログラミング（Python, React）を活用し、特別支援教育の課題解決に取り組んでいます。
             </p>
          </div>
        );
       case 'system':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-bold mb-12">SYSTEM ARCHITECTURE</h2>
               <div className="flex flex-wrap justify-center gap-6">
                 {['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Render'].map(tag => (
                   <span key={tag} className="px-6 py-3 border border-white/20 rounded-full text-sm font-mono text-gray-400">{tag}</span>
                 ))}
               </div>
            </div>
         );
       case 'feedback':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-bold mb-8">FEEDBACK</h2>
               <p className="text-gray-400 mb-12">ご意見・ご要望・バグ報告は以下のフォームよりお願いいたします。</p>
               <a href="https://docs.google.com/forms/d/1dKzh90OkxMoWDZXV31FgPvXG5EvNlMFOrvSPGvYTSC8/preview" target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors shadow-lg hover:shadow-blue-500/50">
                 アンケートフォームを開く <ArrowUpRight size={18} />
               </a>
            </div>
         );
       case 'terms':
         return (
            <div className="py-20 text-center">
               <h2 className="text-4xl font-bold mb-8">TERMS OF USE</h2>
               <div className="max-w-2xl mx-auto text-left space-y-8 text-gray-400 text-sm leading-loose">
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
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-6 md:p-20 relative">
        <button onClick={onClose} className="fixed top-6 right-6 z-[70] p-3 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors"><X size={32} /></button>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto pt-20 pb-20">
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-16 border-b border-white/20 pb-10">
      <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{title}</h2>
      <p className="text-gray-400 text-lg font-light tracking-wide">{sub}</p>
    </div>
  );
}