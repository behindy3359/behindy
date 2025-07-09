import React from 'react';
import { HotBadge } from '../styles';

interface PostCardBadgeProps {
  isHot: boolean;
}

export const PostCardBadge: React.FC<PostCardBadgeProps> = ({ isHot }) => {
  if (!isHot) return null;

  return <HotBadge>🔥 HOT</HotBadge>;
};