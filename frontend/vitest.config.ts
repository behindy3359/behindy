import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/dist/**',
        '**/.next/**',
        'coverage/**',
        '**/public/**',
        '**/app/**',  // App Router 페이지 제외
        '**/test-utils/**',  // 테스트 유틸리티 제외
      ],
      all: true,
      // 커버리지 전략:
      // - API 함수(axiosConfig, TokenManager)만 단위 테스트 (목표: 90%+)
      // - UI/UX 로직은 브라우저 수동 테스트
      // - 임계값 제한 없음 (점진적 개선)
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
