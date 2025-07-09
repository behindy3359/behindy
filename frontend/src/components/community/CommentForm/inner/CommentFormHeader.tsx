import React from 'react';
import { UserInfo } from '../styles';
import { getUserInitial } from '../utils';

interface CommentFormHeaderProps {
  userName?: string;
  isEditing: boolean;
}

export const CommentFormHeader = React.memo<CommentFormHeaderProps>(
  function CommentFormHeader({ userName, isEditing }) {
    if (isEditing) return null;

    return (
      <UserInfo>
        <div className="avatar">
          {getUserInitial(userName)}
        </div>
        <span className="name">{userName}</span>
      </UserInfo>
    );
  }
);
