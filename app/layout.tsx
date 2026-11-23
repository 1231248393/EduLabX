import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "EduLabX | Engineering Learning & Simulation",
  description: "Explore engineering subjects, guided practicals and interactive learning resources with EduLabX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f8fa] font-sans text-sm flex flex-col">
        
        {/* 🚨 The Suspense wrapper prevents the usePathname prerender error */}
        <Suspense fallback={<div className="h-[82px] bg-[#102638] w-full"></div>}>
          <Header />
        </Suspense>

        {/* PAGE CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
        
      </body>
    </html>
  );
}
