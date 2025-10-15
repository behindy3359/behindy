"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { useSignupForm } from '../../hooks/useSignupForm';
import { SignupFormFields } from './inner/SignupFormFields';
import { PortfolioWarningModal } from '../PortfolioWarningModal/PortfolioWarningModal';
import {
  SignupContainer,
  ActionsContainer,
  LoginPrompt
} from './styles';
import {
  CommonAuthHeaderSection,
  CommonAuthPageTitle,
  CommonAuthDivider,
  CommonAuthErrorAlert,
  CommonAuthSuccessAlert
} from '@/shared/styles/commonAuthStyles';

export const SignupForm: React.FC = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);

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

  // 최초 진입 시 모달 표시 (세션 스토리지로 한 번만 표시)
  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('portfolio-warning-seen');
    if (!hasSeenWarning) {
      setShowWarningModal(true);
    }
  }, []);

  const handleWarningConfirm = () => {
    sessionStorage.setItem('portfolio-warning-seen', 'true');
  };

  return (
    <SignupContainer>
      {/* 헤더 */}
      <CommonAuthHeaderSection>
        <CommonAuthPageTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Behindy에 어서오세요!
        </CommonAuthPageTitle>
      </CommonAuthHeaderSection>

      {/* 에러/성공 메시지 */}
      <AnimatePresence>
        {submitError && (
          <CommonAuthErrorAlert
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
          </CommonAuthErrorAlert>
        )}

        {submitSuccess && (
          <CommonAuthSuccessAlert
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
          </CommonAuthSuccessAlert>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          opacity: 0,
          animation: 'fadeIn 0.5s ease forwards 0.2s'
        }}
      >
        <SignupFormFields
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onBlur={handleFieldBlur}
          disabled={isLoading}
        />

        {/* 액션 버튼들 */}
        <ActionsContainer>
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
      </form>

      {/* 구분선 */}
      <CommonAuthDivider
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <span>또는</span>
      </CommonAuthDivider>

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

      {/* 포트폴리오 경고 모달 */}
      <AnimatePresence>
        {showWarningModal && (
          <PortfolioWarningModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={handleWarningConfirm}
          />
        )}
      </AnimatePresence>
    </SignupContainer>
  );
};