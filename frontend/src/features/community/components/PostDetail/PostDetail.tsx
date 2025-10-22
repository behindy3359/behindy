"use client";

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentList } from '../CommentList/CommentList';
import { CommentForm } from '../CommentForm/CommentForm';
import { LOADING_MESSAGES } from '@/shared/utils/common/constants';
import { PageContainer } from '@/shared/styles/commonContainers';
import { PostDetailProps } from '../../types/postDetailTypes';
import { usePostDetail } from '../../hooks/usePostDetail';
import { usePostComments } from '../../hooks/usePostComments';
import { usePostInteractions } from '../../hooks/usePostInteractions';
import { PostHeader } from './inner/PostHeader';
import { PostContent } from './inner/PostContent';
import { PostActions } from './inner/PostActions';
import { PostErrorState } from './inner/PostErrorState';
import { CommentsSection, CommentsSectionHeader } from './styles';
import { CommonLoadingState } from '@/shared/styles/commonStyles';

export const PostDetail: React.FC<PostDetailProps> = ({
  postId,
  showComments = true,
  enableInteractions = true
}) => {
  console.log('🔴 [PostDetail] 컴포넌트 렌더링 시작', { postId, showComments, enableInteractions });

  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    console.log('⚙️ [PostDetail] handleToggleMenu 호출됨, 현재 showMenu:', showMenu);
    setShowMenu(!showMenu);
    console.log('⚙️ [PostDetail] showMenu 토글 완료, 새 값:', !showMenu);
  };

  const {
    post,
    user,
    apiError,
    isLoading,
    error,
    isAuthenticated,
    canEdit,
    canDelete,
    handleDelete,
    isDeleting,
  } = usePostDetail(postId);

  console.log('🔴 [PostDetail] 게시글 데이터:', {
    post: post?.id,
    user: user?.id,
    canEdit,
    canDelete,
    showMenu
  });

  const {
    commentsData,
    isLoadingComments,
    refreshComments,
  } = usePostComments(postId);

  const {
    handleBack,
    handleEdit,
    handleShare,
  } = usePostInteractions(post); // post는 Post | undefined

  // 로딩 상태
  if (isLoading) {
    return (
      <PageContainer>
        <CommonLoadingState>
          {LOADING_MESSAGES.POST_LOADING}
        </CommonLoadingState>
      </PageContainer>
    );
  }

  // 에러 상태 또는 게시글이 없는 경우
  if (error || apiError || !post) {
    return (
      <PageContainer>
        <PostErrorState
          error={error}
          apiError={apiError}
          onBack={handleBack}
        />
      </PageContainer>
    );
  }

  // 이 시점에서 post는 존재함이 보장됨
  return (
    <PageContainer>
      {/* 헤더 */}
      <PostHeader
        showMenu={showMenu}
        canEdit={canEdit}     // boolean 타입
        canDelete={canDelete} // boolean 타입
        isDeleting={isDeleting}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleMenu={handleToggleMenu}
      />

      {/* 게시글 내용 */}
      <PostContent post={post} />

      {/* 댓글 섹션 */}
      {showComments && (
        <CommentsSection>
          <CommentsSectionHeader>
            <h3>
              <MessageSquare size={20} />
              댓글 {commentsData?.totalElements || 0}개
            </h3>
          </CommentsSectionHeader>
          
          {/* 댓글 작성 폼 */}
          {isAuthenticated() && (
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
              <CommentForm 
                postId={postId} 
                onSuccess={refreshComments}
              />
            </div>
          )}

          {/* 댓글 목록 */}
          <div style={{ padding: '24px' }}>
            {isLoadingComments ? (
              <CommonLoadingState>
                {LOADING_MESSAGES.COMMENT_LOADING}
              </CommonLoadingState>
            ) : commentsData && commentsData.comments.length > 0 ? (
              <CommentList 
                comments={commentsData.comments}
                onUpdate={refreshComments}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#6b7280' 
              }}>
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </div>
            )}
          </div>
        </CommentsSection>
      )}

      {/* 메뉴 외부 클릭 처리 */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1049,
          }}
          onClick={() => {
            console.log('⚙️ [PostDetail] 메뉴 외부 클릭됨, 메뉴 닫기');
            setShowMenu(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default PostDetail;