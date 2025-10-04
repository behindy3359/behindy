/**
 * 접근성을 위한 ARIA Live Region 컴포넌트
 * 스크린 리더 사용자에게 동적 컨텐츠 변경을 알립니다
 */

import { srOnlyStyle } from '@/shared/lib/a11y';

export function A11yLiveRegion() {
  return (
    <div
      id="a11y-live-region"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={srOnlyStyle}
    />
  );
}
