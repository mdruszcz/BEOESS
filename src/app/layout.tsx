import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bibliothèque des rapports et analyses — Service d'Études | SPF Finances",
  description:
    "Accédez à l'ensemble des rapports, analyses et publications réalisés par le Service d'Études du SPF Finances.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
