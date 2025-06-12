  // ============================================================================
  // 폼 검증 타입들 (Form Validation Types)
  // ============================================================================
  
  /**
   * 폼 필드 에러
   */
  export interface FieldError {
    field: string;
    message: string;
    code?: string;
  }
  
  /**
   * 로그인 폼 검증 에러
   */
  export interface LoginFormErrors {
    email?: string;
    password?: string;
    general?: string;
  }
  
  /**
   * 회원가입 폼 검증 에러
   */
  export interface SignupFormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }
  
  /**
   * 비밀번호 변경 폼 검증 에러
   */
  export interface ChangePasswordFormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }
  