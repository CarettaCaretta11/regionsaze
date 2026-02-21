import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rayonlarımız - Azərbaycan Xəritə Oyunu",
  description: "Qonşu rayonları seçərək başlanğıcdan sona gedin!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
