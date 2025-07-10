import { validators } from '@/utils/common/validation';
import type { PasswordStrength } from '../types/types';

export const passwordUtils = {
  calculateStrength: (password: string): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        level: 'very-weak',
        requirements: {
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        },
        messages: ['비밀번호를 입력해주세요.'],
      };
    }

    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    const messages: string[] = [];
    if (!requirements.length) messages.push('8자 이상이어야 합니다');
    if (!requirements.lowercase) messages.push('소문자를 포함해야 합니다');
    if (!requirements.uppercase) messages.push('대문자를 포함해야 합니다');
    if (!requirements.number) messages.push('숫자를 포함해야 합니다');
    if (!requirements.special) messages.push('특수문자를 포함해야 합니다');

    let level: PasswordStrength['level'];
    if (score <= 1) level = 'very-weak';
    else if (score <= 2) level = 'weak';
    else if (score <= 3) level = 'medium';
    else if (score <= 4) level = 'strong';
    else level = 'very-strong';

    return {
      score,
      level,
      requirements,
      messages,
    };
  },

  // 강도 레벨에 따른 색상 반환
  getStrengthColor: (level: PasswordStrength['level']): string => {
    switch (level) {
      case 'very-weak':
      case 'weak':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // amber
      case 'strong':
      case 'very-strong':
        return '#10b981'; // green
      default:
        return '#9ca3af'; // gray
    }
  },

  // 강도 텍스트 반환
  getStrengthText: (level: PasswordStrength['level']): string => {
    switch (level) {
      case 'very-weak':
        return '매우 약함';
      case 'weak':
        return '약함';
      case 'medium':
        return '보통';
      case 'strong':
        return '강함';
      case 'very-strong':
        return '매우 강함';
      default:
        return '알 수 없음';
    }
  },

  // 진행률 퍼센트 계산
  getStrengthPercentage: (score: number): number => {
    return Math.min((score / 5) * 100, 100);
  },

  // 비밀번호 보안 점수 (0-100)
  getSecurityScore: (password: string): number => {
    const validation = validators.password(password);
    return Math.min((validation.score / 5) * 100, 100);
  },

  // 공통 약한 비밀번호 체크
  isCommonPassword: (password: string): boolean => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', '12345678', '111111', '123123', 'admin',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  },

  // 비밀번호 힌트 생성
  generateHints: (password: string): string[] => {
    const hints: string[] = [];
    const strength = passwordUtils.calculateStrength(password);
    
    if (passwordUtils.isCommonPassword(password)) {
      hints.push('🚨 일반적으로 사용되는 비밀번호입니다. 더 복잡한 비밀번호를 사용해주세요.');
    }
    
    if (password.length < 12) {
      hints.push('💡 12자 이상의 비밀번호를 사용하면 더욱 안전합니다.');
    }
    
    if (!/[가-힣]/.test(password) && strength.score >= 4) {
      hints.push('✨ 훌륭한 비밀번호입니다!');
    }
    
    return hints;
  },
};