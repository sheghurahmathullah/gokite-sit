"use client";
import { HelmetProvider } from "react-helmet-async";

export default function SEOHelmetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HelmetProvider>{children}</HelmetProvider>;
}
