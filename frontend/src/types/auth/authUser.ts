  // 기본 사용자 정보
  export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  }
  
  // 사용자 프로필 정보 (민감 정보 제외)
  export interface UserProfile {
    id: number;
    name: string;
    email: string;
    joinedDate: string;
    lastLogin?: string;
  }
  
  // 현재 로그인한 사용자 정보
  export interface CurrentUser {
    id: number;
    name: string;
    email: string;
    isAuthenticated: boolean;
    permissions?: string[];
  }
  