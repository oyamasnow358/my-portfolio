"use client"; // クライアント側で動くことを宣言（アニメーションに必要）
import { motion } from "framer-motion"; // アニメーションの道具を使う

export default function Home() {
  // 動きの設定（下からふわっと出てくる）
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen border-x border-gray-800 max-w-6xl mx-auto font-sans">
      
      {/* --- ヘッダー（上のメニュー） --- */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">MY PORTFOLIO</h1>
        <nav>
          <ul className="flex gap-6 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Work</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </nav>
      </header>

      {/* --- メインエリア（大きな文字） --- */}
      <main>
        <section className="py-32 px-6 border-b border-gray-800">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h2 className="text-6xl md:text-8xl font-bold leading-tight">
              Simple.<br />
              Creative.<br />
              Impact.
            </h2>
            <p className="mt-8 text-gray-400 max-w-md">
              Next.jsとTailwind CSSで作った、シンプルで動きのあるポートフォリオサイトです。
            </p>
          </motion.div>
        </section>

        {/* --- 作品リスト（グリッド） --- */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          {/* 作品1 */}
          <motion.div 
            className="aspect-square border-b md:border-r border-gray-800 p-10 flex flex-col justify-between hover:bg-gray-900 transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-500">01</span>
            <h3 className="text-3xl font-bold">Web Design</h3>
          </motion.div>

          {/* 作品2 */}
          <motion.div 
            className="aspect-square border-b border-gray-800 p-10 flex flex-col justify-between hover:bg-gray-900 transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-gray-500">02</span>
            <h3 className="text-3xl font-bold">App Development</h3>
          </motion.div>

          {/* 作品3 */}
          <motion.div 
            className="aspect-square border-b md:border-r border-gray-800 p-10 flex flex-col justify-between hover:bg-gray-900 transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gray-500">03</span>
            <h3 className="text-3xl font-bold">Graphic Art</h3>
          </motion.div>

          {/* 作品4 */}
          <motion.div 
            className="aspect-square border-b border-gray-800 p-10 flex flex-col justify-between hover:bg-gray-900 transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-gray-500">04</span>
            <h3 className="text-3xl font-bold">Photography</h3>
          </motion.div>
        </section>
      </main>

      {/* --- フッター（一番下） --- */}
      <footer className="p-6 text-center text-gray-600 text-sm">
        © 2025 My Portfolio
      </footer>
    </div>
  );
}