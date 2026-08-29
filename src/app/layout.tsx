import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BugRadar — Cyber Detective HQ",
  description: "Every Bug Leaves a Trace. AI-powered collaborative bug tracking and investigation workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased bg-[#050816] text-[#F8FAFC] min-h-screen flex flex-col`}
      >
        <Navbar />
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto cyber-grid">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
