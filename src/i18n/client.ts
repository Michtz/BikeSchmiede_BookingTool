'use client';
import i18next, { TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import deCommon from './locales/de/common.json';
import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';
import { updateCurrentSession } from '@/requests/session.request';
import Cookies from 'js-cookie';
import { Logger } from '@/utils/Logger.class';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export type LanguageOptionType = { code: string; name: string };

const languages: string[] = ['de', 'en', 'fr'];
export const languagesOptions: LanguageOptionType[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

const resources = {
  de: {
    common: deCommon,
  },
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
};

interface LanguageChangeProps {
  language: string;
  router: AppRouterInstance;
  path: string;
  preferences: Record<string, string>;
  sessionId: string;
  action: (lng?: string) => Promise<TFunction>;
  setIsLanguageDropdownOpen?: (a: boolean) => void;
}

export const handleLanguageChange = async ({
  language,
  router,
  path,
  preferences,
  sessionId,
  action,
  setIsLanguageDropdownOpen,
}: LanguageChangeProps): Promise<void> => {
  try {
    Cookies.set('language', language, {
      expires: 1,
      path: '/',
      sameSite: 'strict',
    });

    await action(language);
    const sessionPromise = await updateCurrentSession(
      {
        ...preferences,
        language: language,
      },
      sessionId,
    );

    const newPath = path.replace(/^\/[a-z]{2}/, `/${language}`);
    router.refresh();
    router.push(newPath);
    await sessionPromise;
  } catch (e) {
    Logger.error(e);
  }
  if (setIsLanguageDropdownOpen) setIsLanguageDropdownOpen(false);
};

i18next.use(initReactI18next).init({
  debug: false,
  fallbackLng: 'de',
  supportedLngs: languages,
  defaultNS: 'common',
  ns: ['common'],
  fallbackNS: 'common',
  resources,
  react: {
    useSuspense: false,
  },
  lng: 'de',
});

export default i18next;
