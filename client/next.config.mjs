/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  async rewrites() {
    return [
      {
        source: "/flask-api/:path*",
        destination: "http://127.0.0.1:5328/:path*", // Proxy to Flask Backend
      },
    ];
  },
};

export default nextConfig;
