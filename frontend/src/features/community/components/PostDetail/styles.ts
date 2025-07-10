import { motion } from "framer-motion";
import styled from "styled-components";

export const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`;

export const ActionMenu = styled.div`
  position: relative;
`;

export const MenuButton = styled(motion.button)`
  padding: 8px;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
    color: #374151;
  }
`;

export const MenuDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 120px;
  overflow: hidden;
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${({ $danger }) => $danger ? '#ef4444' : '#374151'};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${({ $danger }) => $danger ? '#fef2f2' : '#f9fafb'};
  }
`;

export const PostContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 24px;
`;

export const PostHeader = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f3f4f6;
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .author {
    font-weight: 600;
    color: #374151;
  }
`;

export const PostTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
`;

export const PostContent = styled.div`
  padding: 24px;
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
  
  h1, h2, h3 {
    margin: 1.5em 0 0.5em 0;
    font-weight: 600;
  }
  
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.1em; }
  
  p {
    margin: 0 0 1em 0;
  }
  
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
  
  blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 16px;
    margin: 1em 0;
    color: #6b7280;
    font-style: italic;
  }
  
  code {
    background: #f3f4f6;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
  }
`;

export const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

export const ActionButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${({ $active }) => $active ? '#f0f4ff' : 'none'};
  border: 1px solid ${({ $active }) => $active ? '#667eea' : '#e5e7eb'};
  border-radius: 6px;
  color: ${({ $active }) => $active ? '#667eea' : '#6b7280'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => $active ? '#e0e7ff' : '#f9fafb'};
    color: ${({ $active }) => $active ? '#5a67d8' : '#374151'};
  }
  
  .count {
    font-weight: 600;
  }
`;

export const CommentsSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

export const CommentsSectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f3f4f6;
  background: #f9fafb;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
`;