import { describe, it, expect } from 'vitest';
import { validators } from '../validation';

describe('validators', () => {
  describe('email', () => {
    it('should validate correct email format', () => {
      const result = validators.email('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty email', () => {
      const result = validators.email('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이메일을 입력해주세요.');
    });

    it('should reject invalid email format', () => {
      const result = validators.email('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('올바른 이메일 형식이 아닙니다.');
    });

    it('should reject email with Korean characters', () => {
      const result = validators.email('한글@example.com');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이메일에는 한글을 사용할 수 없습니다.');
    });

    it('should normalize and validate email', () => {
      const result = validators.email('  TEST@EXAMPLE.COM  ');
      expect(result.isValid).toBe(true);
    });

    it('should reject email without domain', () => {
      const result = validators.email('test@');
      expect(result.isValid).toBe(false);
    });

    it('should reject email without @', () => {
      const result = validators.email('testexample.com');
      expect(result.isValid).toBe(false);
    });
  });

  describe('password', () => {
    it('should validate strong password', () => {
      const result = validators.password('Test123!@#');
      expect(result.isValid).toBe(true);
      expect(result.score).toBe(5);
      expect(result.strength).toBe('strong');
    });

    it('should handle empty password', () => {
      const result = validators.password('');
      expect(result.isValid).toBe(false);
      expect(result.score).toBe(0);
      expect(result.messages).toContain('비밀번호를 입력해주세요.');
      expect(result.strength).toBe('very-weak');
    });

    it('should require minimum 8 characters', () => {
      const result = validators.password('Test1!');
      expect(result.messages).toContain('8자 이상이어야 합니다.');
    });

    it('should require lowercase', () => {
      const result = validators.password('TEST123!@#');
      expect(result.messages).toContain('소문자를 포함해야 합니다.');
    });

    it('should require uppercase', () => {
      const result = validators.password('test123!@#');
      expect(result.messages).toContain('대문자를 포함해야 합니다.');
    });

    it('should require number', () => {
      const result = validators.password('TestTest!@#');
      expect(result.messages).toContain('숫자를 포함해야 합니다.');
    });

    it('should require special character', () => {
      const result = validators.password('Test1234');
      expect(result.messages).toContain('특수문자를 포함해야 합니다.');
    });

    it('should calculate correct strength level', () => {
      expect(validators.password('test').strength).toBe('very-weak');
      expect(validators.password('test12').strength).toBe('very-weak');
      expect(validators.password('test12A').strength).toBe('weak');
      expect(validators.password('test12A!').strength).toBe('medium');
      expect(validators.password('Test12!@').strength).toBe('strong');
    });
  });

  describe('name', () => {
    it('should validate correct name', () => {
      const result = validators.name('홍길동');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty name', () => {
      const result = validators.name('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름을 입력해주세요.');
    });

    it('should require minimum 2 characters', () => {
      const result = validators.name('홍');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 2자 이상이어야 합니다.');
    });

    it('should limit maximum 50 characters', () => {
      const result = validators.name('가'.repeat(51));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름은 50자 이하여야 합니다.');
    });

    it('should accept Korean characters', () => {
      const result = validators.name('김철수');
      expect(result.isValid).toBe(true);
    });

    it('should accept English characters', () => {
      const result = validators.name('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('should reject numbers', () => {
      const result = validators.name('홍길동123');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('이름에는 한글, 영문, 공백만 사용 가능합니다.');
    });

    it('should reject special characters', () => {
      const result = validators.name('홍길동!@#');
      expect(result.isValid).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = validators.name('  홍길동  ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('passwordConfirm', () => {
    it('should validate matching passwords', () => {
      const result = validators.passwordConfirm('Test123!@#', 'Test123!@#');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty confirmation', () => {
      const result = validators.passwordConfirm('Test123!@#', '');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호 확인을 입력해주세요.');
    });

    it('should reject mismatched passwords', () => {
      const result = validators.passwordConfirm('Test123!@#', 'Different123!@#');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('비밀번호가 일치하지 않습니다.');
    });
  });

  describe('postTitle', () => {
    it('should validate correct title', () => {
      const result = validators.postTitle('테스트 제목');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty title', () => {
      const result = validators.postTitle('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목을 입력해주세요.');
    });

    it('should require minimum 2 characters', () => {
      const result = validators.postTitle('제');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목은 2자 이상이어야 합니다.');
    });

    it('should limit maximum 100 characters', () => {
      const result = validators.postTitle('가'.repeat(101));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목은 100자 이하여야 합니다.');
    });

    it('should trim whitespace', () => {
      const result = validators.postTitle('  테스트 제목  ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('postContent', () => {
    it('should validate correct content', () => {
      const result = validators.postContent('테스트 내용입니다. 충분한 길이의 내용.');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty content', () => {
      const result = validators.postContent('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('내용을 입력해주세요.');
    });

    it('should require minimum 10 characters', () => {
      const result = validators.postContent('짧은내용');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('내용은 10자 이상이어야 합니다.');
    });

    it('should limit maximum 5000 characters', () => {
      const result = validators.postContent('가'.repeat(5001));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('내용은 5000자 이하여야 합니다.');
    });
  });

  describe('commentContent', () => {
    it('should validate correct comment', () => {
      const result = validators.commentContent('좋은 글입니다.');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty comment', () => {
      const result = validators.commentContent('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('댓글 내용을 입력해주세요.');
    });

    it('should require minimum 2 characters', () => {
      const result = validators.commentContent('좋');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('댓글은 2자 이상이어야 합니다.');
    });

    it('should limit maximum 1000 characters', () => {
      const result = validators.commentContent('가'.repeat(1001));
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('댓글은 1000자 이하여야 합니다.');
    });
  });
});
