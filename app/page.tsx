"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowUpRight, X, User, Layers, 
  Cpu, MessageSquare, BookOpen,
  School, Lightbulb, Activity, FileText, CheckCircle,
  Brain, LineChart, Sparkles, Users, ChevronDown, ChevronUp, ExternalLink,
  PieChart, ScatterChart, Sigma, GitGraph, Binary, BarChart3, ShieldCheck, Mail
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ==========================================
// ▼ データ設定エリア
// ==========================================

const LOGO_OP_PATH = "/MieeL.png";    // 黒背景用
const LOGO_MAIN_PATH = "/MieeL2.png"; // 白背景用

// 2. マニュアルデータ (モーダル表示用)
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
    title: "AIエージェントによる個別の支援計画・指導計画作成サポート マニュアル",
    desc: "児童生徒の実態を入力するだけで、特別支援教育の「個別の支援計画」や「指導計画（各教科の目標・手立て、評価、所見）」作成に必要なAIへの指示文（プロンプト）を自動生成します。AIチャットと連携して文書作成を効率化でき、特定のExcel形式への自動転記機能も備えています。",
    steps: [
      "【モード選択】：最初に利用モードを選びます。「通常モード」は文章作成用（Word等へのコピペ向き）、「Excel作成モード」は専用フォーマットへの自動入力用（JSON出力）です。",
      "【AIチャットの準備】：画面内のリンクボタンから、ChatGPTまたはGeminiを開いておきます。",
      "【プロンプト生成】：作成したい項目（①～⑥）のアコーディオンを開き、児童生徒の実態や課題を入力して「プロンプトを生成」ボタンを押します。",
      "【AIによる作成】：生成された指示文（プロンプト）をコピーし、開いておいたAIチャットに貼り付けて回答を出力させます。",
      "【各項目の内容】：①特別な教育的ニーズ・合理的配慮、②支援目標・支援内容、③指導方針・7項目の実態、④各教科の目標・手立て、⑤評価（振り返り）、⑥前期・後期の所見が作成可能です。",
      "【Excel出力（対象者のみ）】：「Excel作成モード」を選んだ場合、AIが出力したJSONコードをアプリ下部の「岩槻はるかぜ機能」欄に貼り付けることで、内容が転記されたExcelファイルをダウンロードできます。"
    ]
  },
  
    {
    title: "AI指導案作成エージェント マニュアル",
    desc: "授業の基本情報を入力するだけで、AIが学習指導案の構成（本時の目標・展開・評価など）を提案します。さらに、AIが出力したデータコードをアプリに貼り付けることで、所定のフォーマット（指導案.xlsx）に自動入力されたExcelファイルを即座に作成・ダウンロードできます。",
    steps: [
      "【AIチャットの準備】：画面上部のリンクボタンから、ChatGPTまたはGeminiを開いておきます。",
      "【基本情報の入力（Step 1）】：学部学年、日時、教科単元、場所、時間、本時の内容を入力します。「詳細設定」を開くと、目標や評価基準、どうしても入れたい活動のメモなどを追加できます（空欄でもAIが補完します）。",
      "【プロンプト生成（Step 2）】：「プロンプトを作成する」ボタンを押し、表示された指示文をコピーします。",
      "【AIによる作成】：コピーした指示文を開いておいたAIチャットに貼り付けます。AIがJSON形式（コード形式）で指導案の内容を出力します。",
      "【Excel出力（Step 3）】：AIが出力したJSONコード（{...}で囲まれた部分）をアプリ下部のテキストエリアに貼り付け、「指導案Excelを出力する」ボタンを押します。完成したExcelファイルがダウンロードされます。"
  ]

  },
  {
    title: "授業カードライブラリ マニュアル",
    desc: "先生方の実践事例を共有・検索できるデータベースです。",
    steps: ["キーワードやタグで検索", "カードをクリックして詳細を表示", "指導案や教材をダウンロード"]
  },
   {
    title: "早引き学習指導要領（知的段階） マニュアル",
    desc: "学習指導要領の中から、必要な部分を素早く探し出して閲覧することができます。",
    steps: [
      "学部、障害種別（段階）、教科を選択します。",
      "「表示する」ボタンをクリックすると、該当する内容（目標・指導内容）が表示されます。"
    ]
  }
];

