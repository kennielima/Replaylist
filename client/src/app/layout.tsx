import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import QueryProvider from "@/lib/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Replaylist",
  description: "Music-in-Time",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 text-white font-sans`}
      >
        <QueryProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-purple-600 focus:text-white">
            Skip to main content
          </a>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <footer className="w-full h-8 justify-center items-center flex text-sm py-8 text-slate-300">
            &copy;{new Date().getFullYear()}. Kennielima
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
