import { env } from '@/config/env';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  description: string;
}

// 환경변수에서 데모 계정 정보를 가져와서 UI용 형식으로 변환
export const DEMO_ACCOUNTS: DemoAccount[] = env.DEMO_ACCOUNTS.map((account, index) => ({
  id: `demo${index + 1}`,
  name: account.name,
  email: account.email,
  password: account.password,
  description: `${index + 1}번째 데모 계정`,
}));
