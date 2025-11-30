"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function FeedbackPage() {
  const [tab, setTab] = useState<"ms" | "google">("ms");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* 背景パララックス */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-8 z-40 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-5xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6 text-blue-600">
            <MessageSquare size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">FEEDBACK</h1>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            アプリの改善や、新しい指導実践の共有など、皆様からのご意見をお待ちしています。<br/>
            お使いのアカウントに合わせてフォームを選択してください。
          </p>
        </motion.div>

        {/* タブ切り替え */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setTab("ms")}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
              tab === "ms" 
                ? "bg-blue-600 text-white border-blue-500 shadow-lg" 
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Microsoft Forms
          </button>
          <button 
            onClick={() => setTab("google")}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${
              tab === "google" 
                ? "bg-green-600 text-white border-green-500 shadow-lg" 
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Google Forms
          </button>
        </div>

        {/* フォーム埋め込み */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl overflow-hidden h-[800px] w-full border border-gray-200 shadow-2xl"
        >
          {tab === "ms" ? (
            <iframe 
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAANa6zUxUQjRFQ1NRUFhJODhKVFMzUkdVVzVCR0JEVS4u&embed=true"
              className="w-full h-full border-none"
              allowFullScreen
            />
          ) : (
            <iframe 
              src="https://docs.google.com/forms/d/1xXzq0vJ9E5FX16CFNoTzg5VAyX6eWsuN8Xl5qEwJFTc/viewform?embedded=true"
              className="w-full h-full border-none"
            />
          )}
        </motion.div>

      </main>
    </div>
  );
}