/**
 * 중앙화된 로깅 유틸리티
 *
 * - 개발 환경에서만 로그 출력
 * - 프로덕션 환경에서는 error만 출력
 * - 향후 외부 로깅 서비스 통합 가능
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  /**
   * 디버그 로그 (개발 환경에서만)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * 정보 로그 (개발 환경에서만)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * 경고 로그 (개발 환경에서만)
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.warn(`[WARN] ${message}`, context || '');
    }
  }

  /**
   * 에러 로그 (모든 환경에서 출력)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isTest) return;

    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    console.error(`[ERROR] ${message}`, {
      error: errorDetails,
      ...context
    });

    // 프로덕션에서는 외부 에러 트래킹 서비스로 전송 가능
    // if (!this.isDevelopment) {
    //   sendToErrorTracking(message, error, context);
    // }
  }

  /**
   * API 요청/응답 로그
   */
  api(method: string, url: string, status?: number, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      const statusEmoji = status && status >= 400 ? '❌' : '✅';
      console.log(
        `[API] ${statusEmoji} ${method.toUpperCase()} ${url}`,
        status ? `(${status})` : '',
        context || ''
      );
    }
  }

  /**
   * 성능 측정 시작
   */
  time(label: string): void {
    if (this.isDevelopment && !this.isTest) {
      console.time(label);
    }
  }

  /**
   * 성능 측정 종료
   */
  timeEnd(label: string): void {
    if (this.isDevelopment && !this.isTest) {
      console.timeEnd(label);
    }
  }

  /**
   * 그룹 로그 시작
   */
  group(label: string): void {
    if (this.isDevelopment && !this.isTest) {
      console.group(label);
    }
  }

  /**
   * 그룹 로그 종료
   */
  groupEnd(): void {
    if (this.isDevelopment && !this.isTest) {
      console.groupEnd();
    }
  }
}

export const logger = new Logger();
