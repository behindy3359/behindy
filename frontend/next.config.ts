const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  compiler: {
    styledComponents: true,
    // Remove unused code
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 번들 최적화 설정
  experimental: {
    optimizePackageImports: ['lucide-react', 'd3', 'framer-motion', '@tanstack/react-query'],
  },
  // 압축 활성화
  compress: true,
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // PoweredBy 헤더 제거
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);
