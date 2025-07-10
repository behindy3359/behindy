import React from 'react';
import { CardContent, PostTitle, PostPreview } from '../styles';

interface PostCardContentProps {
  title: string;
  preview: string;
}

export const PostCardContent: React.FC<PostCardContentProps> = ({
  title,
  preview,
}) => {
  return (
    <CardContent>
      <PostTitle>{title}</PostTitle>
      <PostPreview>{preview}</PostPreview>
    </CardContent>
  );
};