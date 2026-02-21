'use client';

import React, { ReactNode } from 'react';
import { ErrorProvider } from '@/hooks/ErrorHook';
import { CookieProvider } from '@/hooks/CookieHook';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import { SideCartProvider } from '@/hooks/SideCartHook';
import SWRProvider from '@/providers/SWRProvider';
import Feedback from '@/components/system/feedback/Feedback';
import CookieBanner from '@/components/system/cookieBannner/CookieBanner';

interface ClientProvidersProps {
  children: ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <ErrorProvider>
      <CookieProvider>
        <FeedbackProvider>
          <SideCartProvider>
            <SWRProvider>
              {children}
              <Feedback />
              <CookieBanner />
            </SWRProvider>
          </SideCartProvider>
        </FeedbackProvider>
      </CookieProvider>
    </ErrorProvider>
  );
};
