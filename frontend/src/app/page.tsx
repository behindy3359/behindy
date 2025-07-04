"use client";

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout';
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';

export default function Home() {
  const router = useRouter();

  // 사이드바 상태 디버깅
  const [debugInfo, setDebugInfo] = React.useState('');

  React.useEffect(() => {
    setDebugInfo(`
      화면 너비: ${window.innerWidth}px
      사이드바 예상: ${window.innerWidth >= 1200 ? '표시됨' : '숨겨짐'}
      현재 경로: ${window.location.pathname}
    `);
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <PublicLayout>
      <RealtimeMetroMap />
    </PublicLayout>
  );
}