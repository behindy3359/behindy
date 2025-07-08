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
}

// 환경변수 검증 및 파싱 (더 안전한 방식)
function getEnvVar(key: string, defaultValue?: string): string {
  // Next.js 빌드 시점과 런타임 모두 고려
  const value = process.env[key];
    
  if (value !== undefined && value !== '') return value;
  if (defaultValue !== undefined) return defaultValue;
  
  // 환경변수가 없으면 명확한 에러 메시지 출력
  console.error(`❌ Missing required environment variable: ${key}`);
  console.error(`🔍 Available NEXT_PUBLIC_ variables:`, 
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
    console.log('🔧 Loading environment variables...');
    
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
    };
    
    console.log('✅ Environment configuration loaded successfully');
    console.log('🔧 Config summary:', {
      API_URL: config.API_URL,
      AI_URL: config.AI_URL,
      DEV_MODE: config.DEV_MODE,
      APP_NAME: config.APP_NAME,
      APP_VERSION: config.APP_VERSION,
    });
    
    return config;
  } catch (error) {
    console.error('💥 Failed to load environment configuration:', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Environment Debug Information');
      console.log('Current working directory:', process.cwd());
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('NEXT_PUBLIC_ variables only:', 
        Object.entries(process.env)
          .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      );
      console.groupEnd();
    }
    
    throw error;
  }
})();

// 런타임 환경변수 체크 함수
export const debugEnvironment = () => {
  if (typeof window !== 'undefined') {
    console.group('🔍 Client-side Environment Debug');
    console.log('window.location:', window.location.href);
    console.log('Available NEXT_PUBLIC_ vars:', 
      Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
    );
    Object.entries(process.env)
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
      .forEach(([key, value]) => {
        console.log(`${key}:`, value || '❌ undefined');
      });
    console.groupEnd();
  } else {
    console.log('🖥️ Server-side environment check - all variables available');
  }
};

// 개발용 환경변수 출력
if (env.DEV_MODE && typeof window !== 'undefined') {
  debugEnvironment();
}

export default env;