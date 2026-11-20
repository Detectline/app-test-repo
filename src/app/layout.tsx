import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const display = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});
const body = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Detectline Demo Shop",
  description: "Detectline QA ajanı testleri için örnek Türkçe e-ticaret mağazası.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
