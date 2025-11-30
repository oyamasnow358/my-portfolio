"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Activity, Search, BookOpen, ExternalLink, ChevronRight, Info
} from "lucide-react";
import Link from "next/link";

const LOGO_PATH = "/MieeL2.png"; 

// ==========================================
// データ定義
// ==========================================

// 療法・分析法データ (Markdownの内容を簡易テキスト化)
const METHODS_DATA: any = {
  "ABA（応用行動分析）": {
    desc: "行動の原理を応用し、望ましい行動を促進します。",
    detail: "行動の前後（A:先行刺激、B:行動、C:結果）を分析し、行動の原因を探ります。望ましい行動を増やし、不適切な行動を減らすための具体的なアプローチ（強化、消去など）を用います。",
    toolUrl: "https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/"
  },
  "FBA/PBS": {
    desc: "問題行動の原因を探り、前向きな支援計画を立てます。",
    detail: "問題行動の「機能（理由）」を理解し、環境調整や代替行動の指導を通じて、本人が適切な行動をとれるように支援します。",
    toolUrl: "https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/"
  },
  "CBT（認知行動療法）": {
    desc: "思考パターンに焦点を当て、感情や行動の改善を目指します。",
    detail: "「認知（ものの見方）」と「行動」に働きかけ、ストレスや不安を軽減する方法を学びます。自分の気持ちに気づく練習などを行います。",
    image: "https://i.imgur.com/vnMHFNE.png"
  },
  "ソーシャルスキルトレーニング": {
    desc: "対人関係で役立つスキルを効果的に学びます。",
    detail: "挨拶、依頼、断り方など、社会生活に必要なスキルをロールプレイやゲームを通じて練習します。"
  },
  "感覚統合療法": {
    desc: "感覚の処理能力を高め、日常生活の適応を助けます。",
    detail: "遊びや運動を通して、触覚・前庭覚・固有受容覚などの感覚情報を適切に処理する脳の働きを促します。"
  },
  "PECS": {
    desc: "絵カードを使ってコミュニケーション能力を育みます。",
    detail: "欲しいものの絵カードを相手に渡すことから始め、自発的なコミュニケーションを形成する手法です。",
    image: "https://i.imgur.com/Hw4PIKo.jpeg"
  },
  "動作法": {
    desc: "身体の動きを通じて心身のバランスを整えます。",
    detail: "身体の緊張を緩めたり、正しい姿勢を保つ練習を通して、リラックス感や自己肯定感を高めます。",
    images: ["https://i.imgur.com/SwjfDft.png", "https://i.imgur.com/LqbE9Nf.png"]
  },
  "TEACCH": {
    desc: "構造化された環境で自閉症スペクトラムの子どもを支援します。",
    detail: "物理的構造化（場所の区分け）や視覚的構造化（スケジュールの提示）を行い、見通しを持って安心して活動できるようにします。"
  },
  "マインドフルネス": {
    desc: "今ここに意識を集中し、心の平静を保つ練習です。",
    detail: "呼吸法や瞑想を通じて、注意力を高めたり、感情のコントロールを改善したりします。",
    image: "https://i.imgur.com/zheqhdv.png"
  },
  "統計学的分析方法": {
    desc: "データに基づいて教育実践を客観的に評価します。",
    detail: "t検定や相関分析などの統計手法を用いて、指導の効果や要因を科学的に検証します。",
    isStats: true
  }
};

// 実態対応データ
const STUDENT_CONDITIONS: any = {
  "言葉で気持ちを伝えるのが難しい": ["プレイセラピー", "PECS"],
  "感情のコントロールが苦手": ["CBT（認知行動療法）", "マインドフルネス"],
  "対人関係が苦手": ["ソーシャルスキルトレーニング", "TEACCH"],
  "学習の集中が続かない": ["ABA（応用行動分析）", "感覚統合療法"],
  "行動の問題がある": ["FBA/PBS", "ABA（応用行動分析）"],
  "身体に課題がある": ["動作法"],
  "統計的な分析をしたい": ["統計学的分析方法"]
};

