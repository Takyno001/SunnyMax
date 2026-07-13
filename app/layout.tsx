import type { Metadata } from "next";
import { Outfit, Inter, Playfair_Display, Orbitron } from "next/font/google";

import "./globals.css";
import ScrollToTop from "./components/ScrollToTop";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Truong Nguyen - Thiết Bị Điện & Giải Pháp Smart Home",
  description: "Trang web portfolio giới thiệu sản phẩm thiết bị điện chất lượng cao và giải pháp cơ điện thông minh từ kỹ sư Truong Nguyen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${outfit.variable} ${inter.variable} ${playfair.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-dark-bg text-white">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
