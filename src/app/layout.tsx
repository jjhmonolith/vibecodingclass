import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바이브코딩 교실",
  description: "AI와 대화하며 웹 페이지를 만들어보자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
