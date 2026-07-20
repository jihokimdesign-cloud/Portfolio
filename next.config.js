/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    // 구버전 LePal 케이스가 구글에 인덱싱되어 있음 — 새 케이스로 301
    // (path-to-regexp: 소스의 점은 이스케이프 필요)
    return [
      { source: "/lepal\\.ai-3", destination: "/projects/lepal", permanent: true },
      { source: "/lepal\\.ai-3\\.html", destination: "/projects/lepal", permanent: true },
    ];
  },
};

module.exports = nextConfig;
