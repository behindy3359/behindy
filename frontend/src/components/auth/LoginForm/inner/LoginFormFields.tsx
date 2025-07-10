import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input/Input';
import { DemoLoginSection } from './DemoLoginSection';
import type { LoginFormFieldsProps } from '../../types';

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  formData,
  errors,
  onChange,
  onBlur,
  disabled = false,
  showDemoLogin = true,
  onDemoLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* 데모 로그인 섹션 */}
      {showDemoLogin && onDemoLogin && (
        <DemoLoginSection 
          onDemoLogin={onDemoLogin}
          disabled={disabled}
        />
      )}

      {/* 이메일 필드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          type="email"
          label="이메일"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          leftIcon={<Mail size={20} />}
          error={errors.email}
          disabled={disabled}
          fullWidth
          autoComplete="email"
          autoFocus
        />
      </motion.div>

      {/* 비밀번호 필드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Input
          type={showPassword ? 'text' : 'password'}
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          onBlur={() => onBlur('password')}
          leftIcon={<Lock size={20} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              disabled={disabled}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          error={errors.password}
          disabled={disabled}
          fullWidth
          autoComplete="current-password"
        />
      </motion.div>

      {/* 옵션들 */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* 로그인 상태 유지 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => onChange('rememberMe', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">로그인 상태 유지</span>
        </label>

        {/* 비밀번호 찾기 링크 */}
        <button
          type="button"
          onClick={() => {
            // 부모 컴포넌트에서 처리하도록 이벤트 전달
            const event = new CustomEvent('navigate-to-forgot-password');
            window.dispatchEvent(event);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline decoration-dotted underline-offset-2 transition-colors duration-200"
          disabled={disabled}
        >
          비밀번호를 잊으셨나요?
        </button>
      </motion.div>
    </div>
  );
};