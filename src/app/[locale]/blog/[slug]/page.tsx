'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogPost from '@/components/section/blog/BlogPost';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { Container } from '@/components/system/Container';
import { getPostBySlug, getPublishedPosts } from '@/requests/blog.request';
import { IBlogPost } from '@/types/blog.types';
import { Logger } from '@/utils/Logger.class';

const BlogPostPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<IBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPostBySlug(slug);

      if (response.success && response.data) {
        const blogPost = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setPost(blogPost);

        // Load related posts based on tags
        if (blogPost.tags && blogPost.tags.length > 0) {
          loadRelatedPosts(blogPost.tags[0], blogPost._id);
        }
      } else {
        setError('Post not found');
      }
    } catch (err) {
      Logger.error('Failed to load blog post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadRelatedPosts = async (tag: string, excludeId: string) => {
    try {
      const response = await getPublishedPosts(1, 3, tag);

      if (response.success && response.data) {
        const filteredPosts = response.data.posts.filter(
          (p) => p._id !== excludeId,
        );
        setRelatedPosts(filteredPosts.slice(0, 3));
      }
    } catch (err) {
      Logger.error('Failed to load related posts:', err);
    }
  };

  if (loading) {
    return (
      <Container flow="column" alignItems="center">
        <div style={{ padding: '4rem 0' }}>
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container flow="column" alignItems="center">
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '600px',
          }}
        >
          <h1>Post Not Found</h1>
          <p>
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push('/blog')}
            style={{
              padding: '1rem 2rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem',
            }}
          >
            Back to Blog
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container flow="column" alignItems="center">
      <BlogPost post={post} relatedPosts={relatedPosts} />
    </Container>
  );
};

export default BlogPostPage;
