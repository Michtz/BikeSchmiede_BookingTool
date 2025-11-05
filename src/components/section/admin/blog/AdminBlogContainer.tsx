'use client';

import React, { useState } from 'react';
import { Container } from '@/components/system/Container';
import { ModalProvider } from '@/hooks/ModalProvide';
import BlogDashboard from '@/components/section/admin/blog/BlogDashboard';
import BlogForm from '@/components/section/admin/blog/BlogForm';
import { IBlogPost } from '@/types/blog.types';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/admin/AdminBlog.module.scss';

const AdminBlogContent: React.FC = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<IBlogPost>();

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  const handleEditPost = (post: IBlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(undefined);
  };

  const handleSavePost = () => {
    // Refresh the dashboard after saving
    setShowForm(false);
    setEditingPost(undefined);
  };

  if (showForm) {
    return (
      <div className={styles.adminContainer}>
        <BlogForm
          post={editingPost}
          onClose={handleCloseForm}
          onSave={handleSavePost}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>{t('admin.blogManagement', 'Blog Management')}</h1>
      </div>
      <BlogDashboard
        onEditPost={handleEditPost}
        onCreatePost={handleCreatePost}
      />
    </>
  );
};

const AdminBlogContainer: React.FC = () => {
  return (
    <ModalProvider>
      <Container flow="column" alignItems="center">
        <AdminBlogContent />
      </Container>
    </ModalProvider>
  );
};

export default AdminBlogContainer;
