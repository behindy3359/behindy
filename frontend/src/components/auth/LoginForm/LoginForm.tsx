"use client";

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginFormFields } from './inner/LoginFormFields';
import type { LoginFormProps } from '../types';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess
}) => {
  const {
    formData,
    errors,
    isLoading,
    success,
    isFormValid,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    handleDemoLogin,
    navigateToSignup,
    navigateToForgotPassword,
  } = useLoginForm();

  // 비밀번호 찾기 네비게이션 이벤트 리스너
  useEffect(() => {
    const handleForgotPasswordNavigation = () => {
      navigateToForgotPassword();
    };

    window.addEventListener('navigate-to-forgot-password', handleForgotPasswordNavigation);
    return () => {
      window.removeEventListener('navigate-to-forgot-password', handleForgotPasswordNavigation);
    };
  }, [navigateToForgotPassword]);

  // 성공 시 콜백 실행
  useEffect(() => {
    if (success && onSuccess) {
      onSuccess();
    }
  }, [success, onSuccess]);

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          다시 오신 것을 환영합니다
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          계정에 로그인하여 게임을 계속하세요
        </motion.p>
      </div>

      {/* 에러/성공 메시지 */}
      <AnimatePresence>
        {errors.submit && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium">로그인 실패</p>
              <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-green-800 font-medium">로그인 성공!</p>
              <p className="text-green-700 text-sm mt-1">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로그인 폼 */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LoginFormFields
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          disabled={isLoading}
          showDemoLogin={true}
          onDemoLogin={handleDemoLogin}
        />

        {/* 로그인 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            leftIcon={<LogIn size={20} />}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </motion.div>
      </motion.form>

      {/* 구분선 */}
      <motion.div
        className="flex items-center my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">또는</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </motion.div>

      {/* 회원가입 링크 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <p className="text-gray-600">
          아직 계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={navigateToSignup}
            className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-dotted underline-offset-2 transition-colors duration-200"
            disabled={isLoading}
          >
            회원가입
          </button>
        </p>
      </motion.div>
    </div>
  );
};