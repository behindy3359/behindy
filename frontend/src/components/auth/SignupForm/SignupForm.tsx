"use client";

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { useSignupForm } from '../hooks/useSignupForm';
import { SignupFormFields } from './inner/SignupFormFields';
import {
  SignupContainer,
  HeaderSection,
  PageTitle,
  SignupFormContainer,
  ErrorAlert,
  SuccessAlert,
  ActionsContainer,
  Divider,
  LoginPrompt
} from './styles';

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
    <SignupContainer>
      {/* 헤더 */}
      <HeaderSection>
        <PageTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Behindy에 어서오세요!
        </PageTitle>
      </HeaderSection>

      {/* 에러/성공 메시지 */}
      <AnimatePresence>
        {submitError && (
          <ErrorAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle />
            <div className="content">
              <div className="title">회원가입 실패</div>
              <div className="message">{submitError}</div>
            </div>
          </ErrorAlert>
        )}

        {submitSuccess && (
          <SuccessAlert
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle />
            <div className="content">
              <div className="title">회원가입 성공!</div>
              <div className="message">{submitSuccess}</div>
            </div>
          </SuccessAlert>
        )}
      </AnimatePresence>

      {/* 회원가입 폼 */}
      <SignupFormContainer
        onSubmit={handleSubmit}
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
        <ActionsContainer
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
        </ActionsContainer>
      </SignupFormContainer>

      {/* 구분선 */}
      <Divider
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <span>또는</span>
      </Divider>

      {/* 로그인 링크 */}
      <LoginPrompt
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <p>
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={navigateToLogin}
            disabled={isLoading}
          >
            로그인
          </button>
        </p>
      </LoginPrompt>
    </SignupContainer>
  );
};