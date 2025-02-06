"use client";

import "./globals.css"
import type { Metadata } from "next"
import { Poppins, Fira_Code, Lato } from "next/font/google"
import Navbar from "./components/Navbar"
import { useEffect, useState } from "react"
import AIChat from "./components/AIChat"; // Import AI Chat component
import LogRocket from 'logrocket'; // Import LogRocket
import Image from 'next/image';
import Link from 'next/link';

// Initialize LogRocket
LogRocket.init('prashaants-portfolio/coding-portfolio');

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-lato",
})

declare global {
  interface Window {
    Calendly: any;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/logo.png" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SWVC9FLSKP"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SWVC9FLSKP');
          `,
        }} />
      </head>

      <body className={`${poppins.variable} ${firaCode.variable} ${lato.variable} font-sans`}>
        <Navbar />
        <div className="app-layout">
          <div className="content-wrapper">
            <main className="main-content">
              {children}
            </main>

            {!isMobile && ( // Check if not on mobile
              <aside className="ai-chat">
                <AIChat />
              </aside>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <Link href="/">
          <a className="flex items-center">
            <Image
              src="/images/logo.png" // Path to your logo image
              alt="Website Logo"
              width={40} // Adjust width as needed
              height={40} // Adjust height as needed
            />
            <span className="ml-2 text-xl font-bold text-gray-900">Prashaant Ranganathan</span>
          </a>
        </Link>
      </div>
    </header>
  );
}

