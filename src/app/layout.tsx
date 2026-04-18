
import type { Metadata } from "next";
import { Syne, Manrope, Space_Grotesk, Bricolage_Grotesque, Archivo_Black, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Clean, geometric, contemporary sans
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tinarra Studio | Custom 3D Printing & Products",
  description: "Creative 3D printing studio offering custom 3D prints, high-quality keychains, and modeling services.",
};

import CustomCursor from "@/components/common/CustomCursor/CustomCursor";
import LenisProvider from "@/components/layout/LenisProvider/LenisProvider";
import Preloader from "@/components/common/Preloader/Preloader";
import CustomScrollbar from "@/components/ui/CustomScrollbar/CustomScrollbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${jakarta.variable}`}>
      <body>
        <Preloader />
        <div className="noise-overlay"></div>
        <CustomCursor />
        <CustomScrollbar />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
