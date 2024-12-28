/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '123.45.67.89'], // IP público do backend
  },
};

export default nextConfig;
