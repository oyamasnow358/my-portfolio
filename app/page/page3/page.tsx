"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, BookOpen, ChevronDown, CheckCircle, List
} from "lucide-react";
import Link from "next/link";

// データをインポート
import { GUIDELINE_DATA } from "./guidelineData";

export default function GuidelinePage() {
  // ステート管理
  const [gakubu, setGakubu] = useState("");
  const [shubetsu, setShubetsu] = useState("");
  const [kyoka, setKyoka] = useState("");
  const [dankai, setDankai] = useState(""); // 知的障害の段階選択用
  const [showResult, setShowResult] = useState(false);

  // 選択肢生成
  const gakubuOptions = Object.keys(GUIDELINE_DATA);
  const shubetsuOptions = gakubu ? Object.keys(GUIDELINE_DATA[gakubu] || {}) : [];
  
  const isChiteki = shubetsu.includes("知的障害");
  const kyokaOptions = (isChiteki && gakubu && shubetsu) 
    ? Object.keys(GUIDELINE_DATA[gakubu][shubetsu] || {}) 
    : [];

  // ハンドラー
  const handleGakubuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGakubu(e.target.value);
    setShubetsu("");
    setKyoka("");
    setDankai("");
    setShowResult(false);
  };

  const handleShubetsuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShubetsu(e.target.value);
    setKyoka("");
    setDankai("");
    setShowResult(false);
  };

  const handleKyokaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setKyoka(e.target.value);
    setDankai(""); // 科目が変わったら段階リセット
    setShowResult(false);
  };

  const handleSearch = () => {
    setShowResult(true);
  };

  // 結果データの取得
  const getResultData = () => {
    if (!gakubu || !shubetsu) return null;
    
    if (isChiteki) {
      if (!kyoka) return null;
      return GUIDELINE_DATA[gakubu][shubetsu][kyoka];
    } else {
      return GUIDELINE_DATA[gakubu][shubetsu];
    }
  };

  const resultData = showResult ? getResultData() : null;

  // 段階のキーを取得（知的障害の場合）
  const getDankaiKeys = () => {
    if (!resultData) return [];
    return Object.keys(resultData).filter(key => key.includes("段階")).sort();
  };

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
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* タイトルエリア */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
            <BookOpen size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">学習指導要領 早引き</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            学部・段階（障害種別）・教科を選択して、<br/>
            学習指導要領の内容をピンポイントで検索できます。
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
            {/* Step 1: 学部 */}
            <SelectBox 
              label="1. 学部を選択" 
              value={gakubu} 
              onChange={handleGakubuChange} 
              options={gakubuOptions}
              placeholder="学部を選択"
              delay={0.3}
            />
            {/* Step 2: 段階（種別） */}
            <SelectBox 
              label="2. 段階(種別)を選択" 
              value={shubetsu} 
              onChange={handleShubetsuChange} 
              options={shubetsuOptions}
              placeholder="種別を選択"
              disabled={!gakubu}
              delay={0.4}
            />
            {/* Step 3: 教科 (知的のみ) */}
            {isChiteki && (
              <SelectBox 
                label="3. 教科を選択" 
                value={kyoka} 
                onChange={handleKyokaChange} 
                options={kyokaOptions}
                placeholder="教科を選択"
                disabled={!shubetsu}
                delay={0.5}
              />
            )}
          </div>

          {/* 検索ボタン */}
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={(!isChiteki && !shubetsu) || (isChiteki && !kyoka)}
              className={`
                group px-10 py-4 rounded-full font-bold text-lg tracking-widest shadow-lg flex items-center gap-3 mx-auto transition-all
                ${((!isChiteki && shubetsu) || (isChiteki && kyoka))
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              <Search size={20} />
              表示する
            </motion.button>
          </div>
        </motion.div>

        {/* 結果表示エリア */}
        <AnimatePresence mode="wait">
          {resultData && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">RESULT</span>
                <h3 className="text-2xl font-bold text-slate-800">
                  {gakubu} - {shubetsu} {isChiteki && `- ${kyoka}`}
                </h3>
              </div>

              {/* --- 知的障害の場合 --- */}
              {isChiteki ? (
                <div className="space-y-8">
                  {/* 目標 */}
                  {resultData["目標"] && (
                    <ResultCard title="🎯 目標" content={resultData["目標"]} delay={0} />
                  )}

                  {/* 段階選択タブ */}
                  {getDankaiKeys().length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-500 mb-4 tracking-widest">段階を選択してください</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {getDankaiKeys().map((key) => (
                          <button
                            key={key}
                            onClick={() => setDankai(key)}
                            className={`
                              px-4 py-2 rounded-lg text-sm font-bold transition-all border
                              ${dankai === key 
                                ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}
                            `}
                          >
                            {key}
                          </button>
                        ))}
                      </div>

                      {/* 段階ごとの内容表示 */}
                      <AnimatePresence mode="wait">
                        {dankai && (
                          <motion.div
                            key={dankai}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                          >
                            <h5 className="text-lg font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">【{dankai}】</h5>
                            {resultData[dankai]["目標"] && (
                              <div className="mb-6">
                                <h6 className="font-bold text-sm text-gray-500 mb-2">目標</h6>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{resultData[dankai]["目標"]}</p>
                              </div>
                            )}
                            {resultData[dankai]["内容"] && (
                              <div>
                                <h6 className="font-bold text-sm text-gray-500 mb-2">内容</h6>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{resultData[dankai]["内容"]}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* その他の項目 (指導計画など) */}
                  {Object.keys(resultData).map((key) => {
                    if (key !== "目標" && !key.includes("段階")) {
                      return (
                        <ResultCard key={key} title={key} content={resultData[key]} delay={0.2} />
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                /* --- 知的障害以外の場合 --- */
                <div className="space-y-6">
                  {resultData["全体"] && (
                    <ResultCard title="全体" content={resultData["全体"]} delay={0} />
                  )}
                  {Object.keys(resultData).map((key, index) => {
                    if (key !== "全体") {
                      return (
                        <ResultCard key={key} title={key} content={resultData[key]} delay={index * 0.1} />
                      );
                    }
                    return null;
                  })}
                </div>
              )}

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

// --- 部品: 結果表示カード ---
function ResultCard({ title, content, delay }: { title: string, content: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <h4 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-gray-100">
        <CheckCircle className="text-blue-500" size={24} />
        {title}
      </h4>
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
        {content}
      </div>
    </motion.div>
  );
}