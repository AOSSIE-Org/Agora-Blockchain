/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination:
          "https://agora-blockchain-production.up.railway.app/api/chat", // Proxy to Flask Backend
      },
    ];
  },
};

export default nextConfig;
