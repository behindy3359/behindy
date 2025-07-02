"use client";

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout';
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';


export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <PublicLayout>

      <div style={{ padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: '#111827', 
            marginBottom: '2rem', 
            textAlign: 'center' 
          }}>
            🚇 실시간 지하철 노선도
          </h2>
          <RealtimeMetroMap />
        </div>
      </div>
    </PublicLayout>
  );
}