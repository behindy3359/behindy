/**
 * 공통 로딩 컴포넌트
 */

export function Loading({ message = "로딩 중..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading message="페이지 로딩 중..." />
    </div>
  );
}

export function GameLoading() {
  return <Loading message="게임 로딩 중..." />;
}

export function StoryLoading() {
  return <Loading message="스토리 로딩 중..." />;
}
