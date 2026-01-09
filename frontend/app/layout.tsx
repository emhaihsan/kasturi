import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@/components/providers/PrivyProvider";
import { AuthSync } from "@/components/auth/AuthSync";
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
  title: "Kasturi - Learn Indonesian Regional Languages",
  description:
    "A learning platform for Indonesian regional languages with verifiable on-chain certification. Learn Banjar, Ambon, and more.",
  keywords: [
    "regional languages",
    "language learning",
    "Indonesia",
    "Banjar",
    "Ambon",
    "certificate",
    "blockchain",
    "Lisk",
  ],
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
          <AuthSync>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
          </AuthSync>
        </PrivyProvider>
      </body>
    </html>
  );
}
