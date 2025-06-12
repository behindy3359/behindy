  // ============================================================================
  // API 응답 래퍼 타입들 (API Wrapper Types)
  // ============================================================================
  import { FieldError } from "../auth/authFormValidate";
  
  /**
   * 인증 API 성공 응답
   */
  export interface AuthApiSuccess<T = any> {
    success: true;
    data: T;
    message?: string;
  }
  
  /**
   * 인증 API 에러 응답
   */
  export interface AuthApiError {
    success: false;
    error: string;
    message: string;
    statusCode: number;
    fields?: FieldError[];
  }
  
  /**
   * 인증 API 응답 (성공 또는 실패)
   */
  export type AuthApiResponse<T = any> = AuthApiSuccess<T> | AuthApiError;