/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http', // ou 'https' dependendo do seu servidor
        hostname: 'localhost', // IP ou domínio do backend
        port: '', // se aplicável, caso esteja usando uma porta diferente
      },
      {
        protocol: 'http', // ou 'https'
        hostname: '123.45.67.89', // IP público do backend
        port: '', // se necessário
      },
    ],
  },
};

export default nextConfig;
