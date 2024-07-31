import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";



export const metadata: Metadata = {
  title: "Rankings comparator",
  description: "Rankings comparator is a website which can compare the rankings of two differents players",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <link rel="icon" href="/ballon.png" />
      <body className={GeistSans.className}>{children} <Analytics /></body>
    </html>
  );
}
