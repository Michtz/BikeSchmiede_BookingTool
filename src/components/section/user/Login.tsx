'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import style from '@/styles/LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { useRouter } from 'next/navigation';
import { FormContainer, FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Link from '@/components/system/Link';
import Button, { ButtonContainer } from '@/components/system/Button';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import { useSocketContext } from '@/providers/SocketProvider';
import { GoogleLogin } from '@react-oauth/google';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginPageProps {
  goTo?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ goTo }) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const { isLoading, login, loginWithGoogle } = useAuth();
  const { joinUserRoom } = useSocketContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'michael@example.com',
      password: 'Password123!',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response: any = await login(data.email, data.password);
      if (typeof response === 'string') showFeedback(response, 'error');
      if (!response.success || goTo === null) return;
      router.replace(goTo || '/profile');
      joinUserRoom(response?.data.user.id);
      showFeedback(t('feedback.login-success'), 'success');
    } catch (err) {
      showFeedback(t('feedback.login-error'), 'error');
      Logger.error('Login failed:', err);
    }
  };

  const validateEmail = (email: string | undefined) => {
    if (!email) return t('validation.emailRequired');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) || t('validation.validEmailRequired');
  };

  const validatePassword = (password: string | undefined) => {
    if (!password) return t('validation.passwordRequired');
    return password.length >= 6 || t('validation.passwordMinLength');
  };

  return (
    <>
      <div className={style.loginContainer}>
        <FormContainer
          className={style.loginForm}
          onSubmitAction={handleSubmit(onSubmit)}
        >
          <FormRow gap={'large'}>
            <Input
              type="email"
              label={t('auth.emailAddress')}
              required
              fullWidth
              placeholder={t('auth.emailPlaceholder')}
              clearable
              inputProps={register('email', {
                required: t('validation.emailRequired'),
                validate: validateEmail,
              })}
              {...transformFieldError(errors.email)}
            />
          </FormRow>

          <FormRow>
            <Input
              type="password"
              label={t('auth.password')}
              required
              fullWidth
              placeholder={t('auth.passwordPlaceholder')}
              showPasswordToggle
              inputProps={register('password', {
                required: t('validation.passwordRequired'),
                validate: validatePassword,
              })}
              {...transformFieldError(errors.password)}
            />
          </FormRow>

          <FormRow>
            <ButtonContainer styles={{ marginBottom: '1rem' }}>
              <GoogleLogin
                onSuccess={async (response) => {
                  if (response.credential) {
                    const result = await loginWithGoogle(response.credential);
                    if (result?.success) router.replace(goTo || '/profile');
                  }
                }}
                onError={() => {
                  showFeedback(t('feedback.login-error'), 'error');
                }}
              />
              <Button
                style={{ margin: '0' }}
                type="submit"
                flex
                disabled={isLoading}
              >
                {t('auth.loginButton')}
              </Button>
            </ButtonContainer>
          </FormRow>
        </FormContainer>

        <div className={style.signupPrompt}>
          <span>{t('auth.noAccount')} </span>
          <Link href="/register" className={style.signupLink}>
            {t('auth.createAccount')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
