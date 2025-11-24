"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  
  // ヌルっと動く設定
  const anim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* --- ヘッダー --- */}
      <header className="flex justify-between items-center p-8 border-b border-white/20 fixed w-full top-0 bg-black/80 backdrop-blur z-50">
        <h1 className="text-sm font-bold tracking-widest">SUPPORT HUB</h1>
        <div className="text-xs text-gray-500">VER 2.0</div>
      </header>

      {/* --- メインビジュアル --- */}
      <main className="pt-40 px-6 md:px-12 pb-20 border-b border-white/20">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={anim}
        >
          <h2 className="text-7xl md:text-9xl font-bold leading-[0.9] tracking-tighter mb-10">
            SPECIAL<br />
            EDUCATION<br />
            <span className="text-gray-600">SUPPORT.</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            データとAIで、教育の解像度を上げる。<br />
            指導案作成から統計分析までを一元化したプラットフォーム。
          </p>
        </motion.div>
      </main>

      {/* --- アプリ一覧（グリッドレイアウト） --- */}
      <section className="border-b border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* 左列 */}
          <div className="border-b md:border-b-0 md:border-r border-white/20">
            <AppCard 
              num="01" 
              title="指導支援検索" 
              desc="SEARCH SUPPORT" 
              link="#"
            />
            <AppCard 
              num="02" 
              title="発達チャート" 
              desc="DEVELOPMENT CHART" 
              link="#"
            />
             <AppCard 
              num="03" 
              title="AI指導案作成" 
              desc="LESSON PLAN AI" 
              link="#"
            />
          </div>

          {/* 右列 */}
          <div>
            <AppCard 
              num="04" 
              title="計画作成AI" 
              desc="PLANNING ASSIST" 
              link="#"
            />
            <AppCard 
              num="05" 
              title="学習指導要領" 
              desc="GUIDELINES" 
              link="#"
            />
            {/* 巨大なリンクブロック */}
            <a href="#" className="block h-[300px] p-10 relative group bg-neutral-900 hover:bg-white transition-colors duration-500 border-t border-white/20">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-gray-500 group-hover:text-black">NEW ARRIVAL</span>
                <ArrowUpRight className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="absolute bottom-10 left-10">
                <h3 className="text-4xl font-bold mb-2 group-hover:text-black">授業カード<br/>ライブラリ</h3>
                <p className="text-gray-500 text-sm group-hover:text-black">全国の実践事例を共有・検索</p>
              </div>
            </a>
          </div>

        </div>
      </section>

      {/* --- 分析ツール（リスト表示） --- */}
      <section className="p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <h2 className="text-4xl font-bold">ANALYSIS TOOLS</h2>
          <p className="text-gray-500 text-sm">研究・分析用ツール群</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/20 border border-white/20">
          {[
            "応用行動分析 (ABA)", "機能的行動評価", "アンケート統計分析",
            "多変量回帰分析", "t検定・検定ツール", "ノンパラメトリック分析"
          ].map((item, i) => (
            <a key={i} href="#" className="bg-black hover:bg-white hover:text-black transition-colors duration-300 p-6 flex justify-between items-center group h-32">
              <span className="font-bold text-lg">{item}</span>
              <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>

      <footer className="p-12 text-center text-gray-600 text-xs border-t border-white/20">
        &copy; 2025 SPECIAL EDUCATION SUPPORT HUB.
      </footer>
    </div>
  );
}

// --- 部品：カードコンポーネント ---
function AppCard({ num, title, desc, link }: { num: string, title: string, desc: string, link: string }) {
  return (
    <a href={link} className="block p-10 border-b border-white/20 hover:bg-white hover:text-black transition-colors duration-500 group min-h-[200px] flex flex-col justify-between">
      <div className="flex justify-between w-full">
        <span className="font-mono text-xs text-gray-500 group-hover:text-black/60">{num}</span>
        <ArrowUpRight className="text-gray-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-1">{title}</h3>
        <p className="text-xs text-gray-500 tracking-wider group-hover:text-black/60">{desc}</p>
      </div>
    </a>
  );
}