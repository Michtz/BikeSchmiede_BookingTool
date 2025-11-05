'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import styles from '@/styles/admin/blog/BlogImageUpload.module.scss';

interface BlogImageUploadProps {
  initialImage?: string;
  onImageSelect: (file: File | null) => void;
}

const BlogImageUpload: React.FC<BlogImageUploadProps> = ({
  initialImage,
  onImageSelect,
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(t('admin.imageTooLarge', 'Image size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.imageUpload}>
      <label className={styles.label}>
        {t('admin.featuredImage', 'Featured Image')}
      </label>
      
      <div className={styles.uploadArea}>
        {preview ? (
          <div className={styles.imagePreview}>
            <Image src={preview} alt="Preview" className={styles.previewImage} width={300} height={200} />
            <div className={styles.imageOverlay}>
              <button
                type="button"
                onClick={handleClick}
                className={styles.changeButton}
              >
                {t('admin.changeImage', 'Change')}
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeButton}
              >
                {t('admin.removeImage', 'Remove')}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPlaceholder} onClick={handleClick}>
            <div className={styles.uploadIcon}>📷</div>
            <p className={styles.uploadText}>
              {t('admin.uploadImage', 'Click to upload featured image')}
            </p>
            <p className={styles.uploadHint}>
              {t('admin.imageHint', 'Recommended size: 1200x630px (max 5MB)')}
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />
    </div>
  );
};

export default BlogImageUpload;