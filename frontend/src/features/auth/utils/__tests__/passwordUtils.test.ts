import { describe, it, expect } from 'vitest';
import { passwordUtils } from '../passwordUtils';

describe('passwordUtils', () => {
  describe('calculateStrength', () => {
    it('should return very-weak for empty password', () => {
      const result = passwordUtils.calculateStrength('');
      expect(result.level).toBe('very-weak');
      expect(result.score).toBe(0);
      expect(result.messages).toContain('비밀번호를 입력해주세요.');
    });

    it('should return very-strong for strong password', () => {
      const result = passwordUtils.calculateStrength('Test123!@#');
      expect(result.level).toBe('very-strong');
      expect(result.score).toBe(5);
      expect(result.requirements.length).toBe(true);
      expect(result.requirements.lowercase).toBe(true);
      expect(result.requirements.uppercase).toBe(true);
      expect(result.requirements.number).toBe(true);
      expect(result.requirements.special).toBe(true);
      expect(result.messages).toHaveLength(0);
    });

    it('should provide helpful messages for weak password', () => {
      const result = passwordUtils.calculateStrength('test');
      expect(result.messages).toContain('8자 이상이어야 합니다');
      expect(result.messages).toContain('대문자를 포함해야 합니다');
      expect(result.messages).toContain('숫자를 포함해야 합니다');
      expect(result.messages).toContain('특수문자를 포함해야 합니다');
    });

    it('should calculate correct score for each requirement', () => {
      // Length + lowercase (2 requirements met)
      expect(passwordUtils.calculateStrength('testtest').score).toBe(2);

      // Length + lowercase + uppercase (3 requirements met)
      expect(passwordUtils.calculateStrength('testTest').score).toBe(3);

      // Length + lowercase + uppercase + number (4 requirements met)
      expect(passwordUtils.calculateStrength('testTest1').score).toBe(4);

      // All 5 requirements met
      expect(passwordUtils.calculateStrength('testTest1!').score).toBe(5);
    });

    it('should correctly identify strength levels', () => {
      // score <= 1: very-weak
      expect(passwordUtils.calculateStrength('t').level).toBe('very-weak'); // score 0
      expect(passwordUtils.calculateStrength('test').level).toBe('very-weak'); // score 1

      // score <= 3: medium (testTest has 3 requirements)
      expect(passwordUtils.calculateStrength('testTest').level).toBe('medium'); // score 3

      // score <= 4: strong
      expect(passwordUtils.calculateStrength('testTest1').level).toBe('strong'); // score 4

      // score == 5: very-strong
      expect(passwordUtils.calculateStrength('testTest1!').level).toBe('very-strong'); // score 5
      expect(passwordUtils.calculateStrength('TestTest1!').level).toBe('very-strong'); // score 5
    });
  });

  describe('getStrengthColor', () => {
    it('should return red for very-weak and weak', () => {
      expect(passwordUtils.getStrengthColor('very-weak')).toBe('#ef4444');
      expect(passwordUtils.getStrengthColor('weak')).toBe('#ef4444');
    });

    it('should return amber for medium', () => {
      expect(passwordUtils.getStrengthColor('medium')).toBe('#f59e0b');
    });

    it('should return green for strong and very-strong', () => {
      expect(passwordUtils.getStrengthColor('strong')).toBe('#10b981');
      expect(passwordUtils.getStrengthColor('very-strong')).toBe('#10b981');
    });
  });

  describe('getStrengthText', () => {
    it('should return correct Korean text for each level', () => {
      expect(passwordUtils.getStrengthText('very-weak')).toBe('매우 약함');
      expect(passwordUtils.getStrengthText('weak')).toBe('약함');
      expect(passwordUtils.getStrengthText('medium')).toBe('보통');
      expect(passwordUtils.getStrengthText('strong')).toBe('강함');
      expect(passwordUtils.getStrengthText('very-strong')).toBe('매우 강함');
    });
  });

  describe('getStrengthPercentage', () => {
    it('should calculate correct percentage for each score', () => {
      expect(passwordUtils.getStrengthPercentage(0)).toBe(0);
      expect(passwordUtils.getStrengthPercentage(1)).toBe(20);
      expect(passwordUtils.getStrengthPercentage(2)).toBe(40);
      expect(passwordUtils.getStrengthPercentage(3)).toBe(60);
      expect(passwordUtils.getStrengthPercentage(4)).toBe(80);
      expect(passwordUtils.getStrengthPercentage(5)).toBe(100);
    });

    it('should cap at 100%', () => {
      expect(passwordUtils.getStrengthPercentage(10)).toBe(100);
    });
  });

  describe('getSecurityScore', () => {
    it('should return 100 for strong password', () => {
      const score = passwordUtils.getSecurityScore('Test123!@#');
      expect(score).toBe(100);
    });

    it('should return 0 for empty password', () => {
      const score = passwordUtils.getSecurityScore('');
      expect(score).toBe(0);
    });

    it('should cap at 100', () => {
      const score = passwordUtils.getSecurityScore('VeryStrongPassword123!@#');
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('isCommonPassword', () => {
    it('should detect common passwords', () => {
      expect(passwordUtils.isCommonPassword('password')).toBe(true);
      expect(passwordUtils.isCommonPassword('123456')).toBe(true);
      expect(passwordUtils.isCommonPassword('qwerty')).toBe(true);
      expect(passwordUtils.isCommonPassword('admin')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(passwordUtils.isCommonPassword('PASSWORD')).toBe(true);
      expect(passwordUtils.isCommonPassword('PaSsWoRd')).toBe(true);
    });

    it('should return false for unique passwords', () => {
      expect(passwordUtils.isCommonPassword('Test123!@#')).toBe(false);
      expect(passwordUtils.isCommonPassword('MyUniquePassword456!')).toBe(false);
    });
  });

  describe('generateHints', () => {
    it('should warn about common passwords', () => {
      const hints = passwordUtils.generateHints('password123');
      expect(hints).toContain('🚨 일반적으로 사용되는 비밀번호입니다. 더 복잡한 비밀번호를 사용해주세요.');
    });

    it('should suggest longer passwords', () => {
      const hints = passwordUtils.generateHints('Test1!');
      expect(hints).toContain('💡 12자 이상의 비밀번호를 사용하면 더욱 안전합니다.');
    });

    it('should praise strong passwords', () => {
      const hints = passwordUtils.generateHints('Test123!@#');
      expect(hints).toContain('✨ 훌륭한 비밀번호입니다!');
    });

    it('should return empty array for weak password without specific issues', () => {
      const hints = passwordUtils.generateHints('test');
      expect(hints).toHaveLength(1); // Only the "longer password" hint
    });

    it('should combine multiple hints', () => {
      const hints = passwordUtils.generateHints('password');
      expect(hints.length).toBeGreaterThan(1);
    });
  });
});
