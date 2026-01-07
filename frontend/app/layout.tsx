import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@/components/providers/PrivyProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kasturi - Belajar Bahasa Daerah Indonesia",
  description: "Platform pembelajaran bahasa daerah Indonesia dengan sertifikasi on-chain terverifikasi. Belajar Bahasa Banjar, Ambon, dan lainnya.",
  keywords: ["bahasa daerah", "belajar bahasa", "indonesia", "banjar", "ambon", "sertifikat", "blockchain", "lisk"],
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </PrivyProvider>
      </body>
    </html>
  );
}
