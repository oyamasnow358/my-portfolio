"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, CheckCircle, BookOpen, 
  Lightbulb, ChevronDown, ImageIcon
} from "lucide-react";
import Link from "next/link";

// 別のファイルからデータをインポート
import { GUIDANCE_DATA } from "./guidanceData";

export default function GuidancePage() {
  // ステート管理
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState<any>(null);

  // 選択肢の生成
  const categories = Object.keys(GUIDANCE_DATA);
  const subcategories = category ? Object.keys(GUIDANCE_DATA[category] || {}) : [];
  const details = (category && subcategory) ? Object.keys(GUIDANCE_DATA[category][subcategory] || {}) : [];

  // ハンドラー
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setSubcategory("");
    setDetail("");
    setResult(null);
  };

  const handleSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubcategory(e.target.value);
    setDetail("");
    setResult(null);
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDetail(e.target.value);
    setResult(null);
  };

  const handleSearch = () => {
    if (category && subcategory && detail) {
      setResult(GUIDANCE_DATA[category][subcategory][detail]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
      
      {/* 背景パララックス (トップページと統一) */}
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
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
            <Search size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">指導支援内容 検索</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            お子さんの実態や困りごとに応じて、具体的な指導・支援のアイデアを検索できます。<br/>
            3つのステップで項目を選択してください。
          </p>
        </motion.div>

        {/* 検索フォームエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <SelectBox 
              label="STEP 1. カテゴリー" 
              value={category} 
              onChange={handleCategoryChange} 
              options={categories}
              placeholder="カテゴリーを選択"
              delay={0.3}
            />
            {/* Step 2 */}
            <SelectBox 
              label="STEP 2. 項目" 
              value={subcategory} 
              onChange={handleSubChange} 
              options={subcategories}
              placeholder="項目を選択"
              disabled={!category}
              delay={0.4}
            />
            {/* Step 3 */}
            <SelectBox 
              label="STEP 3. 詳細" 
              value={detail} 
              onChange={handleDetailChange} 
              options={details}
              placeholder="詳細を選択"
              disabled={!subcategory}
              delay={0.5}
            />
          </div>

          {/* 検索ボタン */}
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={!detail}
              className={`
                group px-10 py-4 rounded-full font-bold text-lg tracking-widest shadow-lg flex items-center gap-3 mx-auto transition-all
                ${detail 
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              <Lightbulb size={20} className={detail ? "text-yellow-300 fill-yellow-300" : ""} />
              表示する
            </motion.button>
          </div>
        </motion.div>

        {/* 結果表示エリア */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={detail} // キーが変わるたびにアニメーション
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-gray-200 shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="bg-slate-900 text-white p-8 md:px-12 flex items-center gap-4">
                <BookOpen className="text-blue-400" size={32} />
                <div>
                  <p className="text-xs text-blue-400 font-bold tracking-widest mb-1">RESULT</p>
                  <h3 className="text-2xl md:text-3xl font-bold">「{detail}」への指導・支援</h3>
                </div>
              </div>

              <div className="p-8 md:p-12">
                
                {/* テキストコンテンツ */}
                <div className="space-y-6">
                  {result.items && result.items.map((item: any, i: number) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-gray-50 border border-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow"
                    >
                      {typeof item === 'string' ? (
                        <div className="flex gap-4 items-start">
                          <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
                          <p className="text-lg text-slate-800 leading-relaxed">{item}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex gap-4 items-center mb-3">
                            <CheckCircle className="text-blue-500 shrink-0" size={20} />
                            <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                          </div>
                          <ul className="pl-12 space-y-2 list-disc text-gray-600">
                            {item.details.map((d: string, j: number) => (
                              <li key={j}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* 画像エリア */}
                {result.image && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 pt-12 border-t border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-6 text-gray-500 font-bold">
                      <ImageIcon size={20} />
                      <h4>関連教材・イメージ</h4>
                    </div>
                    <figure className="bg-gray-100 rounded-2xl overflow-hidden max-w-2xl mx-auto border border-gray-200">
                      <img src={result.image.url} alt={result.image.caption} className="w-full h-auto object-cover" />
                      <figcaption className="p-4 text-center text-sm text-gray-500 bg-white border-t border-gray-100">
                        {result.image.caption}
                      </figcaption>
                    </figure>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}

// --- 部品: カスタムセレクトボックス ---
function SelectBox({ label, value, onChange, options, placeholder, disabled, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      className={`relative ${disabled ? "opacity-50" : "opacity-100"}`}
    >
      <label className="block text-xs font-bold text-blue-600 tracking-widest mb-3 uppercase">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
            w-full appearance-none bg-white border border-gray-200 
            text-slate-900 text-lg p-4 rounded-xl shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:cursor-not-allowed cursor-pointer
            transition-all group-hover:border-blue-300
          "
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
          <ChevronDown size={20} />
        </div>
      </div>
    </motion.div>
  );
}