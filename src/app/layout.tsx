import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import { GeistMono } from "geist/font";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Monda, Outfit } from "next/font/google";
import { PageProvider } from "@/components/common/PageContext";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import { FetchRetryInitializer } from "@/components/common/FetchRetryInitializer";

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
        <FetchRetryInitializer />
        <PageProvider>
          {children}
          <Toaster />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </PageProvider>
      </body>
    </html>
  );
}
