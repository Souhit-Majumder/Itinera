import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { TripProvider } from "@/components/providers/TripProvider";
import BottomNav from "@/components/navigation/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Itinera | Travel Journey",
  description: "A gamified travel journey application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900 overflow-hidden h-[100dvh]`}>
        <TripProvider>
          <div className="flex h-full w-full">
            <BottomNav />
            <main className="flex-1 h-full w-full md:ml-24 overflow-hidden relative">
              {children}
            </main>
          </div>
        </TripProvider>
      </body>
    </html>
  );
}
