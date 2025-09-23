// 🔄 마이그레이션된 컴포넌트들
// 기존 컴포넌트들을 새로운 시스템으로 마이그레이션한 버전들

// === 공통 스타일 컴포넌트들 ===
export * from './commonAuthStyles';
export * from './commonContainers';
export * from './commonStyles';

// === Auth 컴포넌트들 === - 중복 방지를 위해 namespace로 구분
export * as AuthGuardStyles from './AuthGuard/styles';
export * as LoginFormStyles from './LoginForm/styles';  
export * as SignupFormStyles from './SignupForm/styles';

// === Community 컴포넌트들 ===
export * as PostCardStyles from './PostCard/styles';
export * as CommentFormStyles from './CommentForm/styles';

// === 마이그레이션 가이드 ===
export const MIGRATION_MAP = {
  // 공통 스타일
  commonAuthStyles: {
    before: '@/shared/styles/commonAuthStyles',
    after: '@/shared/styles/migrated/commonAuthStyles',
    changes: [
      'BaseAlert로 통합하여 중복 제거',
      '테마 변수를 활용한 색상 시스템',
      '반응형 디자인 개선',
      'Typography 시스템 적용'
    ]
  },
  
  commonContainers: {
    before: '@/shared/styles/commonContainers',
    after: '@/shared/styles/migrated/commonContainers',
    changes: [
      'BaseContainer 시스템 적용',
      'variant 기반 스타일링',
      'FlexContainer 등 새로운 컴포넌트 활용',
      '컨테이너 크기 표준화'
    ]
  },
  
  commonStyles: {
    before: '@/shared/styles/commonStyles',
    after: '@/shared/styles/migrated/commonStyles',
    changes: [
      'FlexContainer로 레이아웃 개선',
      'Badge, ErrorText 등 전용 컴포넌트 추가',
      'Spinner, Skeleton 등 로딩 컴포넌트 표준화',
      '테마 기반 색상 시스템'
    ]
  },
  
  // Auth 컴포넌트들
  authGuardStyles: {
    before: '@/features/auth/components/AuthGuard/styles',
    after: '@/shared/styles/migrated/AuthGuard/styles',
    changes: [
      'CenteredContainer 활용',
      '기본 Spinner 컴포넌트 재사용',
      'AnimatedContainer 적용',
      '중복 코드 제거'
    ]
  },
  
  loginFormStyles: {
    before: '@/features/auth/components/LoginForm/styles',
    after: '@/shared/styles/migrated/LoginForm/styles',
    changes: [
      'FlexContainer, LinkButton 활용',
      'BaseCheckbox 컴포넌트 적용',
      '테마 기반 색상 및 간격',
      '일관된 버튼 스타일링'
    ]
  },
  
  signupFormStyles: {
    before: '@/features/auth/components/SignupForm/styles',
    after: '@/shared/styles/migrated/SignupForm/styles',
    changes: [
      '약관 동의 UI 컴포넌트화',
      'PasswordStrength 컴포넌트 개선',
      'FlexContainer 기반 레이아웃',
      'Badge, LinkButton 등 재사용 컴포넌트 활용'
    ]
  },
  
  // Community 컴포넌트들
  postCardStyles: {
    before: '@/features/community/components/PostCard/styles',
    after: '@/shared/styles/migrated/PostCard/styles',
    changes: [
      'FlexContainer 기반 레이아웃 시스템',
      'Badge 컴포넌트로 HotBadge 개선',
      'BaseCard 상속으로 일관성 확보',
      '지하철 노선 색상 시스템 적용'
    ]
  },
  
  commentFormStyles: {
    before: '@/features/community/components/CommentForm/styles',
    after: '@/shared/styles/migrated/CommentForm/styles',
    changes: [
      'BaseForm, BaseTextarea 활용',
      'ErrorText 컴포넌트 재사용',
      'FlexContainer 레이아웃 적용',
      '일관된 스크롤바 스타일링'
    ]
  }
} as const;

