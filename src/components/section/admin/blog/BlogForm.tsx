'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import BlogImageUpload from './BlogImageUpload';
import BlogTagInput from './BlogTagInput';
import BlogPreview from './BlogPreview';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import {
  IBlogPost,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  BlogPostStatus,
} from '@/types/blog.types';
import { createPost, updatePost } from '@/requests/blog.request';
import { Logger } from '@/utils/Logger.class';
import styles from '@/styles/admin/blog/BlogForm.module.scss';

interface BlogFormProps {
  post?: IBlogPost;
  onClose: () => void;
  onSave?: (post: IBlogPost) => void;
}

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: BlogPostStatus;
}

const BlogForm: React.FC<BlogFormProps> = ({ post, onClose, onSave }) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formPost, setFormPost] = useState<IBlogPost | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      slug: post?.slug || '',
      tags: post?.tags || [],
      meta_title: post?.meta_title || '',
      meta_description: post?.meta_description || '',
      status: post?.status || 'draft',
    },
  });

  const watchedTitle = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !post) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, post, setValue]);

  const generatePreviewPost = (data: FormData): IBlogPost => {
    return {
      _id: post?._id || 'preview',
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      author_id: {
        _id: 'test',
        firstName: 'Current User ',
        lastName: 'Current User',
        email: 'current@user.com',
      },
      tags: data.tags,
      featured_image: featuredImage
        ? URL.createObjectURL(featuredImage)
        : post?.featured_image,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      status: data.status,
      publishedAt:
        data.status === 'published' ? new Date().toISOString() : undefined,
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handlePreview = () => {
    const data = watch();
    setFormPost(generatePreviewPost(data));
    setPreviewMode(true);
  };

  const onSubmit = async (data: FormData, isDraft = false) => {
    try {
      setSaving(true);

      const postData = {
        ...data,
        status: isDraft ? ('draft' as BlogPostStatus) : data.status,
      };

      let response;
      if (post) {
        response = await updatePost(
          post._id,
          postData as UpdateBlogPostRequest,
          featuredImage || undefined,
        );
      } else {
        response = await createPost(
          postData as CreateBlogPostRequest,
          featuredImage || undefined,
        );
      }

      if (response.success) {
        onSave?.(response.data as IBlogPost);
        onClose();
      }
    } catch (error) {
      Logger.error('Failed to save post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    const data = watch();
    onSubmit(data, true);
  };

  if (previewMode && formPost) {
    return (
      <BlogPreview
        post={formPost}
        onBack={() => setPreviewMode(false)}
        onEdit={() => setPreviewMode(false)}
      />
    );
  }

  return (
    <div className={styles.blogForm}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>
            {post
              ? t('admin.editPost', 'Edit Blog Post')
              : t('admin.createPost', 'Create New Blog Post')}
          </h1>
          {isDirty && (
            <span className={styles.unsavedChanges}>
              {t('admin.unsavedChanges', 'Unsaved changes')}
            </span>
          )}
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={handlePreview}
            className={styles.previewButton}
          >
            {t('admin.preview', 'Preview')}
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className={styles.draftButton}
          >
            {saving
              ? t('admin.saving', 'Saving...')
              : t('admin.saveDraft', 'Save Draft')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className={styles.form}
      >
        <div className={styles.formContent}>
          <div className={styles.mainColumn}>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                {t('admin.title', 'Title')} *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { required: 'Title is required' })}
                className={`${styles.input} ${errors.title ? styles.error : ''}`}
                placeholder={t('admin.titlePlaceholder', 'Enter post title...')}
              />
              {errors.title && (
                <span className={styles.errorMessage}>
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="slug" className={styles.label}>
                {t('admin.slug', 'Slug')} *
              </label>
              <input
                id="slug"
                type="text"
                {...register('slug', { required: 'Slug is required' })}
                className={`${styles.input} ${errors.slug ? styles.error : ''}`}
                placeholder={t('admin.slugPlaceholder', 'url-friendly-slug')}
              />
              {errors.slug && (
                <span className={styles.errorMessage}>
                  {errors.slug.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="excerpt" className={styles.label}>
                {t('admin.excerpt', 'Excerpt')} *
              </label>
              <textarea
                id="excerpt"
                {...register('excerpt', { required: 'Excerpt is required' })}
                className={`${styles.textarea} ${errors.excerpt ? styles.error : ''}`}
                rows={3}
                placeholder={t(
                  'admin.excerptPlaceholder',
                  'Brief description of the post...',
                )}
              />
              {errors.excerpt && (
                <span className={styles.errorMessage}>
                  {errors.excerpt.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="content" className={styles.label}>
                {t('admin.content', 'Content')} *
              </label>
              <textarea
                id="content"
                {...register('content', { required: 'Content is required' })}
                className={`${styles.contentTextarea} ${errors.content ? styles.error : ''}`}
                rows={20}
                placeholder={t(
                  'admin.contentPlaceholder',
                  'Write your post content here...',
                )}
              />
              {errors.content && (
                <span className={styles.errorMessage}>
                  {errors.content.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.sideColumn}>
            <div className={styles.field}>
              <label className={styles.label}>
                {t('admin.status', 'Status')}
              </label>
              <select {...register('status')} className={styles.select}>
                <option value="draft">{t('admin.draft', 'Draft')}</option>
                <option value="published">
                  {t('admin.published', 'Published')}
                </option>
                <option value="archived">
                  {t('admin.archived', 'Archived')}
                </option>
              </select>
            </div>

            <BlogImageUpload
              initialImage={post?.featured_image}
              onImageSelect={setFeaturedImage}
            />

            <BlogTagInput
              initialTags={post?.tags || []}
              onChange={(tags) => setValue('tags', tags)}
            />

            <div className={styles.seoSection}>
              <h3 className={styles.sectionTitle}>
                {t('admin.seoSettings', 'SEO Settings')}
              </h3>

              <div className={styles.field}>
                <label htmlFor="meta_title" className={styles.label}>
                  {t('admin.metaTitle', 'Meta Title')}
                </label>
                <input
                  id="meta_title"
                  type="text"
                  {...register('meta_title')}
                  className={styles.input}
                  placeholder={t(
                    'admin.metaTitlePlaceholder',
                    'SEO title (optional)',
                  )}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="meta_description" className={styles.label}>
                  {t('admin.metaDescription', 'Meta Description')}
                </label>
                <textarea
                  id="meta_description"
                  {...register('meta_description')}
                  className={styles.textarea}
                  rows={3}
                  placeholder={t(
                    'admin.metaDescriptionPlaceholder',
                    'SEO description (optional)',
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {post && (
              <span className={styles.lastSaved}>
                {t('admin.lastSaved', 'Last saved')}:{' '}
                {new Date(post.updatedAt).toLocaleString()}
              </span>
            )}
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t('common.cancel', 'Cancel')}
            </button>

            <button
              type="submit"
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? (
                <span className={styles.savingState}>
                  <LoadingSpinner />
                  {t('admin.saving', 'Saving...')}
                </span>
              ) : post ? (
                t('admin.updatePost', 'Update Post')
              ) : (
                t('admin.publishPost', 'Publish Post')
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
