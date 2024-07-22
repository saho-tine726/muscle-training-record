import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const source_code_pro = Noto_Sans_JP({
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "muscle-training-record",
  description: "Next.js14とprismaを使用した筋トレ記録アプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="font-noto-sans-jp">
      <body className="bg-gradient-to-r from-purple-500 to-red-500 break-words">
        <Header />
        {children}
      </body>
    </html>
  );
}
