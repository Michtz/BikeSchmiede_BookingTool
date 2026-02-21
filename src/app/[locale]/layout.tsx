import SWRProvider from '@/providers/SWRProvider';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import React, { ReactNode } from 'react';
import './globals.scss';
import './_variables.scss';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Feedback from '@/components/system/feedback/Feedback';
import { ErrorProvider } from '@/hooks/ErrorHook';
import CookieBanner from '@/components/system/cookieBannner/CookieBanner';
import { CookieProvider } from '@/hooks/CookieHook';
import { SideCartProvider } from '@/hooks/SideCartHook';
import { GoogleOAuthProvider } from '@react-oauth/google';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorProvider>
      <CookieProvider>
        <FeedbackProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <SideCartProvider>
              <html lang="de" suppressHydrationWarning>
                <head>
                  <title>OdinBikes.ch</title>
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
          </GoogleOAuthProvider>
        </FeedbackProvider>
      </CookieProvider>
    </ErrorProvider>
  );
};

export default RootLayout;
