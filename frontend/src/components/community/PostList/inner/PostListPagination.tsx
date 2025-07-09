import React from 'react';
import { motion } from 'framer-motion';
import { createPageNumbers, shouldShowPagination } from '../utils';
import { Pagination, PageButton } from '../styles';
import type { PostListPaginationProps } from '../types';

export const PostListPagination = React.memo<PostListPaginationProps>(
  function PostListPagination({ currentPage, totalPages, onPageChange }) {
    if (!shouldShowPagination(totalPages)) {
      return null;
    }

    const pageNumbers = createPageNumbers(currentPage, totalPages);

    return (
      <Pagination>
        <PageButton
          $disabled={currentPage === 0}
          onClick={() => onPageChange(0)}
          whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
        >
          처음
        </PageButton>
        
        <PageButton
          $disabled={currentPage === 0}
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
        >
          이전
        </PageButton>

        {pageNumbers.map((page) => (
          <PageButton
            key={page}
            $active={page === currentPage}
            onClick={() => onPageChange(page)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page + 1}
          </PageButton>
        ))}

        <PageButton
          $disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.95 }}
        >
          다음
        </PageButton>
        
        <PageButton
          $disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.95 }}
        >
          마지막
        </PageButton>
      </Pagination>
    );
  }
);