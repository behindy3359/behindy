import { CommonLoadingState } from '@/shared/styles/components/common';

export default function Loading() {
  return (
    <CommonLoadingState $variant="page">
      <div className="loading-spinner" />
      <p className="loading-text">게임 로딩 중...</p>
    </CommonLoadingState>
  );
}
