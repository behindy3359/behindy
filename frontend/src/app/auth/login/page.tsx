"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { ERROR_MESSAGES, LOADING_MESSAGES, SUCCESS_MESSAGES } from '@/utils/common';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = yup.object().shape({
  email: yup.string().required('이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: yup.string().required('비밀번호를 입력해주세요').min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  rememberMe: yup.boolean().default(false),
});

// ================================================================
// 스타일
// ================================================================

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacing[8]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Alert = styled(motion.div)<{ $type: 'error' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  ${({ $type }) => $type === 'error' ? `
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  ` : `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
  `}
`;

const DemoBox = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
`;

// ================================================================
// 메인 컴포넌트
// ================================================================

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (isAuthenticated()) router.push('/');
  }, [isAuthenticated, router]);

  // URL 파라미터에서 회원가입 성공 메시지 확인
  useEffect(() => {
    if (searchParams.get('message') === 'signup_success') {
      setSuccess(SUCCESS_MESSAGES.SIGNUP_COMPLETE);
    }
  }, [searchParams]);

  // 제출 로직
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        }, 1500);
      } else {
        setError(ERROR_MESSAGES.LOGIN_FAILED);
      }
    } catch (err: any) {
      setError(ERROR_MESSAGES.LOGIN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // 데모 로그인
  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await login({
        email: 'demo@demo.com',
        password: 'Ademo123!',
        rememberMe: false,
      });

      if (result.success) {
        setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        setTimeout(() => {
          const redirectTo = searchParams.get('redirect') || '/';
          router.push(redirectTo);
        }, 1500);
      } else {
        setError(ERROR_MESSAGES.DEMO_LOGIN_FAILED);
      }
    } catch (err: any) {
      setError(ERROR_MESSAGES.DEMO_LOGIN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>다시 오신 것을 환영합니다</Title>
      <Subtitle>계정에 로그인하여 게임을 계속하세요</Subtitle>

      <DemoBox>
        <div className="title">🎮 데모 계정으로 접속하기</div>
        <Button variant="ghost" size="sm" onClick={handleDemoLogin} disabled={loading} style={{ width: '100%' }}>
          데모 계정 정보 입력
        </Button>
      </DemoBox>

      <AnimatePresence>
        {error && (
          <Alert $type="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <AlertCircle size={16} />
            {error}
          </Alert>
        )}
        {success && (
          <Alert $type="success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <CheckCircle size={16} />
            {success}
          </Alert>
        )}
      </AnimatePresence>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('email')} type="email" label="이메일" placeholder="your.email@example.com"
               leftIcon={<Mail size={20} />} error={errors.email?.message} fullWidth autoFocus />

        <Input {...register('password')} type="password" label="비밀번호" placeholder="비밀번호를 입력하세요"
               leftIcon={<Lock size={20} />} error={errors.password?.message} fullWidth />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-8px 0 8px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
            <input {...register('rememberMe')} type="checkbox" />
            로그인 상태 유지
          </label>
          
          <button type="button" onClick={() => router.push('/auth/forgot-password')}
                  style={{ background: 'none', border: 'none', color: '#667eea', fontSize: '14px', cursor: 'pointer', textDecoration: 'none' }}>
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}
                leftIcon={<LogIn size={20} />} disabled={!isValid || loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        <span style={{ padding: '0 16px', color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>또는</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
        아직 계정이 없으신가요?
        <motion.button onClick={() => router.push('/auth/signup')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                       style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: '600', marginLeft: '4px', cursor: 'pointer', textDecoration: 'none' }}>
          회원가입
        </motion.button>
      </div>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        {LOADING_MESSAGES.LOGIN_PAGE_LOADING}
      </div>}>
      <LoginContent />
    </Suspense>
  );
}