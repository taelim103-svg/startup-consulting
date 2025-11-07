import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "창업 컨설팅 - 당신의 성공적인 창업을 위한 파트너",
  description: "상권 분석부터 예산 계획까지, AI 기반 맞춤형 창업 컨설팅 서비스",
  keywords: "창업, 컨설팅, 상권분석, 소자본창업, 프랜차이즈, 카페창업",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}

