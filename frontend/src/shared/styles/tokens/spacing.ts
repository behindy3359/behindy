// 간격 토큰 시스템
export const spacing = {
  // 기본 간격 (rem 단위)
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2,5rem',
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
} as const;

// 컴포넌트별 간격 프리셋
export const componentSpacing = {
  // 카드 내부 간격
  card: {
    padding: spacing[6],
    gap: spacing[4],
  },
  
  // 버튼 간격
  button: {
    sm: {
      padding: `${spacing[2]} ${spacing[4]}`,
      gap: spacing[2],
    },
    md: {
      padding: `${spacing[2]} ${spacing[6]}`,
      gap: spacing[2],
    },
    lg: {
      padding: `${spacing[4]} ${spacing[8]}`,
      gap: spacing[3],
    },
  },
  
  // 입력 필드 간격
  input: {
    sm: {
      padding: `${spacing[2]} ${spacing[4]}`,
      height: '2.25rem',
    },
    md: {
      padding: `${spacing[2]} ${spacing[4]}`,
      height: '2.5rem',
    },
    lg: {
      padding: `${spacing[4]} ${spacing[4]}`,
      height: '3rem',
    },
  },
  
  // 폼 간격
  form: {
    fieldGap: spacing[6],
    sectionGap: spacing[8],
  },
  
  // 레이아웃 간격
  layout: {
    pageMargin: spacing[6],
    sectionGap: spacing[8],
    cardGap: spacing[6],
  }
} as const;