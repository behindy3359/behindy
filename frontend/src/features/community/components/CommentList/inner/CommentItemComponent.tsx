import api from "@/config/axiosConfig";
import useAuthStore from "@/shared/store/authStore";
import API_ENDPOINTS from "@/shared/utils/common/api";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { CommentContainer, CommentContent, CommentItem, EditingContainer } from "../styles";
import { CommentMeta } from "./CommentMeta";
import { CommentActions } from "./CommentActions";
import CommentForm from "../../CommentForm/CommentForm";
import { CommentFooter } from "./CommentFooter";
import { Comment } from "@/shared/types/community/community";
import { CommonCommentHeader } from "@/shared/styles/commonStyles";

export const CommentItemComponent = React.memo<{
  comment: Comment;
  onUpdate: () => void;
  isReply?: boolean;
}>(function CommentItemComponent({ comment, onUpdate, isReply = false }) {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const permissions = useMemo(() => ({
    canEdit: Boolean(user && (comment.authorId === user.id || comment.isEditable)),
    canDelete: Boolean(user && (comment.authorId === user.id || comment.isDeletable))
  }), [user, comment.authorId, comment.isEditable, comment.isDeletable]);

  console.log('[CommentItemComponent] 렌더링됨:', {
    commentId: comment.id,
    userId: user?.id,
    authorId: comment.authorId,
    isEditable: comment.isEditable,
    isDeletable: comment.isDeletable,
    permissions,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      console.log('[CommentItemComponent] 삭제 API 요청 시작:', API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      console.log('[CommentItemComponent] 삭제 성공');
      setShowMenu(false);
      onUpdate();
    },
    onError: (error) => {
      console.error('[CommentItemComponent] 삭제 실패:', error);
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async () => {
      await api.post(API_ENDPOINTS.COMMENTS.LIKE(comment.id));
    },
    onSuccess: () => {
      onUpdate(); // 댓글 목록 새로고침으로 좋아요 상태 업데이트
    },
  });

  const handleEdit = useCallback(() => {
    console.log('🔵 [CommentItemComponent] handleEdit 호출됨', { commentId: comment.id });
    console.log('🔵 [CommentItemComponent] 편집 모드로 전환 시작');
    try {
      setIsEditing(true);
      setShowMenu(false);
      console.log('✅ [CommentItemComponent] 편집 모드 전환 성공');
    } catch (error) {
      console.error('❌ [CommentItemComponent] 편집 모드 전환 실패:', error);
    }
  }, [comment.id]);

  const handleDelete = useCallback(async () => {
    console.log('🔴 [CommentItemComponent] handleDelete 호출됨', { commentId: comment.id });
    console.log('🔴 [CommentItemComponent] deleteCommentMutation.mutateAsync 호출 시작');
    try {
      await deleteCommentMutation.mutateAsync();
      console.log('✅ [CommentItemComponent] deleteCommentMutation 성공');
    } catch (error) {
      console.error('❌ [CommentItemComponent] deleteCommentMutation 실패:', error);
      throw error;
    }
  }, [deleteCommentMutation, comment.id]);

  const handleLike = useCallback(async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    await likeCommentMutation.mutateAsync();
  }, [user, likeCommentMutation]);

  const handleEditComplete = useCallback(() => {
    setIsEditing(false);
    onUpdate();
  }, [onUpdate]);

  const handleToggleMenu = useCallback(() => {
    console.log('⚙️ [CommentItemComponent] handleToggleMenu 호출됨', { commentId: comment.id, currentShowMenu: showMenu });
    setShowMenu(prev => {
      console.log('⚙️ [CommentItemComponent] showMenu 토글:', prev, '->', !prev);
      return !prev;
    });
  }, [comment.id, showMenu]);

  const handleMenuOutsideClick = useCallback(() => {
    console.log('⚙️ [CommentItemComponent] 메뉴 외부 클릭됨, 메뉴 닫기', { commentId: comment.id });
    setShowMenu(false);
  }, [comment.id]);

  return (
    <>
      <CommentContainer
        $menuOpen={showMenu}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CommentItem $isReply={isReply}>
          <CommonCommentHeader>
            <CommentMeta
              authorName={comment.authorName}
              createdAt={comment.createdAt}
              updatedAt={comment.updatedAt}
            />

            <CommentActions
              commentId={comment.id}
              canEdit={permissions.canEdit}
              canDelete={permissions.canDelete}
              showMenu={showMenu}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleMenu={handleToggleMenu}
            />
          </CommonCommentHeader>

          {isEditing ? (
            <EditingContainer>
              <CommentForm
                postId={comment.postId}
                editingComment={comment}
                onSuccess={handleEditComplete}
                onCancel={() => setIsEditing(false)}
                placeholder="댓글을 수정하세요..."
                autoFocus
              />
            </EditingContainer>
          ) : (
            <>
              <CommentContent>{comment.content}</CommentContent>

              <CommentFooter
                isLiked={comment.isLiked || false}
                likeCount={comment.likeCount || 0}
                createdAt={comment.createdAt}
                updatedAt={comment.updatedAt}
                onLike={handleLike}
              />
            </>
          )}
        </CommentItem>
      </CommentContainer>

      {/* 메뉴 외부 클릭 오버레이 */}
      {showMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9,  // CommonCommentHeader(z-index: 10)보다 낮게 설정
            background: 'transparent',
          }}
          onClick={handleMenuOutsideClick}
        />
      )}
    </>
  );
});