import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CodeStart – Aprenda a Programar",
    template: "%s | CodeStart",
  },
  description:
    "Plataforma interativa para desenvolvedores iniciantes aprenderem programação através de desafios práticos, com testes automáticos e ranking global.",
  keywords: ["programação", "aprender", "desafios", "código", "javascript", "iniciante"],
  openGraph: {
    title: "CodeStart – Aprenda a Programar",
    description: "Resolva desafios, ganhe pontos e suba no ranking!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#2a2a3a] py-6 text-center text-sm text-slate-500">
            <p>
              © 2024 <span className="text-green-400">CodeStart</span> · Feito com 💚 para desenvolvedores iniciantes
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
