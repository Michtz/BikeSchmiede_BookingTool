'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BlogStatusBadge from './BlogStatusBadge';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import { IBlogPost, BlogPostStatus } from '@/types/blog.types';
import {
  deletePost,
  publishPost,
  unpublishPost,
  archivePost,
} from '@/requests/blog.request';
import { formatDate } from '@/functions/common';
import { Logger } from '@/utils/Logger.class';
import styles from '@/styles/admin/blog/BlogDashboard.module.scss';
import { useBlogPosts } from '@/hooks/BlogHook';
import Button, { ButtonContainer } from '@/components/system/Button';

interface BlogDashboardProps {
  onEditPost: (post: IBlogPost) => void;
  onCreatePost: () => void;
}

const BlogDashboard: React.FC<BlogDashboardProps> = ({
  onEditPost,
  onCreatePost,
}) => {
  const { t } = useTranslation();
  const { posts, isLoading, error, pagination } = useBlogPosts();
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use pagination from hook instead of local state
  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;

  const handleStatusChange = async (
    postId: string,
    newStatus: BlogPostStatus,
  ) => {
    try {
      switch (newStatus) {
        case 'published':
          await publishPost(postId);
          break;
        case 'draft':
          await unpublishPost(postId);
          break;
        case 'archived':
          await archivePost(postId);
          break;
        default:
          return;
      }
    } catch (error) {
      Logger.error('Failed to update post status:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await deletePost(postId);
        if (response.success) {
        }
      } catch (error) {
        Logger.error('Failed to delete post:', error);
      }
    }
  };

  const handleBulkStatusChange = async (newStatus: BlogPostStatus) => {
    if (selectedPosts.size === 0) return;

    if (
      window.confirm(
        `Are you sure you want to change the status of ${selectedPosts.size} post(s) to ${newStatus}?`,
      )
    ) {
      try {
        const promises = Array.from(selectedPosts).map((postId) =>
          handleStatusChange(postId, newStatus),
        );
        await Promise.all(promises);
        setSelectedPosts(new Set());
      } catch (error) {
        Logger.error('Failed to update posts:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPosts.size} post(s)?`,
      )
    ) {
      try {
        const promises = Array.from(selectedPosts).map((postId) =>
          deletePost(postId),
        );
        await Promise.all(promises);
        setSelectedPosts(new Set());
      } catch (error) {
        Logger.error('Failed to delete posts:', error);
      }
    }
  };

  const togglePostSelection = (postId: string) => {
    const newSelection = new Set(selectedPosts);
    if (newSelection.has(postId)) {
      newSelection.delete(postId);
    } else {
      newSelection.add(postId);
    }
    setSelectedPosts(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map((post) => post._id)));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <p>Error loading posts: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  return (
    <div className={styles.blogDashboard}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>{t('admin.blogManagement', 'Blog Management')}</h1>
          <p className={styles.subtitle}>
            {posts?.length} {posts?.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <button onClick={onCreatePost} className={styles.createButton}>
          {t('admin.createPost', 'Create New Post')}
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            placeholder={t('admin.searchPosts', 'Search posts...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">
              {t('admin.allStatuses', 'All Statuses')}
            </option>
            <option value="published">
              {t('admin.published', 'Published')}
            </option>
            <option value="draft">{t('admin.draft', 'Draft')}</option>
            <option value="archived">{t('admin.archived', 'Archived')}</option>
          </select>
        </div>

        {selectedPosts?.size > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectionCount}>
              {selectedPosts.size} selected
            </span>
            <button
              onClick={() => handleBulkStatusChange('published')}
              className={styles.bulkButton}
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              className={styles.bulkButton}
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkStatusChange('archived')}
              className={styles.bulkButton}
            >
              Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className={`${styles.bulkButton} ${styles.danger}`}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {posts?.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>{t('admin.noPosts', 'No posts found')}</h3>
          <p>
            {searchQuery || statusFilter !== 'all'
              ? t(
                  'admin.noPostsFiltered',
                  'Try adjusting your search criteria.',
                )
              : t('admin.noPostsYet', 'No blog posts have been created yet.')}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button onClick={onCreatePost} className={styles.createFirstButton}>
              {t('admin.createFirstPost', 'Create Your First Post')}
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.postsTable}>
              <thead>
                <tr>
                  <th className={styles.checkboxColumn}>
                    <input
                      type="checkbox"
                      checked={
                        selectedPosts.size === posts?.length &&
                        posts?.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>{t('admin.title', 'Title')}</th>
                  <th>{t('admin.author', 'Author')}</th>
                  <th>{t('admin.status', 'Status')}</th>
                  <th>{t('admin.publishDate', 'Publish Date')}</th>
                  <th>{t('admin.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map((post) => (
                  <tr key={post._id} className={styles.postRow}>
                    <td className={styles.checkboxColumn}>
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post._id)}
                        onChange={() => togglePostSelection(post._id)}
                      />
                    </td>
                    <td className={styles.titleColumn}>
                      <div className={styles.postTitle}>{post.title}</div>
                      <div className={styles.postMeta}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className={styles.moreTagsCount}>
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{post.author_id.firstName}</td>
                    <td>
                      <BlogStatusBadge status={post.status} />
                    </td>
                    <td>
                      {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                    </td>
                    <td className={styles.actionsColumn}>
                      <div className={styles.actions}>
                        <button
                          onClick={() => onEditPost(post)}
                          className={styles.editButton}
                          title="Edit"
                        >
                          Edit
                        </button>

                        <select
                          value={post.status}
                          onChange={(e) =>
                            handleStatusChange(
                              post._id,
                              e.target.value as BlogPostStatus,
                            )
                          }
                          className={styles.statusSelect}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>

                        <button
                          onClick={() => handleDelete(post._id)}
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <ButtonContainer className={styles.pagination}>
              <Button
                onClick={() => console.log('Previous page - TODO: implement')}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={() => console.log('Next page - TODO: implement')}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </ButtonContainer>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDashboard;
