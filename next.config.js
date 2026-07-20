/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // experimental: { images: { allowFutureImage: true } },
  async redirects() {
    // 구버전 LePal 케이스가 구글에 인덱싱되어 있음 — 새 케이스로 301
    return [
      { source: "/lepal.ai-3", destination: "/projects/lepal", permanent: true },
      { source: "/lepal.ai-3.html", destination: "/projects/lepal", permanent: true },
      { source: "/lepal.ai-3/:path*", destination: "/projects/lepal", permanent: true },
    ];
  },
};

module.exports = nextConfig;
