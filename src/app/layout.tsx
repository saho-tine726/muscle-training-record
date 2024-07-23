"use client";

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { RecoilRoot } from "recoil";

const notoSansJP = Noto_Sans_JP({
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`font-noto-sans-jp ${notoSansJP.variable}`}>
      <body className="bg-gradient-to-r from-purple-500 to-red-500 break-words">
        <RecoilRoot>
          <Header />
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
