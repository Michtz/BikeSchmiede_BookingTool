'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/admin/blog/BlogTagInput.module.scss';

interface BlogTagInputProps {
  initialTags?: string[];
  onChange: (tags: string[]) => void;
}

const BlogTagInput: React.FC<BlogTagInputProps> = ({
  initialTags = [],
  onChange,
}) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange(newTags);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={styles.tagInput}>
      <label className={styles.label}>
        {t('admin.tags', 'Tags')}
      </label>
      
      <div className={styles.tagContainer}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className={styles.removeTag}
              aria-label={`Remove ${tag} tag`}
            >
              ×
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? t('admin.addTags', 'Add tags...') : ''}
          className={styles.input}
        />
      </div>
      
      <p className={styles.hint}>
        {t('admin.tagHint', 'Press Enter or comma to add a tag')}
      </p>
    </div>
  );
};

export default BlogTagInput;