'use client';

import { useState, useEffect } from 'react';
import { IBlogPost, BlogFilters } from '@/types/blog.types';
import {
  getPublishedPosts,
  getPostBySlug,
  getAllTags,
} from '@/requests/blog.request';
import { Logger } from '@/utils/Logger.class';

// This will not get finished until the presentation
export const useBlogPosts = (filters?: BlogFilters) => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 10,
  });

  const loadPosts = async (newFilters?: BlogFilters) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = { ...filters, ...newFilters };
      console.log('📚 Loading blog posts with filters:', currentFilters);

      const response = await getPublishedPosts(
        currentFilters?.page,
        currentFilters?.limit,
        currentFilters?.tag,
        currentFilters?.search,
      );

      console.log('📚 Blog posts API response:', response);

      if (response.success && response.data) {
        const posts = response.data.posts || response.data;
        const pagination = response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalPosts: Array.isArray(posts) ? posts.length : 0,
          limit: 10,
        };

        console.log('📚 Setting posts:', posts);
        console.log('📚 Setting pagination:', pagination);

        setPosts(Array.isArray(posts) ? posts : []);
        setPagination(pagination);
      } else {
        console.error(
          '📚 Failed to load posts - response not successful:',
          response,
        );
        setError('Failed to load posts');
      }
    } catch (err) {
      console.error('📚 Error loading blog posts:', err);
      Logger.error('Failed to load blog posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = (newFilters?: BlogFilters) => {
    loadPosts(newFilters);
  };

  return {
    posts,
    isLoading,
    totalPosts: posts.length,
    error,
    pagination,
    refetch,
  };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await getPostBySlug(slug);

        if (response.success && response.data) {
          const blogPost = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          setPost(blogPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        Logger.error('Failed to load blog post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return {
    post,
    loading,
    error,
  };
};

export const useBlogTags = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllTags();

        if (response.success && response.data) {
          setTags(response.data);
        } else {
          setError('Failed to load tags');
        }
      } catch (err) {
        Logger.error('Failed to load blog tags:', err);
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  return {
    tags,
    loading,
    error,
  };
};
