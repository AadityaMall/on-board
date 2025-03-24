import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Main/Layout/Navbar";

export const metadata: Metadata = {
  title: "Onboard - flight booking",
  description: "Onboard is a flight booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-main"></div>
          <div className="absolute inset-0 bg-white opacity-[0.5]" />
          <div className="relative">
            <Navbar />
            {children}
          </div>
        </div>

  );
}
