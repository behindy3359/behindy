/**
 * 접근성(Accessibility) 유틸리티
 * WCAG 2.1 AA 준수를 위한 헬퍼 함수들
 */

/**
 * 스크린 리더 전용 텍스트를 위한 CSS 클래스
 */
export const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

/**
 * 키보드 네비게이션을 위한 Enter/Space 키 핸들러
 */
export const handleKeyboardClick = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * 포커스 트랩을 위한 포커스 가능한 요소 선택자
 */
export const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * 모달/다이얼로그 등에서 포커스 트랩 설정
 */
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(FOCUSABLE_ELEMENTS);
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // cleanup 함수 반환
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * ARIA 라이브 리전 공지
 */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const liveRegion = document.getElementById('a11y-live-region');
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    // 메시지를 읽은 후 클리어
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
};

/**
 * Skip to main content 링크를 위한 메인 컨텐츠로 스크롤
 */
export const skipToMainContent = () => {
  const main = document.querySelector('main');
  if (main) {
    main.focus();
    main.scrollIntoView({ behavior: 'smooth' });
  }
};
