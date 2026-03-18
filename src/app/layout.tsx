import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cart from "./_components/cart/Cart";
import ClarityAnalyticsScript from "./lib/scripts/clarity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalkBite",
  description: "Your smart ordering companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#5d3606] h-full p-4`}
      >
        <ClarityAnalyticsScript/>
        <div className="flex h-full rounded-2xl overflow-hidden">
          {children}
          <Cart />
        </div>
      </body>
    </html>
  );
}
