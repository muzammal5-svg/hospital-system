/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
