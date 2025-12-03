"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Upload, Download, FileText, BarChart2, 
  CheckCircle, PieChart as PieIcon, Calendar, Filter
} from "lucide-react";
import Link from "next/link";
import Papa from "papaparse";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine, Label
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AbaAnalysisPage() {
  // --- State ---
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [yAxisOption, setYAxisOption] = useState("頻度");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- テンプレートデータ ---
  const templateCsv = `ID,日時,対象行動,頻度,持続時間(分),強度,フェーズ,備考
1,2023-10-01 10:00,自傷行為,3,5,4,ベースライン,課題中
2,2023-10-01 14:30,要求行動,5,1,2,ベースライン,おやつの時間
3,2023-10-08 10:15,自傷行為,1,2,2,介入期,支援者が介入
4,2023-10-08 14:45,要求行動,8,1,1,介入期,ジェスチャー使用`;

  // --- ファイル読み込み ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data;
        if (rawData.length > 0) {
          setHeaders(Object.keys(rawData[0] as object));
          
          // 日時でソート & 数値変換
          const processedData = rawData.map((row: any) => ({
            ...row,
            "頻度": Number(row["頻度"]) || 0,
            "持続時間(分)": Number(row["持続時間(分)"]) || 0,
            "強度": Number(row["強度"]) || 0,
            // 日時をDateオブジェクトに変換 (グラフ用)
            timestamp: new Date(row["日時"]).getTime(),
            dateStr: row["日時"]?.split(" ")[0] // YYYY-MM-DD
          })).sort((a: any, b: any) => a.timestamp - b.timestamp);

          setData(processedData);
          
          // 初期設定
          const behaviors = Array.from(new Set(processedData.map((d: any) => d["対象行動"])));
          setSelectedBehaviors(behaviors as string[]);
          if (processedData.length > 0) {
            setStartDate(processedData[0].dateStr);
            setEndDate(processedData[processedData.length - 1].dateStr);
          }
        }
      }
    });
  };

  // --- テンプレートダウンロード ---
  const downloadTemplate = () => {
    const blob = new Blob([templateCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "aba_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- フィルタリング ---
  const filteredData = data.filter(d => {
    const isBehavior = selectedBehaviors.includes(d["対象行動"]);
    const isDate = (!startDate || d.dateStr >= startDate) && (!endDate || d.dateStr <= endDate);
    return isBehavior && isDate;
  });

  // --- グラフ用: フェーズの変わり目検出 ---
  const phaseReferenceLines = [];
  if (filteredData.length > 0) {
    let currentPhase = filteredData[0]["フェーズ"];
    for (let i = 1; i < filteredData.length; i++) {
      if (filteredData[i]["フェーズ"] !== currentPhase) {
        phaseReferenceLines.push({
          x: filteredData[i]["日時"], // X軸の値 (日時文字列)
          label: `「${filteredData[i]["フェーズ"]}」開始`
        });
        currentPhase = filteredData[i]["フェーズ"];
      }
    }
  }

  // --- サマリー計算 ---
  const totalCount = filteredData.reduce((sum, d) => sum + (d["頻度"] || 0), 0);
  const totalDuration = filteredData.reduce((sum, d) => sum + (d["持続時間(分)"] || 0), 0);
  const avgIntensity = filteredData.length > 0 
    ? (filteredData.reduce((sum, d) => sum + (d["強度"] || 0), 0) / filteredData.length).toFixed(2) 
    : "0";
  
  // 円グラフデータ
  const pieData = selectedBehaviors.map(b => ({
    name: b,
    value: filteredData.filter(d => d["対象行動"] === b).length
  })).filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
      
      {/* 背景 */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="w-full h-[120%] -mt-[10%] bg-[url('https://i.imgur.com/AbUxfxP.png')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ヘッダー */}
      <header className="fixed w-full top-0 left-0 p-6 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm tracking-widest">BACK TO TOP</span>
          </Link>
          <h1 className="text-sm font-bold tracking-widest text-slate-900">MieeL <span className="text-gray-400">APP</span></h1>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-6 text-indigo-600">
            <BarChart2 size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">応用行動分析 (ABA) データ可視化</h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            行動データを時系列で可視化し、介入の効果を分析します。<br/>
            CSVファイルをアップロードしてスタートしてください。
          </p>
        </motion.div>

        {/* アップロード & テンプレート */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
              <Download size={20} className="text-indigo-500"/> 1. テンプレート入手
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              初めての方はテンプレートをダウンロードし、データを入力してください。1行目は変更しないでください。
            </p>
            <button onClick={downloadTemplate} className="w-full py-3 border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              CSVテンプレートをダウンロード
            </button>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
              <Upload size={20} className="text-indigo-500"/> 2. データ読み込み
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition-colors text-indigo-400 hover:text-indigo-600"
            >
              <FileText size={32} className="mb-2" />
              <span className="text-sm font-bold">クリックしてCSVを選択</span>
            </div>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            {data.length > 0 && (
              <p className="text-center text-xs font-bold text-green-600 mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={14}/> {data.length}件のデータを読み込みました
              </p>
            )}
          </div>
        </div>

        {data.length > 0 && (
          <>
            {/* フィルタリング設定 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 mb-12 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-800">
                <Filter size={20} className="text-indigo-500"/> 分析条件の設定
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">対象行動</label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(data.map(d => d["対象行動"]))).map((b: any) => (
                      <button
                        key={b}
                        onClick={() => {
                          if (selectedBehaviors.includes(b)) {
                            setSelectedBehaviors(selectedBehaviors.filter(item => item !== b));
                          } else {
                            setSelectedBehaviors([...selectedBehaviors, b]);
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          selectedBehaviors.includes(b) 
                            ? "bg-indigo-600 text-white border-indigo-600" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">分析期間</label>
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <span className="text-gray-400">〜</span>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 p-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* グラフエリア */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* 時系列グラフ (メイン) */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">時系列推移</h3>
                  <select 
                    value={yAxisOption} 
                    onChange={(e) => setYAxisOption(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 cursor-pointer"
                  >
                    <option value="頻度">頻度</option>
                    <option value="持続時間(分)">持続時間(分)</option>
                    <option value="強度">強度</option>
                  </select>
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="日時" tick={{fontSize: 10, fill: "#94a3b8"}} />
                      <YAxis tick={{fontSize: 10, fill: "#94a3b8"}} />
                      <RechartsTooltip 
                        contentStyle={{backgroundColor: "#fff", borderRadius: "10px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"}}
                      />
                      <Legend />
                      {selectedBehaviors.map((b, i) => (
                        <Line 
                          key={b} 
                          type="monotone" 
                          dataKey={yAxisOption} 
                          data={filteredData.filter(d => d["対象行動"] === b)}
                          name={b} 
                          stroke={COLORS[i % COLORS.length]} 
                          strokeWidth={3}
                          dot={{r: 4, strokeWidth: 2, fill: "#fff"}}
                          connectNulls
                        />
                      ))}
                      {/* フェーズ変更線 */}
                      {phaseReferenceLines.map((line, i) => (
                        <ReferenceLine key={i} x={line.x} stroke="#94a3b8" strokeDasharray="3 3">
                          <Label value={line.label} position="top" fontSize={10} fill="#64748b" />
                        </ReferenceLine>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 円グラフ & サマリー */}
              <div className="space-y-8">
                {/* 円グラフ */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm h-[300px]">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                    <PieIcon size={20} className="text-indigo-500"/> 発生割合
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="40%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 数値サマリー */}
                <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-lg">
                  <h3 className="font-bold text-lg mb-6 opacity-90">Total Summary</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-indigo-300 uppercase tracking-wider mb-1">総頻度</div>
                      <div className="text-3xl font-black">{totalCount} <span className="text-sm font-normal opacity-70">回</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-indigo-300 uppercase tracking-wider mb-1">総時間</div>
                      <div className="text-3xl font-black">{totalDuration} <span className="text-sm font-normal opacity-70">分</span></div>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-indigo-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-200">平均強度</span>
                        <span className="text-2xl font-bold">{avgIntensity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* レポートエリア */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 shadow-inner">
              <h3 className="font-bold text-xl mb-6 text-slate-900 flex items-center gap-2">
                <FileText size={24} className="text-indigo-500"/> 分析レポート (自動生成)
              </h3>
              <div className="font-mono text-sm bg-white p-6 rounded-xl border border-gray-200 text-gray-600 leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto">
{`【応用行動分析レポート】
分析期間: ${startDate} ～ ${endDate}
分析対象: ${selectedBehaviors.join(", ")}
--------------------------------------

■ 全体サマリー
- 総データ数: ${filteredData.length}件
- 総頻度: ${totalCount}回
- 平均強度: ${avgIntensity}

（ここに考察を追記してください...）
`}
              </div>
              <div className="mt-4 text-right">
                <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                  レポートをコピー
                </button>
              </div>
            </div>
          </>
        )}

      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-xs">
        &copy; 2025 MieeL Project. All Rights Reserved.
      </footer>
    </div>
  );
}