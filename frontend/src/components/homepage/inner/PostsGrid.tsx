import React from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '@/components/community/PostCard/PostCard';
import { PostGrid } from '../styles';
import type { Post } from '@/types/community/community';

interface PostsGridProps {
  posts: Post[];
}

export const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  return (
    <PostGrid>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard 
            post={post} 
            compact
            showMetroLine 
          />
        </motion.div>
      ))}
    </PostGrid>
  );
};