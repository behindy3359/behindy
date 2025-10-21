import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Calendar } from 'lucide-react';
import { PostContainer, PostHeader, PostMeta, PostTitle, PostContent as StyledPostContent } from '../styles';
import type { Post } from '@/shared/types/community/community';

interface PostContentProps {
  post: Post;
}

export const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PostContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PostHeader>
        <PostMeta>
          <div className="meta-item">
            <User size={16} />
            <span className="author">{post.authorName}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.createdAt !== post.updatedAt && (
            <div className="meta-item">
              <span style={{ color: '#9ca3af' }}>
                (수정됨: {formatDate(post.updatedAt)})
              </span>
            </div>
          )}
        </PostMeta>
        
        <PostTitle>{post.title}</PostTitle>
      </PostHeader>

      <StyledPostContent>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </StyledPostContent>
    </PostContainer>
  );
};
