import './globals.css';
import { ReactNode } from 'react';
// ★追加: SpeedInsightsをインポート
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        {/* ★追加: ここに配置します */}
        <SpeedInsights />
      </body>
    </html>
  );
}