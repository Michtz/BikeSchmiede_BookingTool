'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IBlogPost } from '@/types/blog.types';
import { formatDate } from '@/functions/common';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/blog/BlogCard.module.scss';

interface BlogCardProps {
  post: IBlogPost;
  showImage?: boolean;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  showImage = true, 
  className = '' 
}) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.blogCard} ${className}`}>
      {showImage && post.featured_image && (
        <div className={styles.imageContainer}>
          <Link href={`/blog/${post.slug}`}>
            <Image 
              src={post.featured_image} 
              alt={post.title}
              className={styles.featuredImage}
              width={300}
              height={200}
            />
          </Link>
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.author}>{`${post.author_id.firstName} ${post.author_id.lastName}`}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.date}>
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        
        <h3 className={styles.title}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className={styles.excerpt}>{post.excerpt}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className={styles.tag}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          {t('blog.readMore')} →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;