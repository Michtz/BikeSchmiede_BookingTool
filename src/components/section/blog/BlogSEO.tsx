'use client';

import React from 'react';
import Head from 'next/head';
import { IBlogPost } from '@/types/blog.types';

interface BlogSEOProps {
  post: IBlogPost;
}

const BlogSEO: React.FC<BlogSEOProps> = ({ post }) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;
  const publishedDate = post.publishedAt || post.createdAt;
  const modifiedDate = post.updatedAt;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: description,
    image: post.featured_image ? [post.featured_image] : [],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: `${post.author_id.firstName} ${post.author_id.lastName}`,
      email: post.author_id.email,
    },
    publisher: {
      '@type': 'Organization',
      name: 'myShop',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/myShopLogo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags?.join(', '),
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={post.tags?.join(', ')} />
      <meta name="author" content={`${post.author_id.firstName} ${post.author_id.lastName}`} />
      <link rel="canonical" href={postUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:site_name" content="myShop Blog" />
      {post.featured_image && (
        <>
          <meta property="og:image" content={post.featured_image} />
          <meta property="og:image:alt" content={post.title} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={`${post.author_id.firstName} ${post.author_id.lastName}`} />
      {post.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {post.featured_image && (
        <>
          <meta name="twitter:image" content={post.featured_image} />
          <meta name="twitter:image:alt" content={post.title} />
        </>
      )}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  );
};

export default BlogSEO;