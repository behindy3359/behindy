import React, { useCallback, useMemo } from "react";
import { CommentTime, FooterActions, FooterButton, StyledCommentFooter } from "../styles";
import { Heart } from "lucide-react";

export const CommentFooter = React.memo<{
  isLiked: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  onLike: () => void;
}>(function CommentFooter({ 
  isLiked, likeCount, createdAt, updatedAt, onLike 
}) {
  
  const handleLike = useCallback(() => {
    onLike();
  }, [onLike]);

  const isEdited = useMemo(() => 
    createdAt !== updatedAt, 
    [createdAt, updatedAt]
  );

  return (
    <StyledCommentFooter>
      <FooterActions>
        <FooterButton
          $active={isLiked}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart size={12} />
          {likeCount > 0 && <span className="count">{likeCount}</span>}
        </FooterButton>
      </FooterActions>

      <CommentTime>
        {isEdited && (
          <span style={{ color: '#9ca3af' }}>
            (수정됨)
          </span>
        )}
      </CommentTime>
    </StyledCommentFooter>
  );
});