import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { transKey } from '@/types/product.types';
import { useParams } from 'next/navigation';
import { Params } from 'next/dist/server/request/params';

/*
 * This is used to translate the content of products and later blogs (Blogs will not get finished until the presentation)
 */

interface ContentTranslateHook {
  translate: (values?: string | transKey, dynamic?: boolean) => string;
  locale: string;
}

const ContentTranslateContext = createContext<ContentTranslateHook | undefined>(
  undefined,
);

export const ContentTranslateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const params: Params = useParams();
  const [locale, setLanguage] = useState<string>(
    (params?.locale as string) || 'de',
  );

  useEffect(() => {
    setLanguage(params?.locale as string);
  }, [params.locale]);

  const translate = (
    values: string | transKey = '',
    dynamic: boolean = true,
  ): string => {
    if (typeof values === 'string') return values;
    if (!values || Object.keys(values).length === 0) return '';

    if (dynamic) {
      if (values[locale]) return values[locale];
      const partialMatch = Object.keys(values).find((key) =>
        key.toLowerCase().startsWith(locale.toLowerCase().split('-')[0]),
      );
      if (partialMatch && values[partialMatch]) return values[partialMatch];
      // Fallback to invariant or first available value
      return values.inv || Object.values(values).find((v) => v) || '';
    }
    return values.inv || '';
  };

  return (
    <ContentTranslateContext.Provider value={{ translate, locale }}>
      {children}
    </ContentTranslateContext.Provider>
  );
};

export const useContentTranslate = (): ContentTranslateHook => {
  const context = useContext(ContentTranslateContext);
  if (!context) {
    throw new Error(
      'useContentTranslate must be used within a ContentTranslateProvider',
    );
  }
  return context;
};
