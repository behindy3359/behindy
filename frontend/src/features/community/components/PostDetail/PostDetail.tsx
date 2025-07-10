"use client";

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentList } from '../CommentList/CommentList';
import { CommentForm } from '../CommentForm/CommentForm';
import { LOADING_MESSAGES } from '@/utils/common/constants';
import { PageContainer } from '@/styles/commonStyles';
import { PostDetailProps } from '../../types/postDetailTypes';
import { usePostDetail } from '../../hooks/usePostDetail';
import { usePostComments } from '../../hooks/usePostComments';
import { usePostInteractions } from '../../hooks/usePostInteractions';
import { PostHeader } from './inner/PostHeader';
import { PostContent } from './inner/PostContent';
import { PostActions } from './inner/PostActions';
import { PostErrorState } from './inner/PostErrorState';
import { CommentsSection, CommentsSectionHeader, LoadingState } from './styles';

export const PostDetail: React.FC<PostDetailProps> = ({ 
  postId,
  showComments = true,
  enableInteractions = true 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // 훅들로 로직 분리
  const {
    post,
    user,
    apiError,
    isLoading,
    error,
    isAuthenticated,
    canEdit,     // 이제 boolean 타입 보장됨
    canDelete,   // 이제 boolean 타입 보장됨
    handleDelete,
    isDeleting,
  } = usePostDetail(postId);

  const {
    commentsData,
    isLoadingComments,
    refreshComments,
  } = usePostComments(postId);

  const {
    isLiked,
    likeCount,
    handleBack,
    handleEdit,
    handleLike,
    handleShare,
  } = usePostInteractions(post); // post는 Post | undefined

  // 로딩 상태
  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>
          {LOADING_MESSAGES.POST_LOADING}
        </LoadingState>
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
        onToggleMenu={() => setShowMenu(!showMenu)}
      />

      {/* 게시글 내용 */}
      <PostContent post={post} />

      {/* 게시글 액션 */}
      <PostActions
        enableInteractions={enableInteractions}
        isLiked={isLiked}
        likeCount={likeCount}
        commentsData={commentsData}
        onLike={handleLike}
        onShare={handleShare}
      />

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
              <LoadingState>
                {LOADING_MESSAGES.COMMENT_LOADING}
              </LoadingState>
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
            zIndex: 50,
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </PageContainer>
  );
};

export default PostDetail;