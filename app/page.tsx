"use client";
import { motion } from "framer-motion";
import { 
  BookOpen, BarChart3, Layout, BrainCircuit, 
  FileText, Youtube, MessageSquare, Calculator, 
  TrendingUp, Activity, Sigma, Search, User
} from "lucide-react";

// --- データの定義（ここを書き換えるとサイトの内容が変わります） ---

// 1. メイン機能（アプリ）
const mainFeatures = [
  {
    title: "指導支援内容検索",
    desc: "困りごとに応じた具体的な指導・支援のアイデアを検索できます。",
    icon: <Search size={24} />,
    color: "bg-purple-100 text-purple-600",
    href: "#" // 実際のリンク先に変更してください
  },
  {
    title: "発達チャート作成",
    desc: "発達段階を記録し、レーダーチャートで視覚化・保存します。",
    icon: <Activity size={24} />,
    color: "bg-blue-100 text-blue-600",
    href: "#"
  },
  {
    title: "分析方法ガイド",
    desc: "教育・心理学に基づいた分析手法とツールを提供します。",
    icon: <BarChart3 size={24} />,
    color: "bg-emerald-100 text-emerald-600",
    href: "#"
  },
  {
    title: "AI計画作成アシスト",
    desc: "個別の指導計画作成用プロンプトをAIが生成します。",
    icon: <BrainCircuit size={24} />,
    color: "bg-pink-100 text-pink-600",
    href: "#"
  },
  {
    title: "AI指導案作成",
    desc: "基本情報を入れるだけで学習指導案を自動生成します。",
    icon: <FileText size={24} />,
    color: "bg-orange-100 text-orange-600",
    href: "#"
  },
  {
    title: "授業カードライブラリ",
    desc: "先生方の授業アイデアを共有・検索できるデータベース。",
    icon: <Layout size={24} />,
    color: "bg-cyan-100 text-cyan-600",
    href: "#"
  },
  {
    title: "早引き学習指導要領",
    desc: "知的段階ごとの指導要領を素早く検索・閲覧できます。",
    icon: <BookOpen size={24} />,
    color: "bg-indigo-100 text-indigo-600",
    href: "#"
  },
  {
    title: "動画ギャラリー",
    desc: "特別支援教育に関する解説動画まとめ。",
    icon: <Youtube size={24} />,
    color: "bg-red-100 text-red-600",
    href: "#"
  },
];

// 2. 統計・分析ツール（リンク集）
const analysisTools = [
  { name: "応用行動分析 (ABA)", url: "https://abaapppy-...", icon: <Activity size={16} /> },
  { name: "機能的行動評価", url: "https://kinoukoudou-...", icon: <Search size={16} /> },
  { name: "アンケート統計分析", url: "https://annketo12345py-...", icon: <BarChart3 size={16} /> },
  { name: "相関分析", url: "https://soukan-...", icon: <TrendingUp size={16} /> },
  { name: "多変量回帰分析", url: "https://kaikiapp-...", icon: <Sigma size={16} /> },
  { name: "t検定・検定ツール", url: "https://tkentei-...", icon: <Calculator size={16} /> },
];

export default function Home() {
  // アニメーションの設定
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-purple-200">
      
      {/* --- ヒーローセクション（トップの大きな部分） --- */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6">
              Special Education Support Hub
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              子どもたちの<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                「できた！」
              </span>を支援する
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mb-8">
              特別支援教育に関わる先生方のための統合プラットフォーム。<br />
              指導案の作成から専門的な統計分析まで、あなたの実践をデジタルの力でサポートします。
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
                アプリを使う
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all">
                使い方を見る
              </button>
            </div>
          </motion.div>
        </div>

        {/* 背景の装飾（薄いグラデーション） */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-50 to-transparent opacity-50 -z-10" />
      </section>

      {/* --- メイン機能グリッド（Bento Gridスタイル） --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Main Applications</h2>
          <p className="text-slate-500 mt-2">日々の教育活動をサポートする主要ツール</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mainFeatures.map((feature, index) => (
            <motion.a
              key={index}
              variants={item}
              href={feature.href}
              className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* --- 研究者向け分析ツール & プロフィール --- */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 左側：分析ツールリスト */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Research & Analysis Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisTools.map((tool, index) => (
                <a 
                  key={index}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    {tool.icon}
                  </div>
                  <span className="font-medium text-slate-700">{tool.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 右側：プロフィールカード */}
          <div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                   {/* ここに自分の写真を入れるなら <img src="..." /> に変えてください */}
                   <User size={32} className="text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">管理者プロフィール</h3>
                  <p className="text-xs text-slate-500">Special Education Teacher</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                岩槻はるかぜ特別支援学校 教諭。<br />
                データとAIを活用した「根拠のある指導」をテーマに、様々な教育支援アプリを開発しています。
              </p>
              <button className="w-full py-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                詳細プロフィールを見る
              </button>
            </div>

            {/* フィードバックボタン */}
            <a href="#" className="mt-6 flex items-center justify-center gap-2 w-full p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
              <MessageSquare size={18} />
              ご意見・フィードバック
            </a>
          </div>

        </div>
      </section>

      {/* --- フッター --- */}
      <footer className="bg-white border-t border-slate-200 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-slate-400 text-sm mb-4">
            © 2025 Special Education Support Hub. All Rights Reserved.
          </p>
          <p className="text-xs text-slate-300">
            ※本サイトのデータやツールの無断転載・商用利用を禁じます。
          </p>
        </div>
      </footer>
    </div>
  );
}