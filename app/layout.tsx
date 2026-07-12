import type { Metadata } from "next";
import { Outfit, Inter, Playfair_Display, Orbitron } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

const squadHeavy = localFont({
  src: "../public/fonts/squad-heavy.woff2",
  variable: "--font-squad-heavy",
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
      className={`${outfit.variable} ${inter.variable} ${playfair.variable} ${squadHeavy.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-dark-bg text-white">{children}</body>
    </html>
  );
}
