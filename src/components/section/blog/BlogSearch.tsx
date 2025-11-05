'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/blog/BlogSearch.module.scss';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  debounceMs?: number;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  initialQuery = '',
  placeholder,
  debounceMs = 500,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== initialQuery) {
        setIsSearching(true);
        onSearch(query);
        setTimeout(() => setIsSearching(false), 200);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs, onSearch, initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={styles.blogSearch}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputContainer}>
          <div className={styles.searchIcon}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="21 21l-4.35-4.35" />
            </svg>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || t('blog.searchPlaceholder', 'Search posts...')}
            className={styles.searchInput}
            aria-label="Search blog posts"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          
          {isSearching && (
            <div className={styles.searchingIndicator}>
              <div className={styles.spinner} />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className={styles.searchButton}
          aria-label="Search"
        >
          {t('common.search', 'Search')}
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;