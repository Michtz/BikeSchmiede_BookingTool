'use client';

import React, { useState } from 'react';
import BlogCard from './BlogCard';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/blog/BlogList.module.scss';
import { useBlogPosts } from '@/hooks/BlogHook';

interface BlogListProps {
  selectedTag?: string;
}

const BlogList: React.FC<BlogListProps> = ({ selectedTag }) => {
  const { t } = useTranslation();
  const { posts, isLoading, totalPosts } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(selectedTag || '');

  const clearFilters = () => {
    setActiveTag('');
    setSearchQuery('');
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className={styles.blogList}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Blog</h1>
          <p className={styles.subtitle}>
            {totalPosts} {totalPosts === 1 ? t('blog.post') : t('blog.posts')}{' '}
            {t('blog.found')}
            {activeTag && ` ${t('blog.inTag', { tag: activeTag })}`}
            {searchQuery && ` ${t('blog.matching', { query: searchQuery })}`}
          </p>
        </div>

        {(activeTag || searchQuery) && (
          <button onClick={clearFilters} className={styles.clearFilters}>
            {t('blog.clearFilters')}
          </button>
        )}
      </div>

      {/*<div className={styles.filters}>*/}
      {/*  /!*  {showSearch && (*!/*/}
      {/*  /!*    <BlogSearch *!/*/}
      {/*  /!*      onSearch={handleSearch}*!/*/}
      {/*  /!*      initialQuery={searchQuery}*!/*/}
      {/*  /!*    />*!/*/}
      {/*  /!*  )}*!/*/}
      {/*  /!*  *!/*/}
      {/*  /!*{showTagFilter && tags.length > 0 && (*!/*/}
      {/*  /!*  <BlogTagList selectedTag={activeTag} onTagSelect={handleTagSelect} />*!/*/}
      {/*  /!*)}*!/*/}
      {/*</div>*/}

      {posts?.length === 0 ? (
        <div className={styles.noPosts}>
          <h3>{t('blog.noPostsFound')}</h3>
          <p>
            {searchQuery || activeTag
              ? t('blog.noPostsFiltered')
              : t('blog.noPostsYet')}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.postsGrid}>
            {posts?.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {/*{totalPages > 1 && (*/}
          {/*  <BlogPagination*/}
          {/*    currentPage={currentPage}*/}
          {/*    totalPages={totalPages}*/}
          {/*    onPageChange={handlePageChange}*/}
          {/*  />*/}
          {/*)}*/}
        </>
      )}

      {isLoading && posts?.length > 0 && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default BlogList;
