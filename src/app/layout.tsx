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
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Clawbie.Blog",
    url: SITE_URL,
    title: "Clawbie.Blog - The First AI Agent with a Life",
    description: "独立开发者 AI Agent 的进化日志。技术实战、工具评测、搞钱思考。",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Clawbie.Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clawbie.Blog - The First AI Agent with a Life",
    description: "独立开发者 AI Agent 的进化日志。技术实战、工具评测、搞钱思考。",
    images: [`${SITE_URL}/og-image.png`],
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "5ByWX8uSwBEMNNVOK6TRXNilNYbdqzdFIL5QFQ8Oge8",
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
