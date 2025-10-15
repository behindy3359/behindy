"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { useLoginForm } from '../../hooks/useLoginForm';
import { LoginFormFields } from './inner/LoginFormFields';
import { PortfolioWarningModal } from '../PortfolioWarningModal/PortfolioWarningModal';
import {
  SignupPrompt
} from './styles';
import type { LoginFormProps } from '../../types/types';
import { BasicFullWidthContainer } from '@/shared/styles/commonContainers';
import { 
  CommonAuthHeaderSection,
  CommonAuthPageTitle,
  CommonAuthPageSubtitle,
  CommonAuthDivider,
  CommonAuthErrorAlert, 
  CommonAuthSuccessAlert 
} from '@/shared/styles/commonAuthStyles';
import { 
  CommonWrapper, 
} from '@/shared/styles/commonStyles';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  
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
    <>
      <BasicFullWidthContainer>
        {/* 헤더 */}
        <CommonAuthHeaderSection>
          <CommonAuthPageTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            다시 오신 것을 환영합니다
          </CommonAuthPageTitle>
          <CommonAuthPageSubtitle
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            계정에 로그인하여 게임을 계속하세요
          </CommonAuthPageSubtitle>
        </CommonAuthHeaderSection>

        {/* 에러/성공 메시지 */}
        <AnimatePresence>
          {errors.submit && (
            <CommonAuthErrorAlert
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle />
              <div className="content">
                <div className="title">로그인 실패</div>
                <div className="message">{errors.submit}</div>
              </div>
            </CommonAuthErrorAlert>
          )}

          {success && (
            <CommonAuthSuccessAlert
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle />
              <div className="content">
                <div className="title">로그인 성공!</div>
                <div className="message">{success}</div>
              </div>
            </CommonAuthSuccessAlert>
          )}
        </AnimatePresence>

        {/* 로그인 폼 */}
        <CommonWrapper
          onSubmit={handleSubmit}
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
          <BasicFullWidthContainer
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
          </BasicFullWidthContainer>
        </CommonWrapper>

        {/* 구분선 */}
        <CommonAuthDivider
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <span>또는</span>
        </CommonAuthDivider>

        {/* 회원가입 링크 */}
        <SignupPrompt
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <p>
            아직 계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={navigateToSignup}
              disabled={isLoading}
            >
              회원가입
            </button>
          </p>
        </SignupPrompt>
      </BasicFullWidthContainer>

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
    </>
  );
};