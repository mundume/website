import "../styles/globals.css";

import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../public/fonts/cal-sans-semibold.woff2",
  weight: "600",
  display: "swap",
  variable: "--font-cal-sans",
});

export const metadata: Metadata = {
  title: "Apalis - background task and message processing library for Rust",
  description:
    "Simple, extensible multithreaded background task and message processing library for Rust",
  openGraph: {
    images: "/images/og.png",
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`relative ${inter.variable} ${calSans.variable}`}
      suppressHydrationWarning
    >
      <body className="relative overflow-x-hidden antialiased font-light bg-white dark:bg-[#09090B] text-zinc-700 dark:text-zinc-300">
        <Providers>
          {children}
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