export default function AnalysisPage() {
  // State
  const [showMethodsList, setShowMethodsList] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(Object.keys(STUDENT_CONDITIONS)[0]);
  const [selectedMethodKey, setSelectedMethodKey] = useState<string | null>(null);

  // 選択された詳細データ
  const detailData = selectedMethodKey ? METHODS_DATA[selectedMethodKey] : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <h1 className="text-sm font-bold tracking-widest text-slate-900">MieeL <span className="text-gray-400">APP</span></h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-6xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600 shadow-sm">
            <Activity size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">分析方法</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            教育学や心理学に基づいた分析手法の解説とツールを提供します。<br/>
            日々の実践や研究活動にご活用ください。
          </p>
        </motion.div>

        {/* 推奨ツール (アンケート分析) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 mb-12 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMEND</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">✨ アンケート・統計分析ツール</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Google Formsなどのデータをグラフ化・統計分析できる強力なツールです。<br/>
            研究論文や課題研究に最適です。
          </p>
          <a href="https://annketo12345py-edm3ajzwtsmmuxbm8qbamr.streamlit.app/" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-blue-200">
             <ExternalLink size={18} /> ツールを開く
          </a>
        </motion.div>

        {/* --- 1. 一覧から探す --- */}
        <div className="mb-8">
          <button 
            onClick={() => setShowMethodsList(!showMethodsList)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors shadow-sm group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 text-gray-500 group-hover:text-blue-500 transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="text-lg font-bold text-slate-900">分析方法の一覧から探す</span>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${showMethodsList ? "rotate-90" : ""}`} />
          </button>

          <AnimatePresence>
            {showMethodsList && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {Object.keys(METHODS_DATA).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMethodKey(key)}
                      className={`
                        p-6 rounded-xl border text-left transition-all
                        ${selectedMethodKey === key 
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]" 
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md text-slate-800"}
                      `}
                    >
                      <h4 className="font-bold mb-2 text-sm">{key}</h4>
                      <p className={`text-xs ${selectedMethodKey === key ? "text-blue-100" : "text-gray-500"}`}>
                        {METHODS_DATA[key].desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 2. 実態から探す --- */}
        <div className="mb-12">
          <button 
            onClick={() => setShowConditions(!showConditions)}
            className="w-full flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors shadow-sm group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 text-gray-500 group-hover:text-blue-500 transition-colors">
                <Search size={24} />
              </div>
              <span className="text-lg font-bold text-slate-900">児童・生徒の実態から探す</span>
            </div>
            <ChevronRight className={`text-gray-400 transition-transform ${showConditions ? "rotate-90" : ""}`} />
          </button>

          <AnimatePresence>
            {showConditions && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50 border-x border-b border-gray-200 rounded-b-2xl p-6"
              >
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">実態を選択</label>
                  <select 
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(STUDENT_CONDITIONS).map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-500 mb-3">💡 おすすめの分析法:</p>
                  <div className="flex gap-3 flex-wrap">
                    {STUDENT_CONDITIONS[selectedCondition].map((method: string) => (
                      <button
                        key={method}
                        onClick={() => setSelectedMethodKey(method)}
                        className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-50 hover:border-blue-400 transition-all"
                      >
                        {method} ➡
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 詳細表示エリア (モーダル風) --- */}
        <AnimatePresence>
          {selectedMethodKey && detailData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-2 border-blue-100 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400" />
              
              <div className="mb-8">
                <span className="text-xs font-bold text-blue-500 tracking-widest uppercase mb-2 block">DETAIL</span>
                <h2 className="text-3xl font-black text-slate-900">{selectedMethodKey}</h2>
              </div>

              <div className="prose max-w-none text-gray-700 leading-loose">
                <p className="text-lg font-bold mb-4">{detailData.desc}</p>
                <p>{detailData.detail}</p>
              </div>

              {/* 画像がある場合 */}
              {detailData.image && (
                <div className="mt-8">
                  <img src={detailData.image} alt="image" className="rounded-xl border border-gray-100 shadow-sm max-w-full h-auto" />
                </div>
              )}
              {detailData.images && (
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {detailData.images.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`image-${i}`} className="rounded-xl border border-gray-100 shadow-sm w-full h-auto" />
                  ))}
                </div>
              )}

              {/* ツールへのリンクがある場合 */}
              {detailData.toolUrl && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-blue-900">専用ツールがあります</h4>
                    <p className="text-sm text-blue-700">ブラウザ上で分析を行えるアプリを開きます。</p>
                  </div>
                  <a href={detailData.toolUrl} target="_blank" rel="noopener noreferrer"
                     className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                     ツールを開く
                  </a>
                </div>
              )}

              {/* 統計ツールの特別メニュー */}
              {detailData.isStats && (
                <div className="mt-8">
                  <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">📊 統計分析ツール一覧</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <StatLink title="相関分析" href="https://soukan-jlhkdhkradbnxssy29aqte.streamlit.app/" />
                    <StatLink title="多変量回帰分析" href="https://kaikiapp-tjtcczfvlg2pyhd9bjxwom.streamlit.app/" />
                    <StatLink title="ロジスティック回帰" href="https://rojisthik-buklkg5zeh6oj2gno746ix.streamlit.app/" />
                    <StatLink title="ノンパラメトリック分析" href="https://nonparametoric-nkk2awu6yv9xutzrjmrsxv.streamlit.app/" />
                    <StatLink title="t検定" href="https://tkentei-flhmnqnq6dti6oyy9xnktr.streamlit.app/" />
                  </div>
                </div>
              )}

              <div className="mt-12 text-center">
                <button 
                  onClick={() => setSelectedMethodKey(null)}
                  className="text-gray-400 hover:text-slate-900 text-sm font-bold transition-colors"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 関連リンクフッター */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ExternalLink size={20} /> 関連リンク
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LinkCard title="応用行動分析 (ABA)" href="https://abaapppy-k7um2qki5kggexf8qkfxjc.streamlit.app/" tag="心理" />
            <LinkCard title="機能的行動評価" href="https://kinoukoudou-ptfpnkq3uqgaorabcyzgf2.streamlit.app/" tag="心理" />
          </div>
        </div>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// ==========================================
// 部品
// ==========================================

function LinkCard({ title, href, tag }: { title: string, href: string, tag: string }) {
  return (
    <a 
      href={href} target="_blank" rel="noopener noreferrer"
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">{tag}</span>
        <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
      <h4 className="font-bold text-slate-800">{title}</h4>
    </a>
  );
}

function StatLink({ title, href }: { title: string, href: string }) {
  return (
    <a 
      href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
    >
      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{title}</span>
      <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500" />
    </a>
  );
}