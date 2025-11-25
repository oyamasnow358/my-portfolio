"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, Zap, Globe, Code, Database, 
  MessageSquare, Info, Video, BookOpen,
  Users, School, Lightbulb, Activity, FileText, CheckCircle
} from "lucide-react";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const LOGO_PATH = "/mirairo.png"; 

// 1. Mirairoアプリ一覧 (TOPページを追加)
const mirairoApps = [
  { 
    id: "00", 
    title: "TOPページ", 
    en: "HOME", 
    href: "https://aspecial-education-app.onrender.com/" 
  },
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
  { jp: "応用行動分析", en: "Applied Behavior Analysis (ABA)", href: "https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" },
  { jp: "機能的行動評価", en: "Functional Behavior Assessment", href: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" },
  { jp: "アンケート統計分析", en: "Survey Statistical Analysis", href: "https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" },
  { jp: "多変量回帰分析", en: "Multivariate Regression", href: "https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/" },
  { jp: "t検定・統計ツール", en: "T-Test & Statistical Tools", href: "https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" },
  { jp: "ノンパラメトリック分析", en: "Non-Parametric Analysis", href: "https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/" },
];

// 3. マニュアルデータ (構造化)
const manuals = [
  {
    title: "指導支援内容 マニュアル",
    desc: "お子さんの日常生活の困りごとに応じた、具体的な指導・支援のアイデアを検索することができます。",
    steps: [
      "3つのドロップダウンメニューを左から順番（カテゴリー→項目→詳細）に選択します。",
      "「💡 適した指導・支援を表示」ボタンをクリックします。",
      "表示された指導内容を確認します。タイトルをクリックすると詳細が開きます。"
    ]
  },
  {
    title: "発達チャート作成 マニュアル",
    desc: "お子さんの現在の発達段階を記録し、レーダーチャートで視覚的に確認・保存できます。",
    steps: [
      "12のカテゴリーについて、現在の状況に最も近い発達段階を選択します（「▼目安を見る」で詳細確認可）。",
      "「📊 チャートを作成して書き込む」ボタンをクリックします。",
      "「🌐 スプレッドシートで確認」または「💾 Excel形式でダウンロード」で結果を保存します。"
    ]
  },
  {
    title: "分析方法 マニュアル",
    desc: "特別支援教育で活用できる様々な分析方法や療法について調べることができます。",
    steps: [
      "【方法A】サイドバーから療法・分析法（ABAなど）を直接選択して解説を表示。",
      "【方法B】メインエリアのメニューからお子さんの状況を選択し、有効な療法を表示。"
    ]
  },
  {
    title: "AIによる計画作成サポート マニュアル",
    desc: "個別の支援計画や指導計画作成用のプロンプト（命令文）を簡単に作成します。",
    steps: [
      "プロンプトの種類（プランA・B用、評価用など）を選択します。",
      "お子さんの実態や課題、参考情報を入力します。",
      "「プロンプトを生成」ボタンを押し、表示された文面をコピーしてChatGPT等で使用します。"
    ]
  },
  {
    title: "AIによる指導案作成 マニュアル",
    desc: "基本情報を入力するだけで、AIを使って学習指導案（Excel）を自動生成します。",
    steps: [
      "学部学年、教科単元などの基本情報を入力します。",
      "「プロンプトを作成」し、ChatGPT等に貼り付けてJSONコードを取得します。",
      "取得したコードをアプリに入力し、「Excel作成実行」ボタンを押してダウンロードします。"
    ]
  },
  {
    title: "知的段階（学習指導要領） マニュアル",
    desc: "学習指導要領の中から、必要な部分を素早く探し出して閲覧することができます。",
    steps: [
      "学部、障害種別（段階）、教科を選択します。",
      "「表示する」ボタンをクリックすると、該当する内容（目標・指導内容）が表示されます。"
    ]
  },
  {
    title: "授業カードライブラリー マニュアル",
    desc: "先生方が実践している授業のアイデアをカード形式で共有・検索できる機能です。",
    steps: [
      "検索バーやハッシュタグを使って授業を探します。",
      "授業カードをクリックして詳細ページを開き、指導略案PDFや動画を確認します。"
    ]
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* 0. オープニングアニメーション */}
      <AnimatePresence mode="wait">
        {opPhase < 2 && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            {opPhase === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 1 }}
              >
                <img src={LOGO_PATH} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
              </motion.div>
            )}
            {opPhase === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <p className="text-sm md:text-lg text-gray-400 mb-4 tracking-widest font-light">すぐわかる。すぐ使える。</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">Mirairo</h1>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 固定ヘッダー */}
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
        </nav>
      </header>

      {/* --- メインコンテンツ --- */}
      <div className="relative z-10 pt-48">
        
        {/* 1. メインビジュアル */}
        <section className="px-6 md:px-12 pb-20 mb-12">
           <motion.img 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 4.8, duration: 1 }}
             src={LOGO_PATH} 
             alt="Mirairo Logo" 
             className="w-16 h-16 md:w-24 md:h-24 object-contain mb-8"
           />
           
           <div className="overflow-hidden mb-2">
             <motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 4.8 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">SPECIAL</motion.h2>
           </div>
           <div className="overflow-hidden mb-2">
             <motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 4.9 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter">EDUCATION</motion.h2>
           </div>
           <div className="overflow-hidden mb-10">
             <motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 5.0 }} className="text-7xl md:text-9xl font-bold leading-[0.85] tracking-tighter text-gray-500">SUPPORT.</motion.h2>
           </div>

           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1, delay: 5.2 }}
             className="border-l-2 border-white/20 pl-6"
           >
             <p className="text-white text-lg md:text-xl tracking-wide font-bold mb-4">
               Data-Driven Education.
             </p>
             <p className="text-gray-400 mb-6">
               指導案作成から統計分析までを一元化したプラットフォーム。
             </p>
             {/* ★追加されたサイト説明文 */}
             <p className="text-sm md:text-base text-gray-500 max-w-2xl leading-loose font-light">
               Mirairoは、特別支援教育の現場における「経験」や「勘」に、データという新たな「根拠」をプラスします。
               先生方の専門性を最新のテクノロジーで支え、子どもたち一人ひとりの可能性を最大限に引き出すための統合プラットフォームです。
             </p>
           </motion.div>
        </section>

        {/* 2. メインメニュー */}
        <section className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          <MenuCard title="Mirairo アプリ" sub="APPLICATIONS" icon={<Layers />} onClick={() => setSelectedPage('apps')} big />
          <MenuCard title="アプリマニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
          <MenuCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
          <MenuCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
          <MenuCard title="分析ツール" sub="FOR RESEARCHERS" icon={<Activity />} onClick={() => setSelectedPage('tools')} />
        </section>

        {/* 3. フッター */}
        <footer className="bg-black border-t border-white/10 pt-20 pb-20 px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 max-w-6xl mx-auto">
            <FooterLink title="ADMINISTRATOR" icon={<User size={16}/>} onClick={() => setSelectedPage('profile')} />
            <FooterLink title="FEEDBACK" icon={<MessageSquare size={16}/>} onClick={() => setSelectedPage('feedback')} />
            <FooterLink title="SYSTEM" icon={<Cpu size={16}/>} onClick={() => setSelectedPage('system')} />
            <FooterLink title="TERMS OF USE" icon={<FileText size={16}/>} onClick={() => setSelectedPage('terms')} />
          </div>
          <div className="text-center text-gray-600 text-xs">
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

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } }
      }}
    >
      {children}
    </motion.div>
  );
}

