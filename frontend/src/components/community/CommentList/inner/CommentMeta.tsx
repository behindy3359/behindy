import { formatters } from "@/utils/common/formatting";
import React, { useMemo } from "react";
import { StyledCommentMeta } from "../styles";
import { Calendar } from "lucide-react";

export const CommentMeta = React.memo<{
  authorName: string;
  createdAt: string;
  updatedAt: string;
}>(function CommentMeta({ authorName, createdAt, updatedAt }) {
  
  const userInitial = useMemo(() => 
    formatters.getUserInitial(authorName), 
    [authorName]
  );
  
  const relativeTime = useMemo(() => 
    formatters.relativeTime(createdAt), 
    [createdAt]
  );

  const isEdited = useMemo(() => 
    createdAt !== updatedAt, 
    [createdAt, updatedAt]
  );

  return (
    <StyledCommentMeta>
      <div className="user-info">
        <div className="avatar">{userInitial}</div>
        <span className="name">{authorName}</span>
      </div>
      <div className="date">
        <Calendar size={12} />
        {relativeTime}
        {isEdited && (
          <span style={{ color: '#9ca3af', marginLeft: '4px' }}>
            (수정됨)
          </span>
        )}
      </div>
    </StyledCommentMeta>
  );
});