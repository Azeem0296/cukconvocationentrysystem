import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the service worker
  register: true, // Register the service worker
  skipWaiting: true, // Install new service worker immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
