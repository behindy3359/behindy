interface DemoAccount {
  email: string;
  password: string;
  name: string;
}

interface EnvConfig {
  // API URLs
  API_URL: string;
  AI_URL: string;

  // 개발 모드
  DEV_MODE: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';

  // 앱 정보
  APP_NAME: string;
  APP_VERSION: string;

  // 데모 계정
  DEMO_ACCOUNTS: DemoAccount[];
}

// 환경변수 검증 및 파싱 (더 안전한 방식)
function getEnvVar(key: string, defaultValue?: string): string {
  // Next.js 빌드 시점과 런타임 모두 고려
  const value = process.env[key];
    
  if (value !== undefined && value !== '') return value;
  if (defaultValue !== undefined) return defaultValue;
  
  // 환경변수가 없으면 명확한 에러 메시지 출력
  console.error(`Missing required environment variable: ${key}`);
  console.error(`Available NEXT_PUBLIC_ variables:`, 
    Object.keys(process.env)
      .filter(k => k.startsWith('NEXT_PUBLIC_'))
      .reduce((acc, key) => ({ ...acc, [key]: process.env[key] || 'undefined' }), {})
  );
  
  throw new Error(`Missing required environment variable: ${key}`);
}

function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
}

// 환경변수 설정 객체
export const env: EnvConfig = (() => {
  try {
    // Docker 환경에서 사용할 기본값들
    const config = {
      // API URLs
      API_URL: getEnvVar('NEXT_PUBLIC_API_URL', 'https://behindy.me/api'),
      AI_URL: getEnvVar('NEXT_PUBLIC_AI_URL', 'https://behindy.me/ai'),

      // 개발 모드
      DEV_MODE: getBooleanEnv('NEXT_PUBLIC_DEV_MODE', false),
      LOG_LEVEL: (getEnvVar('NEXT_PUBLIC_LOG_LEVEL', 'info') as EnvConfig['LOG_LEVEL']),

      // 앱 정보
      APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Behindy'),
      APP_VERSION: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),

      // 데모 계정
      DEMO_ACCOUNTS: [
        {
          email: getEnvVar('NEXT_PUBLIC_DEMO1_EMAIL', 'demo1@demo.com'),
          password: getEnvVar('NEXT_PUBLIC_DEMO1_PASSWORD', 'Demo123!'),
          name: getEnvVar('NEXT_PUBLIC_DEMO1_NAME', '데모 사용자 1'),
        },
        {
          email: getEnvVar('NEXT_PUBLIC_DEMO2_EMAIL', 'demo2@demo.com'),
          password: getEnvVar('NEXT_PUBLIC_DEMO2_PASSWORD', 'Demo123!'),
          name: getEnvVar('NEXT_PUBLIC_DEMO2_NAME', '데모 사용자 2'),
        },
        {
          email: getEnvVar('NEXT_PUBLIC_DEMO3_EMAIL', 'demo3@demo.com'),
          password: getEnvVar('NEXT_PUBLIC_DEMO3_PASSWORD', 'Demo123!'),
          name: getEnvVar('NEXT_PUBLIC_DEMO3_NAME', '데모 사용자 3'),
        },
      ],
    };

    return config;
  } catch (error) {
    console.error('Failed to load environment configuration:', error);
    throw error;
  }
})();

// 런타임 환경변수 체크 함수 (개발용)
export const debugEnvironment = () => {
  // Removed for production security
};

export default env;