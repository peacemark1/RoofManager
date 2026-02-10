/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disablePreloading: false
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'cloudinary.com', 'via.placeholder.com']
  }
};

module.exports = withPWA(nextConfig);
