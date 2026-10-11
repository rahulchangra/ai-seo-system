import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Autonomous AI SEO SaaS | Self-Executing Search Optimization",
  description:
    "Production-grade Autonomous AI SEO Platform that crawls, audits, plans, and executes verified search engine optimizations via code patches and CMS integrations.",
  keywords: [
    "autonomous seo",
    "ai seo agent",
    "technical seo audit",
    "search engine optimization",
    "seo automation",
  ],
  authors: [{ name: "AI SEO Systems Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
