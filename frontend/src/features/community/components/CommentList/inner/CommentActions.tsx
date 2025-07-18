import React, { useCallback } from "react";
import { DropdownMenu, MenuButton, MenuItem, StyledCommentActions } from "../styles";
import { Edit3, Flag, MoreHorizontal, Trash2 } from "lucide-react";
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
  canEdit,
  canDelete,
  showMenu,
  onEdit,
  onDelete,
  onToggleMenu
}) {

  const handleDelete = useCallback(async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await onDelete();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  }, [onDelete]);

  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <StyledCommentActions>
      <MenuButton 
        onClick={onToggleMenu} 
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
              <MenuItem onClick={onEdit} type="button">
                <Edit3 size={14} /> 수정
              </MenuItem>
            )}
            {canDelete && (
              <MenuItem onClick={handleDelete} className="danger" type="button">
                <Trash2 size={14} /> 삭제
              </MenuItem>
            )}
            <MenuItem type="button">
              <Flag size={14} /> 신고
            </MenuItem>
          </DropdownMenu>
        )}
      </AnimatePresence>
    </StyledCommentActions>
  );
});