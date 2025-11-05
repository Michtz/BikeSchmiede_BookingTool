'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/blog/BlogTagList.module.scss';

interface BlogTagListProps {
  tags?: string[];
  selectedTag?: string;
  onTagSelect?: (tag: string) => void;
  showAll?: boolean;
  maxTags?: number;
  variant?: 'filter' | 'navigation';
}

const BlogTagList: React.FC<BlogTagListProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  showAll = false,
  maxTags = 10,
  variant = 'filter',
}) => {
  const { t } = useTranslation();

  if (!tags || tags.length === 0) return null;

  const displayTags = showAll ? tags : tags.slice(0, maxTags);
  const hasMoreTags = tags.length > maxTags && !showAll;

  const renderTag = (tag: string) => {
    const isSelected = selectedTag === tag;

    if (variant === 'navigation') {
      return (
        <Link
          key={tag}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          className={`${styles.tag} ${styles.navigationTag}`}
        >
          #{tag}
        </Link>
      );
    }

    return (
      <button
        key={tag}
        onClick={() => onTagSelect?.(tag)}
        className={`${styles.tag} ${styles.filterTag} ${
          isSelected ? styles.selected : ''
        }`}
        aria-pressed={isSelected}
        aria-label={`${isSelected ? 'Remove' : 'Apply'} ${tag} filter`}
      >
        #{tag}
        {isSelected && (
          <span className={styles.removeIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={styles.blogTagList}>
      {variant === 'filter' && (
        <div className={styles.tagHeader}>
          <h4>{t('blog.filterByTag', 'Filter by Tag')}</h4>
          {selectedTag && (
            <button
              onClick={() => onTagSelect?.('')}
              className={styles.clearAll}
            >
              {t('common.clearAll', 'Clear All')}
            </button>
          )}
        </div>
      )}

      <div className={`${styles.tagContainer} ${styles[variant]}`}>
        {displayTags.map(renderTag)}

        {hasMoreTags && (
          <span className={styles.moreTags}>+{tags.length - maxTags} more</span>
        )}
      </div>
    </div>
  );
};

export default BlogTagList;
