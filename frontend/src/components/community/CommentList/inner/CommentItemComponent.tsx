import api from "@/services/api/axiosConfig";
import useAuthStore from "@/store/authStore";
import API_ENDPOINTS from "@/utils/common/api";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import { CommentContainer, CommentContent, CommentHeader, CommentItem, EditingContainer } from "../styles";
import { CommentMeta } from "./CommentMeta";
import { CommentActions } from "./CommentActions";
import CommentForm from "../../CommentForm/CommentForm";
import { CommentFooter } from "../inner/CommentFooter";
import { Comment } from "@/types/community/community";

export const CommentItemComponent = React.memo<{
  comment: Comment;
  onUpdate: () => void;
  isReply?: boolean;
}>(function CommentItemComponent({ comment, onUpdate, isReply = false }) {
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const permissions = useMemo(() => ({
    canEdit: Boolean(user && (comment.authorId === user.id || comment.isEditable)),
    canDelete: Boolean(user && (comment.authorId === user.id || comment.isDeletable))
  }), [user, comment.authorId, comment.isEditable, comment.isDeletable]);

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(comment.id));
    },
    onSuccess: () => {
      setShowMenu(false);
      onUpdate();
    },
  });

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowMenu(false);
  }, []);

  const handleDelete = useCallback(async () => {
    await deleteCommentMutation.mutateAsync();
  }, [deleteCommentMutation]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const handleEditComplete = useCallback(() => {
    setIsEditing(false);
    onUpdate();
  }, [onUpdate]);

  const handleToggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const handleMenuOutsideClick = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <>
      <CommentContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CommentItem $isReply={isReply}>
          <CommentHeader>
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
          </CommentHeader>

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
                isLiked={isLiked}
                likeCount={likeCount}
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
            zIndex: 50,
            background: 'transparent',
          }}
          onClick={handleMenuOutsideClick}
        />
      )}
    </>
  );
});