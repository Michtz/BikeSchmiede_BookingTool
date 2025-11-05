'use client';

import React from 'react';
import { BlogPostStatus } from '@/types/blog.types';
import styles from '@/styles/admin/blog/BlogStatusBadge.module.scss';

interface BlogStatusBadgeProps {
  status: BlogPostStatus;
  className?: string;
}

const BlogStatusBadge: React.FC<BlogStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = (status: BlogPostStatus) => {
    switch (status) {
      case 'published':
        return {
          label: 'Published',
          variant: 'success',
        };
      case 'draft':
        return {
          label: 'Draft',
          variant: 'warning',
        };
      case 'archived':
        return {
          label: 'Archived',
          variant: 'secondary',
        };
      default:
        return {
          label: status,
          variant: 'default',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span 
      className={`${styles.statusBadge} ${styles[config.variant]} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default BlogStatusBadge;