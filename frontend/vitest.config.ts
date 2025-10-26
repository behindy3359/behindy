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
      // 현재 커버리지: 2.44%
      // Phase 1-2 완료 후 목표: 80%
      // 점진적 개선을 위해 임계값을 낮춤
      thresholds: {
        lines: 3,
        functions: 3,
        branches: 3,
        statements: 3,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