function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  return (
    <ScrollReveal>
      <motion.div
        whileHover={{ backgroundColor: "#ffffff", color: "#000000" }} // ホバーで白背景・黒文字
        transition={{ duration: 0.3 }}
        onClick={onClick}
        className={`
          bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-12 
          cursor-pointer group relative overflow-hidden flex flex-col justify-between
          ${big ? 'md:col-span-2' : ''} h-[250px] md:h-[300px] rounded-xl
        `}
      >
        <div className="flex justify-between items-start">
          <div className="text-gray-500 group-hover:text-black transition-colors">{icon}</div>
          <ArrowUpRight className="text-gray-500 group-hover:text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <div>
          <p className="font-mono text-xs text-gray-500 group-hover:text-black/60 mb-2 tracking-widest">{sub}</p>
          <h3 className="text-3xl md:text-4xl font-bold">{title}</h3>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

function FooterLink({ title, icon, onClick }: { title: string, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group w-full p-4 rounded hover:bg-white hover:text-black transition-all">
      <div className="text-gray-500 group-hover:text-black mb-2 transition-colors">{icon}</div>
      <h4 className="text-sm font-bold text-gray-300 group-hover:text-black tracking-widest transition-colors">{title}</h4>
    </button>
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
             <ModalHeader title="Mirairo Apps" sub="現場の困りごとを解決するアプリケーション" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mirairoApps.map((app, i) => (
                  <a key={i} href={app.href} target="_blank" rel="noopener noreferrer" 
                     className="block p-6 bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all group rounded-lg"
                  >
                    <div className="flex justify-between mb-4">
                       <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{app.id}</span>
                       <ArrowUpRight size={16} className="text-gray-500 group-hover:text-black" />
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
          <div>
             <ModalHeader title="Manual & Guide" sub="アプリの使い方・活用マニュアル" />
             <div className="grid grid-cols-1 gap-8">
               {manuals.map((manual, i) => (
                 <ScrollReveal key={i} delay={i * 0.1}>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-colors group">
                     <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                       <BookOpen size={24} className="text-blue-500 group-hover:text-blue-600"/> {manual.title}
                     </h3>
                     <p className="text-gray-400 group-hover:text-black/70 mb-6 text-sm leading-relaxed">{manual.desc}</p>
                     
                     <div className="bg-black/20 group-hover:bg-gray-100 p-6 rounded-lg transition-colors">
                       <h4 className="text-xs font-bold text-blue-400 group-hover:text-blue-600 mb-3 tracking-widest">HOW TO USE</h4>
                       <ul className="space-y-3">
                         {manual.steps.map((step, idx) => (
                           <li key={idx} className="flex gap-3 text-sm text-gray-300 group-hover:text-black">
                             <CheckCircle size={16} className="shrink-0 mt-0.5 text-gray-500 group-hover:text-black/50" />
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
             <div className="mb-8 p-8 bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-500 rounded-r-lg">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center"><User size={32} /></div>
                 <div>
                   <span className="text-blue-400 text-xs font-bold tracking-widest">ADMINISTRATOR</span>
                   <h3 className="text-2xl font-bold">KOYAMA</h3>
                   <p className="text-sm text-gray-400">Special Education Teacher</p>
                 </div>
               </div>
               <p className="text-gray-300 text-sm">特別支援教育×データサイエンス。現場の「感覚」を「根拠」に変えるツール開発を行っています。</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {networkData.map((person, i) => (
                 <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white hover:text-black transition-colors group">
                     <h4 className="font-bold text-lg">{person.name}</h4>
                     <p className="text-xs text-blue-400 group-hover:text-blue-600 mb-1">{person.role}</p>
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
             <div className="p-8 bg-white/5 border border-white/10 rounded-xl mb-8 hover:bg-white hover:text-black transition-colors group">
               <h3 className="text-2xl font-bold mb-2 flex items-center gap-3"><School className="text-blue-400 group-hover:text-blue-600" /> 埼玉県立岩槻はるかぜ特別支援学校</h3>
               <p className="text-gray-400 group-hover:text-black/70 text-sm mb-4">知的障害のある児童生徒が通う特別支援学校。ICTの積極活用やデータに基づいた指導を実践。</p>
             </div>
             <div className="p-8 border border-dashed border-white/20 rounded-xl text-center hover:border-white/50 transition-colors">
               <Lightbulb className="mx-auto text-yellow-500 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">Future Curriculum Design</h3>
               <p className="text-sm text-gray-500">次年度より開始される「教育課程の未来デザイン」研究プロジェクト詳細掲載予定。</p>
             </div>
          </div>
        );
      case 'tools':
        return (
          <div>
             <ModalHeader title="Analysis Tools" sub="研究論文・データ分析のための専門ツール" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/20 border border-white/20">
                {analysisTools.map((tool, i) => (
                  <a key={i} href={tool.href} target="_blank" rel="noopener noreferrer" className="bg-black p-8 hover:bg-white hover:text-black transition-colors group block">
                    <span className="font-bold text-lg block mb-1">{tool.jp}</span>
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
               <div><h3 className="text-2xl font-bold">KOYAMA</h3><p className="text-sm text-gray-400">Developer & Teacher</p></div>
             </div>
             <p className="text-gray-300">埼玉県立岩槻はるかぜ特別支援学校 教諭。</p>
          </div>
        );
       case 'system':
         return (
            <div className="py-10"><h2 className="text-4xl font-bold mb-6">SYSTEM</h2><p className="text-gray-300">Next.js 14, Tailwind CSS, Vercel</p></div>
         );
       case 'feedback':
         return (
            <div className="py-10">
               <h2 className="text-4xl font-bold mb-6">FEEDBACK</h2>
               <a href="https://docs.google.com/forms/d/1dKzh90OkxMoWDZXV31FgPvXG5EvNlMFOrvSPGvYTSC8/preview" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors">アンケートフォーム</a>
            </div>
         );
       case 'terms':
         return (
            <div className="py-10">
               <h2 className="text-4xl font-bold mb-6">TERMS OF USE</h2>
               <p className="text-gray-300">本サイトは非営利の研究用プラットフォームです。ツールは自由にご利用いただけます。</p>
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
        <button onClick={onClose} className="fixed top-6 right-6 z-[70] p-2 bg-white/10 rounded-full hover:bg-white hover:text-black transition-colors"><X size={32} /></button>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto pt-10">
          {renderContent()}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ModalHeader({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="mb-10 border-b border-white/20 pb-10">
      <h2 className="text-5xl font-bold mb-4">{title}</h2>
      <p className="text-gray-400">{sub}</p>
    </div>
  );
}