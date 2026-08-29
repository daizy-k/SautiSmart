/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode to highlight potential problems in development
  reactStrictMode: true,
  // Expose backend API URL to client bundle (overridden by client/.env.local if present)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
};

module.exports = nextConfig;
