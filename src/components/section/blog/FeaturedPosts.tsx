'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IBlogPost } from '@/types/blog.types';
import { getFeaturedPosts } from '@/requests/blog.request';
import { formatDate } from '@/functions/common';
import { Logger } from '@/utils/Logger.class';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/blog/FeaturedPosts.module.scss';

interface FeaturedPostsProps {
  limit?: number;
  showImages?: boolean;
  title?: string;
  className?: string;
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  limit = 3,
  showImages = true,
  title,
  className = '',
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t('blog.featuredPosts');
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getFeaturedPosts(limit);

      if (response.success && response.data) {
        const postsArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setPosts(postsArray);
      } else {
        setError('Failed to load featured posts');
      }
    } catch (err) {
      Logger.error('Failed to load featured posts:', err);
      setError('Failed to load featured posts');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadFeaturedPosts();
  }, [loadFeaturedPosts]);

  if (loading) {
    return (
      <div className={`${styles.featuredPosts} ${className}`}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.featuredPosts} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <Link href="/blog" className={styles.viewAll}>
          {t('blog.viewAll')} →
        </Link>
      </div>

      <div className={styles.postsList}>
        {posts.map((post, index) => (
          <article key={post._id} className={styles.featuredPost}>
            {showImages && post.featured_image && (
              <div className={styles.imageContainer}>
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    className={styles.postImage}
                    width={300}
                    height={200}
                    priority={index === 0}
                  />
                </Link>
              </div>
            )}

            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.date}>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className={styles.separator}>•</span>
                    <Link
                      href={`/blog/tag/${encodeURIComponent(post.tags[0])}`}
                      className={styles.primaryTag}
                    >
                      {post.tags[0]}
                    </Link>
                  </>
                )}
              </div>

              <h4 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h4>

              <p className={styles.excerpt}>{post.excerpt}</p>

              <div className={styles.author}>
                <span>
                  {t('blog.by')} {post.author_id.firstName}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <Link href="/blog" className={styles.viewAllButton}>
          {t('blog.viewAllPosts')}
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPosts;
