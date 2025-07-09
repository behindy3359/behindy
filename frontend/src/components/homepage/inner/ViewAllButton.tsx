import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ViewAllButton as StyledViewAllButton } from '../styles';

interface ViewAllButtonProps {
  onClick: () => void;
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ onClick }) => {
  return (
    <StyledViewAllButton
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="view-all-content">
        <span>모든 게시글 보기</span>
        <ArrowRight size={18} />
      </div>
    </StyledViewAllButton>
  );
};