/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@combat-sports/ui", "@combat-sports/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufc.com",
      },
      {
        protocol: "https",
        hostname: "**.onefc.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

module.exports = nextConfig;
