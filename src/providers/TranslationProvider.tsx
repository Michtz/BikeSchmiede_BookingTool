'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/client';
import i18next from 'i18next';
import Cookies from 'js-cookie';

interface TranslationProviderProps {
  children: ReactNode;
}

const TranslationProvider = ({ children }: TranslationProviderProps) => {
  useEffect(() => {
    const cookieLanguage = Cookies.get('language');
    if (cookieLanguage && ['de', 'en', 'fr'].includes(cookieLanguage)) {
      i18next.changeLanguage(cookieLanguage);
    }
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationProvider;
