'use client';

import SWRProvider from '@/providers/SWRProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { AuthProvider } from '@/hooks/AuthHook';
import 'material-icons/iconfont/material-icons.css';
import 'material-icons/iconfont/outlined.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FeedbackProvider } from '@/hooks/FeedbackHook';
import TranslationProvider from '@/providers/TranslationProvider';
import React, { ReactNode, useEffect, useState } from 'react';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import style from '@/styles/LoginPage.module.scss';
import { FormContainer, FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import { useForm } from 'react-hook-form';
import Button, { ButtonContainer } from '@/components/system/Button';

type FormValues = {
  password: string;
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      password: '',
    },
  });

  useEffect(() => {
    if (localStorage.getItem('authProv') === 'true') setIsAuth(true);
  }, []);

  const onSubmit = (data: FormValues) => {
    if (data.password !== '6048') return;
    setIsAuth(true);
    localStorage.setItem('authProv', 'true');
  };

  return (
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
                          <title>OdinBikes.ch</title>
                        </head>
                        {isAuth ? (
                          <body>
                            <Header />
                            <SWRProvider>{children}</SWRProvider>
                            <Feedback />
                            <CookieBanner />
                            <Footer />
                          </body>
                        ) : (
                          <body>
                            <div
                              style={{
                                display: 'flex',
                                width: '200px',
                                margin: 'auto',
                                marginTop: '400px',
                              }}
                            >
                              <FormContainer
                                className={style.loginForm}
                                onSubmitAction={handleSubmit(onSubmit)}
                              >
                                <FormRow gap={'large'}>
                                  <Input
                                    label={'password'}
                                    required
                                    inputProps={register('password', {})}
                                  />
                                  {/*  If you would like to see what's behind, password = "6048". have fun but its only a prototype */}
                                </FormRow>
                                <ButtonContainer>
                                  <Button>submit</Button>
                                </ButtonContainer>
                              </FormContainer>
                            </div>
                          </body>
                        )}
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
  );
};

export default RootLayout;
