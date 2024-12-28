/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http', 
        hostname: 'localhost', 
        port: '', 
      },
      {
        protocol: 'http', 
        hostname: '123.45.67.89', 
        port: '', 
      },
    ],
  },
};

export default nextConfig;
