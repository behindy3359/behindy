import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Edit3, Trash2, Flag } from 'lucide-react';
import { BackButton, Header, ActionMenu, MenuButton, MenuDropdown, MenuItem } from '../styles';

interface PostHeaderProps {
  showMenu: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleMenu: () => void;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  showMenu,
  canEdit,
  canDelete,
  isDeleting,
  onBack,
  onEdit,
  onDelete,
  onToggleMenu,
}) => {
  return (
    <Header>
      <BackButton
        onClick={onBack}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowLeft size={16} />
        목록으로
      </BackButton>

      {(canEdit || canDelete) && (
        <ActionMenu>
          <MenuButton
            onClick={onToggleMenu}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isDeleting}
          >
            <MoreHorizontal size={16} />
          </MenuButton>

          <AnimatePresence>
            {showMenu && (
              <MenuDropdown
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {canEdit && (
                  <MenuItem onClick={onEdit}>
                    <Edit3 size={14} />
                    수정
                  </MenuItem>
                )}
                {canDelete && (
                  <MenuItem $danger onClick={onDelete} disabled={isDeleting}>
                    <Trash2 size={14} />
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </MenuItem>
                )}
                <MenuItem>
                  <Flag size={14} />
                  신고
                </MenuItem>
              </MenuDropdown>
            )}
          </AnimatePresence>
        </ActionMenu>
      )}
    </Header>
  );
};