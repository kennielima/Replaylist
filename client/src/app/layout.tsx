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
  title: "Replaylist: Track Your Spotify Playlists Over Time",
  description: "Replaylist takes snapshots of your Spotify playlists over time, so you can look back and rediscover the songs that defined every moment",
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
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased bg-[#111009] text-white font-sans`} //080d1a
      >
        <QueryProvider>
          {/* <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-purple-600 focus:text-white">
            Skip to main content
          </a> */}
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="mt-auto flex w-full items-center justify-center py-8 text-sm text-slate-300">
            &copy;{new Date().getFullYear()}. Kennielima
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
