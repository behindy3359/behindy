interface EnvConfig {
    // API URLs
    API_URL: string;
    AI_URL: string;
    
    // 개발 모드
    DEV_MODE: boolean;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
    
    // 토큰 관리
    TOKEN_KEY: string;
    REFRESH_TOKEN_KEY: string;
    
    // 앱 정보
    APP_NAME: string;
    APP_VERSION: string;
  }
  
  // 환경변수 검증 및 파싱
  function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
  
  function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }
  
  // 환경변수 설정 객체
  export const env: EnvConfig = {
    // API URLs
    API_URL: getEnvVar('NEXT_PUBLIC_API_URL'),
    AI_URL: getEnvVar('NEXT_PUBLIC_AI_URL'),
    
    // 개발 모드
    DEV_MODE: getBooleanEnv('NEXT_PUBLIC_DEV_MODE', true),
    LOG_LEVEL: (getEnvVar('NEXT_PUBLIC_LOG_LEVEL') as EnvConfig['LOG_LEVEL']),
    
    // 토큰 관리
    TOKEN_KEY: getEnvVar('NEXT_PUBLIC_TOKEN_KEY'),
    REFRESH_TOKEN_KEY: getEnvVar('NEXT_PUBLIC_REFRESH_TOKEN_KEY'),
    
    // 앱 정보
    APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME'),
    APP_VERSION: getEnvVar('NEXT_PUBLIC_APP_VERSION'),
  };
  
  // 개발용 환경변수 출력 (프로덕션에서는 제외)
  if (env.DEV_MODE && typeof window !== 'undefined') {
    console.log('🔧 Environment Config:', {
      API_URL: env.API_URL,
      AI_URL: env.AI_URL,
      DEV_MODE: env.DEV_MODE,
      LOG_LEVEL: env.LOG_LEVEL,
      APP_VERSION: env.APP_VERSION,
    });
  }
  
  export default env;