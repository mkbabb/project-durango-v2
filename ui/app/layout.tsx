import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Durango (beta)",
  description: "Locally hosted code interpreter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/icon.png" />
      </head>
      <body className={inter.className + " h-screen"}>{children}</body>
    </html>
  );
}
