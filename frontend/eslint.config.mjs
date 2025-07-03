import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // ============================================================================
      // 개발 단계에서 완화할 규칙들
      // ============================================================================
      
      // 사용하지 않는 변수/import - OFF (아키텍처 우선 개발)
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // any 타입 사용 - WARN (급한 개발 시 허용, 나중에 정리)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // 빈 객체 타입 - OFF (유틸리티 타입에서 자주 사용)
      "@typescript-eslint/no-empty-object-type": "off",
      
      // React Hook 의존성 - WARN (개발 완료 후 정리)
      "react-hooks/exhaustive-deps": "warn",
      
      // ============================================================================
      // 유지할 중요한 규칙들 (버그 방지)
      // ============================================================================
      
      // 실제 에러를 방지하는 규칙들은 유지
      "no-console": "off",                              // console.log 허용 (개발 중)
      "@typescript-eslint/no-non-null-assertion": "warn", // ! 사용 경고
      "@typescript-eslint/prefer-as-const": "warn",       // as const 권장
      
      // ============================================================================
      // Next.js 특화 규칙들 유지
      // ============================================================================
      
      // Next.js 이미지 최적화
      "@next/next/no-img-element": "warn",
      
      // Next.js Link 컴포넌트 사용 권장
      "@next/next/no-html-link-for-pages": "warn",
      
      // ============================================================================
      // 스타일/포맷팅 관련 (코드 일관성)
      // ============================================================================
      
      // 세미콜론 사용 (prettier와 충돌 방지)
      "semi": "off",
      "@typescript-eslint/semi": "off",
      
      // 따옴표 스타일
      "quotes": "off",
      "@typescript-eslint/quotes": "off",
    }
  },
  
  // ============================================================================
  // 파일별 개별 설정
  // ============================================================================
  
  {
    // 타입 정의 파일들은 더 관대하게
    files: ["src/types/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    }
  },
  {
    // 스토어 파일들 (개발 중이므로 관대하게)
    files: ["src/store/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
    }
  },
  {
    // 설정 파일들
    files: ["src/config/**/*.ts", "src/utils/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    }
  },
  {
    // 컴포넌트 파일들 (좀 더 엄격하게)
    files: ["src/components/**/*.tsx", "src/app/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",  // 컴포넌트에서는 경고
      "react-hooks/exhaustive-deps": "warn",
    }
  }
];

export default eslintConfig;