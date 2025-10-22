import React, { useCallback } from "react";
import { DropdownMenu, MenuButton, MenuItem, StyledCommentActions } from "../styles";
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export const CommentActions = React.memo<{
  commentId: number;
  canEdit: boolean;
  canDelete: boolean;
  showMenu: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleMenu: () => void;
}>(function CommentActions({
  commentId,
  canEdit,
  canDelete,
  showMenu,
  onEdit,
  onDelete,
  onToggleMenu
}) {
  console.log('[CommentActions] 렌더링됨:', { commentId, canEdit, canDelete, showMenu });

  const handleEdit = useCallback(() => {
    console.log('🔵 [CommentActions] 수정 버튼 클릭됨', { commentId });
    console.log('🔵 [CommentActions] onEdit 함수 호출 시작');
    try {
      onEdit();
      console.log('✅ [CommentActions] onEdit 함수 호출 성공');
    } catch (error) {
      console.error('❌ [CommentActions] onEdit 함수 호출 실패:', error);
    }
  }, [onEdit, commentId]);

  const handleDelete = useCallback(async () => {
    console.log('🔴 [CommentActions] 삭제 버튼 클릭됨', { commentId });
    alert('🔴 댓글 삭제 버튼이 클릭되었습니다! (이 메시지는 디버깅용입니다)');
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      console.log('🔴 [CommentActions] 사용자가 삭제 확인함');
      console.log('🔴 [CommentActions] onDelete 함수 호출 시작');
      try {
        await onDelete();
        console.log('✅ [CommentActions] onDelete 함수 호출 성공');
      } catch (error) {
        console.error('❌ [CommentActions] 댓글 삭제 실패:', error);
      }
    } else {
      console.log('⚠️ [CommentActions] 사용자가 삭제 취소함');
    }
  }, [onDelete, commentId]);

  const handleToggleMenu = useCallback(() => {
    console.log('⚙️ [CommentActions] 메뉴 토글 버튼 클릭됨', { commentId, currentShowMenu: showMenu });
    try {
      onToggleMenu();
      console.log('✅ [CommentActions] onToggleMenu 호출 성공');
    } catch (error) {
      console.error('❌ [CommentActions] onToggleMenu 호출 실패:', error);
    }
  }, [onToggleMenu, commentId, showMenu]);

  if (!canEdit && !canDelete) {
    console.log('[CommentActions] 권한 없어서 렌더링 안함', { commentId });
    return null;
  }

  return (
    <StyledCommentActions>
      <MenuButton
        onClick={handleToggleMenu}
        aria-label="댓글 메뉴 열기"
        type="button"
      >
        <MoreHorizontal size={18} />
      </MenuButton>

      <AnimatePresence>
        {showMenu && (
          <DropdownMenu
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {canEdit && (
              <MenuItem onClick={handleEdit} type="button">
                <Edit3 size={14} /> 수정
              </MenuItem>
            )}
            {canDelete && (
              <MenuItem onClick={handleDelete} className="danger" type="button">
                <Trash2 size={14} /> 삭제
              </MenuItem>
            )}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </StyledCommentActions>
  );
});