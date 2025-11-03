/** @type {import('next').NextConfig} */

// 1. Import withPWA
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// 2. Your regular Next.js config
const nextConfig = {
  reactStrictMode: true,
  // ... any other config you have
};

// 3. Wrap your config with withPWA
module.exports = withPWA(nextConfig);