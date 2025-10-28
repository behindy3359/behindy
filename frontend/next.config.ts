import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
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
  // 이미지 최적화 강화
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // PoweredBy 헤더 제거 (보안)
  poweredByHeader: false,

  // Webpack 번들 최적화
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // 서버/클라이언트 분리
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // 클라이언트 번들만 최적화 (서버는 기본 설정 유지)
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // React 관련 라이브러리
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // styled-components
            styledComponents: {
              name: 'styled-components',
              test: /[\\/]node_modules[\\/]styled-components[\\/]/,
              priority: 35,
              enforce: true,
            },
            // UI 라이브러리 (lucide-react, framer-motion 등)
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](lucide-react|framer-motion|d3)[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // 기타 vendor 라이브러리
            vendors: {
              name: 'vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // 공통 컴포넌트
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
