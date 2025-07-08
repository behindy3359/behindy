/**
 * 검증 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * 비밀번호 강도 결과 타입
 */
export interface PasswordStrengthResult extends ValidationResult {
  score: number;
  messages: string[];
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
}

// 검증 유틸리티
export const validators = {
  // 이메일 검증
  email: (email: string): ValidationResult => {
    if (!email || email.trim() === '') {
      return { isValid: false, message: '이메일을 입력해주세요.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!emailRegex.test(normalizedEmail)) {
      return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
    }

    if (/[가-힣]/.test(normalizedEmail)) {
      return { isValid: false, message: '이메일에는 한글을 사용할 수 없습니다.' };
    }

    return { isValid: true };
  },

  // 비밀번호 강도 검증
  password: (password: string): PasswordStrengthResult => {
    const messages: string[] = [];
    let score = 0;

    if (!password) {
      return {
        isValid: false,
        score: 0,
        messages: ['비밀번호를 입력해주세요.'],
        strength: 'very-weak'
      };
    }

    // 길이 검사
    if (password.length >= 8) {
      score += 1;
    } else {
      messages.push('8자 이상이어야 합니다.');
    }

    // 소문자 포함
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      messages.push('소문자를 포함해야 합니다.');
    }

    // 대문자 포함
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      messages.push('대문자를 포함해야 합니다.');
    }

    // 숫자 포함
    if (/\d/.test(password)) {
      score += 1;
    } else {
      messages.push('숫자를 포함해야 합니다.');
    }

    // 특수문자 포함
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      messages.push('특수문자를 포함해야 합니다.');
    }

    // 강도 계산
    let strength: PasswordStrengthResult['strength'];
    if (score <= 2) strength = 'very-weak';
    else if (score <= 3) strength = 'weak';
    else if (score <= 4) strength = 'medium';
    else strength = 'strong';

    return {
      isValid: score >= 4,
      score,
      messages,
      strength
    };
  },

  // 이름 검증
  name: (name: string): ValidationResult => {
    if (!name || name.trim() === '') {
      return { isValid: false, message: '이름을 입력해주세요.' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return { isValid: false, message: '이름은 2자 이상이어야 합니다.' };
    }

    if (trimmedName.length > 50) {
      return { isValid: false, message: '이름은 50자 이하여야 합니다.' };
    }

    if (!/^[가-힣a-zA-Z\s]+$/.test(trimmedName)) {
      return { isValid: false, message: '이름에는 한글, 영문, 공백만 사용 가능합니다.' };
    }

    return { isValid: true };
  },

  // 비밀번호 확인 검증
  passwordConfirm: (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
      return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
    }

    return { isValid: true };
  },

  // 게시글 제목 검증
  postTitle: (title: string): ValidationResult => {
    if (!title || title.trim() === '') {
      return { isValid: false, message: '제목을 입력해주세요.' };
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      return { isValid: false, message: '제목은 2자 이상이어야 합니다.' };
    }

    if (trimmedTitle.length > 100) {
      return { isValid: false, message: '제목은 100자 이하여야 합니다.' };
    }

    return { isValid: true };
  },

  // 게시글 내용 검증
  postContent: (content: string): ValidationResult => {
    if (!content || content.trim() === '') {
      return { isValid: false, message: '내용을 입력해주세요.' };
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length < 10) {
      return { isValid: false, message: '내용은 10자 이상이어야 합니다.' };
    }

    if (trimmedContent.length > 5000) {
      return { isValid: false, message: '내용은 5000자 이하여야 합니다.' };
    }

    return { isValid: true };
  },

  // 댓글 내용 검증
  commentContent: (content: string): ValidationResult => {
    if (!content || content.trim() === '') {
      return { isValid: false, message: '댓글 내용을 입력해주세요.' };
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length < 2) {
      return { isValid: false, message: '댓글은 2자 이상이어야 합니다.' };
    }

    if (trimmedContent.length > 1000) {
      return { isValid: false, message: '댓글은 1000자 이하여야 합니다.' };
    }

    return { isValid: true };
  },
};