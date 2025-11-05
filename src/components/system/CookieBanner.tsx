'use client';

import React, { useEffect, useState } from 'react';
import { useCookie } from '@/hooks/CookieHook';
import styles from '@/styles/system/CookieBanner.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';

const CookieBanner: React.FC = () => {
  const { showBanner, acceptCookies } = useCookie();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [showBanner]);

  const handleAccept = () => {
    setIsClosing(true);
    setTimeout(() => {
      acceptCookies();
      setIsClosing(false);
    }, 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`${styles.cookieBanner} ${isVisible ? styles.visible : ''} ${isClosing ? styles.closing : ''}`}
      role="dialog"
      aria-label={t('cookies.banner.title')}
      aria-describedby="cookie-description"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <MaterialIcon icon={'cookie'} color={'white'} />
          </div>

          <div className={styles.textContent}>
            <h3 className={styles.title}>{t('cookies.banner.title')}</h3>
            <p id="cookie-description" className={styles.description}>
              {t('cookies.banner.description')}
            </p>
            <button
              className={styles.learnMore}
              onClick={() => window.open('/legal/privacy')}
              aria-label={t('cookies.banner.learnMore')}
            >
              {t('cookies.banner.learnMore')} →
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleAccept} value="primary" appearance="button">
            {t('cookies.banner.accept')}&nbsp;{t('cookies.banner.reject')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