// 3. つながり (Network)
const networkData = [
  { name: "IT Teacher A", role: "High School Info Dept.", desc: "Network Specialist" },
  { name: "IT Teacher B", role: "Special Ed. Coordinator", desc: "iPad Utilization" },
  { name: "Researcher C", role: "University Lab", desc: "Data Analysis Support" },
];

// 4. 分析ツールデータ
const analysisTools = [
  { name: "ABA（応用行動分析）", href: "/page/page9", icon: <PieChart size={24} />, desc: "行動の原理を応用し、望ましい行動を促進します。" },
  { name: "FBA/PBS", url: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/", icon: <PieChart size={24} />, desc: "問題行動の原因を探り、前向きな支援計画を立てます。" },
  { name: "アンケートデータ統計分析", url: "https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/", icon: <PieChart size={24} />, desc: "アンケート結果を集計し、視覚的なグラフと基礎統計量を出力します。" },
  { name: "相関分析", url: "https://soukan-jlhkdhkradbnxssy29aqte.streamlit.app/", icon: <ScatterChart size={24} />, desc: "2つの変数の関係性を分析し、相関係数と散布図を表示します。" },
  { name: "多変量回帰分析", url: "https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/", icon: <LineChart size={24} />, desc: "複数の要因から結果を予測するモデルを作成し、要因の影響度を分析します。" },
  { name: "t検定", url: "https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/", icon: <Sigma size={24} />, desc: "2つのグループ間の平均値に有意な差があるかどうかを検定します。" },
  { name: "ロジスティック回帰分析", url: "https://rojisthik-buklkg5zeh6oj2gno746ix.streamlit.app/", icon: <Binary size={24} />, desc: "事象の発生確率を予測・分析するための回帰分析ツールです。" },
  { name: "ノンパラメトリック分析", url: "https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/", icon: <BarChart3 size={24} />, desc: "データの分布を仮定しない統計手法を用いて、グループ間の差を分析します。" },
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

  // ページ遷移用関数
  const goToFeedback = () => router.push("/fpafe");
  const goToSelect = () => router.push("/page/select");

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
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }} className="text-7xl md:text-8xl font-black tracking-tighter">SPECIAL</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="text-7xl md:text-8xl font-black tracking-tighter">EDUCATION</motion.h2></div>
             <div className="overflow-hidden"><motion.h2 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} className="text-7xl md:text-8xl font-black tracking-tighter text-gray-300">SUPPORT.</motion.h2></div>
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
                 特別支援教育の現場における「経験」に「データ」をプラス。<br/>
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
                MieeL(ミエル)は、特別支援教育の現場における<br className="hidden md:block"/>
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

        {/* 3. メインメニュー (カード表示) */}
        <section className="px-6 md:px-20 mb-40">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-4">
             <h3 className="text-3xl md:text-4xl font-black text-slate-900">MENU</h3>
             <p className="text-sm font-bold text-gray-400 tracking-widest hidden md:block">SELECT FUNCTION</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <StaggeredMenu>
                {/* ★最重要: MieeL 各機能 (ここを押すと /page/select へ遷移) */}
                <MenuCard 
                  title="MieeL 各機能" 
                  sub="APPLICATIONS" 
                  icon={<Layers />} 
                  onClick={goToSelect} 
                  big 
                />
                
                <MenuCard title="各機能マニュアル" sub="MANUAL & GUIDE" icon={<BookOpen />} onClick={() => setSelectedPage('manual')} />
                <MenuCard title="つながり" sub="NETWORK" icon={<Users />} onClick={() => setSelectedPage('network')} />
                <MenuCard title="導入校" sub="CASE STUDY" icon={<School />} onClick={() => setSelectedPage('school')} />
                <MenuCard title="分析ツール" sub="FOR RESEARCHERS" icon={<Activity />} onClick={() => setSelectedPage('tools')} />
             </StaggeredMenu>
          </div>
        </section>

        {/* 4. フッター */}
        {/* 背景を黒に変更し、テキストを白に。ボーダーを少し目立たない色に。 */}
        <footer className="bg-black text-white border-t border-gray-800 pt-32 pb-20 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 max-w-7xl mx-auto">
            {/* ボタン自体は bg-white で維持されるので、黒背景に浮き出る */}
            <StylishFooterBtn title="ADMINISTRATOR" sub="管理者プロフィール" icon={<User size={24}/>} onClick={() => setSelectedPage('profile')} color="blue" />
            <StylishFooterBtn title="FEEDBACK" sub="ご意見・ご要望" icon={<MessageSquare size={24}/>} onClick={goToFeedback} color="emerald" />
            <StylishFooterBtn title="SYSTEM" sub="システム構成" icon={<Cpu size={24}/>} onClick={() => setSelectedPage('system')} color="purple" />
            <StylishFooterBtn title="TERMS OF USE" sub="利用規約" icon={<FileText size={24}/>} onClick={() => setSelectedPage('terms')} color="gray" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs tracking-widest border-t border-gray-900 pt-8">
            <p>MieeL Project.</p>
            <p>&copy; 2025 All Rights Reserved.</p>
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

