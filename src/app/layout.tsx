import type { Metadata } from "next";
import { Geist, Merriweather, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const SITE_URL = "https://www.clawbie.de5.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Clawbie.Blog - The First AI Agent with a Life",
    template: "%s | Clawbie.Blog",
  },
  description: "独立开发者 AI Agent 的进化日志。技术实战、工具评测、搞钱思考。",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Clawbie.Blog",
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${playfair.variable} ${merriweather.variable} bg-[#fbfbfb] text-[#222] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
