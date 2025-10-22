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
  const handleEdit = useCallback(() => {
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await onDelete();
      } catch (error) {
        console.error('❌ [CommentActions] 댓글 삭제 실패:', error);
      }
    }
  }, [onDelete]);

  const handleToggleMenu = useCallback(() => {
    onToggleMenu();
  }, [onToggleMenu]);

  if (!canEdit && !canDelete) {
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