// ★ MenuCard (ホバーで黒く反転する演出)
function MenuCard({ title, sub, icon, onClick, big = false }: { title: string, sub: string, icon: any, onClick: () => void, big?: boolean }) {
  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: false }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
      onClick={onClick}
      // ▼ マウスオーバーで背景黒・文字白
      whileHover={{ backgroundColor: "#1a1a1a", color: "#ffffff", scale: 1.02 }}
      className={`
        bg-white border border-gray-200 p-10 md:p-14 
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
        <p className="font-mono text-xs text-gray-500 group-hover:text-white/80 mb-3 tracking-widest">{sub}</p>
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-white">{title}</h3>
      </div>
    </motion.div>
  );
}

// おしゃれなフッターボタン (光る影)
function StylishFooterBtn({ title, sub, icon, onClick, color }: { title: string, sub: string, icon: any, onClick: () => void, color: string }) {
  const colors: any = {
    blue: "hover:border-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    emerald: "hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]",
    purple: "hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    gray: "hover:border-gray-400 hover:shadow-[0_0_25px_rgba(100,116,139,0.2)]",
  };

  return (
    <motion.button 
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex flex-col items-start justify-center p-8 w-full text-left 
        bg-white text-slate-900 border border-gray-200 rounded-2xl transition-all duration-300 group shadow-sm
        ${colors[color]}
      `}
    >
      <div className="mb-4 text-gray-400 group-hover:text-slate-900 transition-colors">{icon}</div>
      <h4 className="text-lg font-bold tracking-widest mb-1">{title}</h4>
      <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{sub}</p>
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
                   <h3 className="text-3xl font-black text-slate-900">Koyama Takayuki</h3>                   
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

      case 'tools':
        return (
          <div>
             <ModalHeader title="Analysis Tools" sub="研究論文・データ分析のための専門ツール" />
             <p className="text-gray-600 mb-10 leading-relaxed">
               研究活動や日々の実践評価に役立つ統計分析ツールです。インストール不要で、ブラウザ上で安全にデータを処理・可視化できます。
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisTools.map((tool, i) => (
                  <a 
                    key={i} 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-8 rounded-3xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ExternalLink size={60} />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-500 leading-loose">
                      {tool.desc}
                    </p>
                    <div className="mt-6 flex items-center text-xs font-bold text-blue-500 tracking-widest">
                      OPEN APP <ArrowUpRight size={14} className="ml-1" />
                    </div>
                  </a>
                ))}
             </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <ModalHeader title="ADMINISTRATOR" sub="開発者・管理者について" />
            
            {/* メインプロフィールカード */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl mb-12">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
               
               <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                 <div className="shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                      <User size={64} className="text-white/90" />
                    </div>
                 </div>
                 <div className="text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-bold tracking-widest mb-4">
                      LEAD DEVELOPER
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Koyama Takayuki</h2>
                    <p className="text-lg text-gray-300 font-medium mb-6">Special Education Teacher</p>
                    <p className="text-sm text-gray-400 leading-loose max-w-lg">
                      埼玉県立岩槻はるかぜ特別支援学校 教諭。<br />
                      「現場の課題は、現場の手で解決する」をモットーに、教育×エンジニアリングで活動しています。
                    </p>
                 </div>
               </div>
            </div>

            {/* スキル・ミッション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 bg-gray-50 rounded-3xl border border-gray-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Cpu size={20} className="text-purple-600" /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'Next.js', 'React', 'TypeScript', 'Streamlit', 'Data Analysis', 'GAS'].map(skill => (
                      <span key={skill} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
               </div>
               <div className="p-10 bg-blue-50 rounded-3xl border border-blue-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-blue-600" /> Contact
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    開発に関するお問い合わせ、共同研究のご依頼等は以下よりお願いいたします。
                  </p>
                  <a href="mailto:contact@example.com" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    Send Email <ArrowUpRight size={14} />
                  </a>
               </div>
            </div>
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
            <div>
               <ModalHeader title="TERMS OF USE" sub="利用規約" />
               <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border border-gray-200">
                  <div className="prose prose-slate max-w-none text-slate-600">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-gray-400" /> 第1条（目的）
                    </h3>
                    <p className="text-sm leading-loose mb-8">
                      本サイト「MieeL」（以下、「本サービス」）は、特別支援教育におけるICT活用およびデータ駆動型教育の実践研究を目的とした、非営利のプラットフォームです。
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-gray-400" /> 第2条（利用範囲）
                    </h3>
                    <p className="text-sm leading-loose mb-8">
                      本サービス上のツールは、教育関係者、研究者、保護者等、どなたでも無償でご利用いただけます。ただし、本サービスの全部または一部を営利目的で再配布・販売することは禁止します。
                    </p>

                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-gray-400" /> 第3条（個人情報の扱い）
                    </h3>
                    <ul className="list-disc pl-5 text-sm leading-loose mb-8 space-y-2">
                      <li>本サービス内で生成されるデータ（指導案、チャート等）は、利用者個人のブラウザ内またはローカル環境で処理されます。サーバーへ個人情報が送信・保存されることはありません。</li>
                      <li>ただし、生成されたデータを外部（ChatGPT等）に入力する際は、各サービスの利用規約および所属組織（自治体等）の個人情報保護ガイドラインを遵守してください。個人を特定できる情報（氏名、生年月日等）の直接入力は推奨しません。</li>
                    </ul>

                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <ShieldCheck className="text-gray-400" /> 第4条（免責事項）
                    </h3>
                    <p className="text-sm leading-loose mb-8">
                      管理者は、本サービスの利用により生じた損害、トラブル等について、一切の責任を負いません。生成された分析結果や指導案の採否および活用については、利用者自身の責任において判断してください。
                    </p>

                    <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-400 text-center">
                      制定日：2024年4月1日<br/>
                      改定日：2025年1月1日
                    </div>
                  </div>
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
      <p className="text-blue-600 text-xs font-bold tracking-widest mb-2">{sub}</p>
      <h2 className="text-4xl md:text-5xl font-black text-slate-900">{title}</h2>
    </div>
  );
}