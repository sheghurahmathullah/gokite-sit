import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import { GeistMono } from "geist/font";
import "./globals.css";
import { Monda, Outfit } from "next/font/google";
import { PageProvider } from "@/components/common/PageContext";
import { Toaster } from "@/components/ui/toaster";

const monda = Monda({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-monda",
  display: "swap",
});

const outfit = Outfit({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoKite",
  description: "Book your entire trip in one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${monda.variable} ${outfit.variable}`}>
      <body>
        <PageProvider>
          {children}
          <Toaster />
        </PageProvider>
      </body>
    </html>
  );
}
