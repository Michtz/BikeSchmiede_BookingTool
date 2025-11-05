'use client';

import SWRProvider from '@/providers/SWRProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { AuthProvider } from '@/hooks/AuthHook';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/providers/TranslationProvider';
import React, { ReactNode } from 'react';
import './globals.scss';
import './variables.scss';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Feedback from '@/components/system/Feedback';
import { ErrorProvider } from '@/hooks/ErrorHook';
import { ContentTranslateProvider } from '@/hooks/ContentTranslationHook';
import CookieBanner from '@/components/system/CookieBanner';
import { CookieProvider } from '@/hooks/CookieHook';
import { SideCartProvider } from '@/hooks/SideCartHook';
import ThemeRegistry from '@/providers/ThemeRegistry';
import { GoogleOAuthProvider } from '@react-oauth/google';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeRegistry>
      <ErrorProvider>
        <TranslationProvider>
          <ContentTranslateProvider>
            <CookieProvider>
              <FeedbackProvider>
                <AuthProvider>
                  <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
                  >
                    <SocketProvider>
                      <SideCartProvider>
                        <html lang="de" suppressHydrationWarning>
                          <head>
                            <title>Barista Accessoire</title>
                          </head>
                          <body>
                            <Header />
                            <SWRProvider>{children}</SWRProvider>
                            <Feedback />
                            <CookieBanner />
                            <Footer />
                          </body>
                        </html>
                      </SideCartProvider>
                    </SocketProvider>
                  </GoogleOAuthProvider>
                </AuthProvider>
              </FeedbackProvider>
            </CookieProvider>
          </ContentTranslateProvider>
        </TranslationProvider>
      </ErrorProvider>
    </ThemeRegistry>
  );
};

export default RootLayout;
