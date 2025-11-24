"use client";
import { motion } from "framer-motion";
import { 
  Search, Activity, Brain, FileText, 
  Video, Layers, BarChart, ExternalLink,
  Database
} from "lucide-react";

export default function Home() {
  
  // アニメーション設定（ふわっと出る）
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- 1. メインビジュアル（一番上の文字） --- */}
      <main className="flex-grow pt-24 pb-16 px-6 md:px-12 border-b border-neutral-800">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <p className="text-blue-500 font-bold tracking-widest mb-4 text-sm">
            SPECIAL SUPPORT HUB
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Data Driven<br />
            Education.
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            特別支援教育の現場に「根拠」と「効率」を。<br />
            指導案の作成から、専門的な統計分析までをワンストップで。
          </p>
        </motion.div>
      </main>

      {/* --- 2. メインアプリ（大きなグリッド） --- */}
      {/* ここが一番使う機能です */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-800">
        
        {/* 左側：主要ツール */}
        <div className="grid grid-cols-1 divide-y border-neutral-800 md:border-r border-b md:border-b-0">
            <AppCard 
              title="指導支援内容検索" 
              desc="困りごとに応じた具体的支援策を検索"
              icon={<Search />}
              num="01"
            />
            <AppCard 
              title="発達チャート作成" 
              desc="発達段階を可視化・記録・保存"
              icon={<Activity />}
              num="02"
            />
            <AppCard 
              title="AI指導案作成" 
              desc="基本情報から学習指導案を自動生成"
              icon={<FileText />}
              num="03"
            />
        </div>

        {/* 右側：その他のツール */}
        <div className="grid grid-cols-1 divide-y border-neutral-800">
            <AppCard 
              title="AI計画作成アシスト" 
              desc="個別の指導計画プロンプト生成"
              icon={<Brain />}
              num="04"
            />
            <AppCard 
              title="早引き学習指導要領" 
              desc="知的段階ごとの内容を素早く検索"
              icon={<Layers />}
              num="05"
            />
            {/* 大きな注目カード */}
            <a href="#" className="group p-8 md:p-12 bg-neutral-900/50 hover:bg-blue-900/20 transition-colors h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Database size={24} />
                <span className="text-xs font-bold border border-blue-900 px-2 py-1 rounded">NEW</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">授業カードライブラリ</h3>
              <p className="text-neutral-400 text-sm">全国の先生方の授業アイデアを共有・検索</p>
            </a>
        </div>
      </section>

      {/* --- 3. 分析ツールリスト（シンプルに羅列） --- */}
      <section className="py-16 px-6 md:px-12 border-b border-neutral-800 bg-neutral-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-bold text-neutral-500 mb-8 tracking-widest">RESEARCH & ANALYSIS TOOLS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ToolLink name="応用行動分析 (ABA)" />
            <ToolLink name="機能的行動評価" />
            <ToolLink name="アンケート統計分析" />
            <ToolLink name="多変量回帰分析" />
            <ToolLink name="t検定・検定ツール" />
            <ToolLink name="ノンパラメトリック分析" />
          </div>
        </div>
      </section>

      {/* --- 4. フッター --- */}
      <footer className="py-12 px-6 text-center">
        <p className="text-neutral-600 text-xs">
          © 2025 Special Education Support Hub. / Administrator: Koyama
        </p>
      </footer>
    </div>
  );
}

// --- 部品：アプリカード ---
function AppCard({ title, desc, icon, num }: { title: string, desc: string, icon: any, num: string }) {
  return (
    <a href="#" className="group block p-8 md:p-10 hover:bg-neutral-900 transition-all duration-300 relative">
      <div className="flex justify-between items-start mb-6">
        <span className="text-neutral-600 font-mono text-xs">APP {num}</span>
        <div className="text-neutral-500 group-hover:text-white transition-colors transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-sm text-neutral-500">{desc}</p>
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
        <ExternalLink size={16} className="text-blue-500" />
      </div>
    </a>
  );
}

// --- 部品：ツールリンク ---
function ToolLink({ name }: { name: string }) {
  return (
    <a href="#" className="flex items-center justify-between p-4 border border-neutral-800 rounded hover:border-neutral-600 hover:bg-neutral-800 transition-all group">
      <span className="text-sm text-neutral-300 group-hover:text-white">{name}</span>
      <BarChart size={14} className="text-neutral-600 group-hover:text-blue-400" />
    </a>
  );
}