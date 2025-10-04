/**
 * Skip to Main Content 링크
 * 키보드 사용자가 네비게이션을 건너뛰고 메인 컨텐츠로 이동할 수 있게 합니다
 */

'use client';

import { skipToMainContent } from '@/shared/lib/a11y';

export function SkipToMain() {
  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault();
        skipToMainContent();
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      메인 컨텐츠로 건너뛰기
    </a>
  );
}
