"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { useSignupForm } from '../hooks/useSignupForm';
import { SignupFormFields } from '../SignupForm/inner/SignupFormFields';

export const SignupForm: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    submitError,
    submitSuccess,
    isFormValid,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    navigateToLogin,
  } = useSignupForm();

  return (
    <div className="w-full max-height-80vh overflow-y-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Behindy에 어서오세요!
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          지하철 텍스트 어드벤처의 세계로 떠나보세요
        </motion.p>
      </div>

      {/* 에러/성공 메시지 */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium">회원가입 실패</p>
              <p className="text-red-700 text-sm mt-1">{submitError}</p>
            </div>
          </motion.div>
        )}

        {submitSuccess && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-green-800 font-medium">회원가입 성공!</p>
              <p className="text-green-700 text-sm mt-1">{submitSuccess}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 회원가입 폼 */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SignupFormFields
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          disabled={isLoading}
        />

        {/* 액션 버튼들 */}
        <motion.div
          className="space-y-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            leftIcon={<UserPlus size={20} />}
          >
            {isLoading ? '계정 생성 중...' : '계정 만들기'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={navigateToLogin}
            disabled={isLoading}
            leftIcon={<X size={20} />}
          >
            취소
          </Button>
        </motion.div>
      </motion.form>

      {/* 구분선 */}
      <motion.div
        className="flex items-center my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">또는</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </motion.div>

      {/* 로그인 링크 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <p className="text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={navigateToLogin}
            className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-dotted underline-offset-2 transition-colors duration-200"
            disabled={isLoading}
          >
            로그인
          </button>
        </p>
      </motion.div>
    </div>
  );
};