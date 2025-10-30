import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // --- Basic Metadata ---
  title: "Central University of Kerala Convocation 2025", // Title in browser tab & search results
  description: "Entry System for Convocation 2025 of The Central University of Kerala .", // Search result snippet
  keywords: ["CUK", "Central University of Kerala", "Convocation", "Registration", "Graduation", "Kerala", "University"], // Keywords for SEO (less critical now but still useful)
  applicationName: "CUK Convocation Entry System", // Name for installed web apps
  manifest: "/manifest.json",

  // --- Open Graph Metadata (for Facebook, LinkedIn, Pinterest, WhatsApp, etc.) ---
  openGraph: {
    title: "CUK Convocation 2025 Entry System", // Title shown when shared
    description: "Online Entry System for The Central University of Kerala Convocation 2025.", // Description shown when shared
    url: "https://cukconvocation.vercel.app", // *** REPLACE with your actual deployed website URL ***
    siteName: "CUK Convocation Entry System",

    locale: "en_IN", // Specifies the language/region
    type: "website", // Type of content (can be 'article', etc.)
  },


  // --- Icons ---
  icons: {
    icon: "/favicon.ico", // Standard favicon
    apple: "/apple-touch-icon.png", // Icon for Apple devices
    // shortcut: '/shortcut-icon.png' // You can add other icon types
  },

  // --- Other potentially useful tags ---
  robots: { // Controls search engine indexing (defaults are usually fine)
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


// ADD this new const for Viewport
export const viewport: Viewport = {
  themeColor: "#000000", // <-- ADD themeColor here
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
