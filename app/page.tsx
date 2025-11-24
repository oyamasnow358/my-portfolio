"use client";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, Activity, Search, Brain, 
  FileText, Layers, Video, Database, 
  BarChart, ChevronRight, User
} from "lucide-react";

// --- コンテンツデータ（ここにリンクなどを設定） ---
const mainApps = [
  {
    id: "01",
    title: "指導支援内容検索",
    desc: "困りごとに応じた具体的な支援策を検索",
    href: "https://your-streamlit-app-url/page1", // ★実際のURLを入れてください
    icon: <Search className="w-6 h-6" />
  },
  {
    id: "02",
    title: "発達チャート作成",
    desc: "発達段階をレーダーチャートで可視化",
    href: "#",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "03",
    title: "AI計画作成アシスト",
    desc: "個別の指導計画プロンプトを自動生成",
    href: "#",
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: "04",
    title: "AI指導案作成",
    desc: "基本情報から学習指導案を出力",
    href: "#",
    icon: <FileText className="w-6 h-6" />
  },
];

const tools = [
  { name: "応用行動分析 (ABA)", href: "#" },
  { name: "機能的行動評価", href: "#" },
  { name: "アンケート統計分析", href: "#" },
  { name: "多変量回帰分析", href: "#" },
  { name: "t検定・検定ツール", href: "#" },
  { name: "ノンパラメトリック分析", href: "#" },
];

export default function Home() {
  return (
    // 全体の背景を黒にする
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* --- ヘッダー --- */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-sm font-bold tracking-widest">SPECIAL ED. SUPPORT</div>
          <nav className="hidden md:flex gap-8 text-xs text-neutral-400">
            <a href="#apps" className="hover:text-white transition-colors">APPS</a>
            <a href="#tools" className="hover:text-white transition-colors">TOOLS</a>
            <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          </nav>
        </div>
      </header>

      {/* --- ヒーローセクション（トップの動きのある文字） --- */}
      <main className="pt-32 pb-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-neutral-500 mb-4 tracking-widest text-sm">INTEGRATED PLATFORM</p>
            <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter mb-8">
              Educate.<br />
              Analyze.<br />
              <span className="text-neutral-600">Empower.</span>
            </h1>
            <p className="max-w-2xl text-neutral-400 text-lg leading-relaxed">
              特別支援教育の現場に、データとAIの力を。
              <br />指導案作成から統計分析まで、あなたの教育実践を次のステージへ導く統合プラットフォームです。
            </p>
          </motion.div>
        </div>
      </main>

      {/* --- メインアプリケーション（グリッドデザイン） --- */}
      <section id="apps" className="border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-800 max-w-7xl mx-auto">
          {mainApps.map((app, index) => (
            <motion.a
              key={index}
              href={app.href}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group block h-80 relative p-8 hover:bg-neutral-900 transition-colors duration-500"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-xs text-neutral-600 font-mono">APP {app.id}</span>
                <ArrowUpRight className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="mb-4 text-neutral-500 group-hover:text-white transition-colors">
                  {app.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">{app.title}</h3>
                <p className="text-sm text-neutral-500 group-hover:text-neutral-400">{app.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* --- その他の機能リスト（横長のリストデザイン） --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-800 max-w-7xl mx-auto">
        {/* 左：学習指導要領など */}
        <div className="border-r border-neutral-800">
          <a href="#" className="block p-12 hover:bg-neutral-900 transition-colors border-b border-neutral-800">
            <div className="flex items-center gap-4 mb-4">
              <Layers className="w-6 h-6 text-neutral-400" />
              <h3 className="text-xl font-bold">早引き学習指導要領</h3>
            </div>
            <p className="text-neutral-500 text-sm">知的段階ごとの内容を素早く検索・閲覧</p>
          </a>
          <a href="#" className="block p-12 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Video className="w-6 h-6 text-neutral-400" />
              <h3 className="text-xl font-bold">動画ギャラリー</h3>
            </div>
            <p className="text-neutral-500 text-sm">特別支援教育に関する解説動画アーカイブ</p>
          </a>
        </div>

        {/* 右：授業カードライブラリ（大きく表示） */}
        <a href="#" className="group p-12 flex flex-col justify-between hover:bg-neutral-900 transition-colors relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <Database className="w-8 h-8 text-neutral-400" />
               <span className="text-xs border border-neutral-700 px-2 py-1 rounded-full">NEW</span>
            </div>
            <h3 className="text-3xl font-bold mb-4">授業カード<br/>ライブラリー</h3>
            <p className="text-neutral-500">全国の先生方の授業アイデアを共有・検索。</p>
          </div>
          {/* 背景に薄く大きなアイコンを入れる演出 */}
          <Database className="absolute -bottom-10 -right-10 w-64 h-64 text-neutral-900 group-hover:text-neutral-800 transition-colors duration-500" />
        </a>
      </section>

      {/* --- 分析ツールセクション（リスト形式） --- */}
      <section id="tools" className="py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <h2 className="text-4xl font-bold">Analysis Tools</h2>
            <p className="text-neutral-500 mt-4 md:mt-0">研究・分析のための専門ツール群</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
            {tools.map((tool, i) => (
              <a key={i} href={tool.href} className="bg-black p-6 flex items-center justify-between group hover:bg-neutral-900 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart className="w-4 h-4 text-neutral-600 group-hover:text-white" />
                  <span className="font-medium text-neutral-300 group-hover:text-white">{tool.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- プロフィール & フッター --- */}
      <section id="about" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-neutral-800 min-h-[300px]">
        <div className="md:col-span-2 p-12 md:border-r border-neutral-800 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6">Administrator</h2>
            <p className="text-neutral-400 leading-relaxed mb-6">
              岩槻はるかぜ特別支援学校 教諭。<br />
              「根拠のある指導」をテーマに、教育現場のデータを科学的に分析・活用するためのツール開発を行っています。
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 border border-white text-white text-sm hover:bg-white hover:text-black transition-colors">
              お問い合わせ
            </button>
          </div>
        </div>
        <div className="p-12 flex items-center justify-center bg-neutral-900/50">
           {/* アイコンの代わりに写真がある場合はimgタグにしてください */}
           <User className="w-32 h-32 text-neutral-800" />
        </div>
      </section>

      <footer className="py-8 text-center text-neutral-600 text-xs border-t border-neutral-800">
        © 2025 Special Education Support Hub.
      </footer>
    </div>
  );
}