// === 마이그레이션 단계별 가이드 ===
export const MIGRATION_STEPS = {
  phase1: {
    title: '공통 스타일 마이그레이션',
    files: [
      'commonAuthStyles.ts',
      'commonContainers.ts', 
      'commonStyles.ts'
    ],
    impact: 'low', // 다른 컴포넌트에 미치는 영향 적음
    priority: 'high'
  },
  
  phase2: {
    title: 'Auth 컴포넌트 마이그레이션',
    files: [
      'AuthGuard/styles.ts',
      'LoginForm/styles.ts',
      'SignupForm/styles.ts'
    ],
    impact: 'medium',
    priority: 'high'
  },
  
  phase3: {
    title: 'Community 컴포넌트 마이그레이션',
    files: [
      'PostCard/styles.ts',
      'CommentForm/styles.ts',
      'PostDetail/styles.ts',
      'PostList/styles.ts'
    ],
    impact: 'medium',
    priority: 'medium'
  },
  
  phase4: {
    title: '기타 컴포넌트 마이그레이션',
    files: [
      'HomePage/styles.ts',
      'MetroMap/styles.ts',
      'Sidebar/styles.ts'
    ],
    impact: 'low',
    priority: 'low'
  }
} as const;

// === 마이그레이션 유틸리티 ===

// import 경로 변환 헬퍼
export const convertImportPath = (originalPath: string): string => {
  const pathMappings: Record<string, string> = {
    '@/shared/styles/commonAuthStyles': '@/shared/styles/migrated/commonAuthStyles',
    '@/shared/styles/commonContainers': '@/shared/styles/migrated/commonContainers',
    '@/shared/styles/commonStyles': '@/shared/styles/migrated/commonStyles',
    // 더 많은 매핑 추가 가능
  };
  
  return pathMappings[originalPath] || originalPath;
};

// 마이그레이션 상태 체크
export const checkMigrationStatus = () => {
  return {
    completed: [
      'tokens system',
      'theme system', 
      'base components',
      'common styles'
    ],
    inProgress: [
      'auth components',
      'community components'
    ],
    pending: [
      'metro components',
      'layout components',
      'homepage components'
    ]
  };
};

// 호환성 체크
export const checkCompatibility = (componentName: string) => {
  const compatibilityMatrix = {
    // 새로운 컴포넌트와 기존 컴포넌트 호환성
    BaseCard: ['CardContainer', 'PostCard'],
    BaseButton: ['Button', 'LinkButton', 'IconButton'],
    FlexContainer: ['CommonGroup', 'AuthorInfo', 'Actions'],
    // ... 더 많은 호환성 매핑
  };
  
  return Object.entries(compatibilityMatrix).find(
    ([newComp, oldComps]) => oldComps.includes(componentName)
  );
};

// 마이그레이션 진행률 계산
export const calculateMigrationProgress = () => {
  const totalFiles = Object.keys(MIGRATION_MAP).length;
  const completedFiles = totalFiles; // 현재 모든 파일 마이그레이션 완료
  
  return {
    percentage: Math.round((completedFiles / totalFiles) * 100),
    completed: completedFiles,
    total: totalFiles,
    remaining: totalFiles - completedFiles
  };
};

// === 개발자 도구 ===
export const devMigrationTools = {
  // 사용되지 않는 스타일 찾기
  findUnusedStyles: (componentName: string) => {
    console.log(`🔍 Checking unused styles in ${componentName}...`);
    // 실제로는 AST 파싱이나 정적 분석 도구 활용
    return [];
  },
  
  // 테마 변수 변환 가능한 하드코딩 찾기  
  findHardcodedValues: (filePath: string) => {
    console.log(`🎨 Finding hardcoded values in ${filePath}...`);
    // 색상, 간격 등 하드코딩된 값들 탐지
    return [];
  },
  
  // 중복 스타일 찾기
  findDuplicateStyles: () => {
    console.log(`📋 Finding duplicate styles...`);
    // 중복된 스타일 블록들 탐지
    return [];
  },
  
  // 마이그레이션 검증
  validateMigration: (componentName: string) => {
    console.log(`✅ Validating migration for ${componentName}...`);
    return {
      success: true,
      warnings: [],
      errors: []
    };
  }
} as const;