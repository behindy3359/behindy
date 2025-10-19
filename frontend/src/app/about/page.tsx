"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    // /about 접근 시 /about/overview로 리다이렉트
    router.replace('/about/overview');
  }, [router]);

  return null;
}
