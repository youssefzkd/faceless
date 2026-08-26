import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-phone-number-input/style.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema de canal faceless",
  description: "Recibe gratis el sistema de canal faceless en menos de 60 segundos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
