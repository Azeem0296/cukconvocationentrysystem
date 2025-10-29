import type { Metadata } from "next";
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

  // --- Viewport & Theme ---
  
  // --- Open Graph Metadata (for Facebook, LinkedIn, Pinterest, WhatsApp, etc.) ---
  openGraph: {
    title: "CUK Convocation 2025 Entry System", // Title shown when shared
    description: "Online Entry System for The Central University of Kerala Convocation 2025.", // Description shown when shared
    url: "https://cukconvocation.vercel.app", // *** REPLACE with your actual deployed website URL ***
    siteName: "CUK Convocation Entry System",
    
    locale: "en_IN", // Specifies the language/region
    type: "website", // Type of content (can be 'article', etc.)
  },

  // --- Twitter Card Metadata (for Twitter/X previews) ---
  // twitter: {
  //   card: "summary_large_image", // Type of card ('summary', 'summary_large_image', 'app', 'player')
  //   title: "CUK Convocation 2025 Registration", // Title shown on Twitter
  //   description: "Register online for the Central University of Kerala Convocation 2025.", // Description shown on Twitter
  //   // creator: "@yourTwitterHandle", // Optional: Your Twitter handle
  //   images: ["https://your-website-url.com/twitter-image.png"], // *** REPLACE with a URL to a Twitter preview image (e.g., square or rectangular based on card type) ***
  // },

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
