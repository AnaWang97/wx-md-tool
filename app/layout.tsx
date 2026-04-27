import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "微信公众号 Markdown 转换工具",
  description: "将 Markdown 转换为精美的微信公众号图文排版",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
