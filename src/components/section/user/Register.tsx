'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import style from '@/styles/LoginPage.module.scss';
import { useTranslation } from 'react-i18next';
import { useError } from '@/hooks/ErrorHook';
import { useRouter } from 'next/navigation';
import {
  checkIfSamePassword,
  FormContainer,
  FormRow,
  validateEmail,
  validatePassword,
} from '@/components/system/Form';
import Input from '@/components/system/Input';
import Link from '@/components/system/Link';
import Button from '@/components/system/Button';
import { Logger } from '@/utils/Logger.class';
import { useAuth } from '@/hooks/AuthHook';
import { useFeedback } from '@/hooks/FeedbackHook';
import OdinLogo from '@/components/icons/OdinLogo';

interface RegisterFormData {
  email: string;
  password: string;
  passwordSec: string;
  lastName: string;
  firstName: string;
}

interface RegisterPageProps {
  onRegisterSuccess?: (user: any) => void;
  redirectTo?: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const { t } = useTranslation();
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const router = useRouter();
  const { isLoading, register: _register } = useAuth();
  const [registerErrors, setRegisterErrors] = useState();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      passwordSec: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await _register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
      );

      if (!response) {
        showFeedback(t('feedback.login-success'), 'success');
        router.push('/profile');
      } else {
        showFeedback(t('feedback.login-error'), 'error');
        setRegisterErrors(response?.message);
      }
    } catch (err) {
      showFeedback(t('feedback.login-error'), 'error');
      Logger.error('Registration failed:', err);
    }
  };

  return (
    <div className={style.loginContainer}>
      <span className={style.logo} onClick={() => router.replace('/')}>
        <OdinLogo color={'gray'} height={60} />
      </span>
      <div className={style.loginHeader}>
        <p className={style.loginSubtitle}>{t('register.createAccount')}</p>
      </div>
      <FormContainer
        className={style.loginForm}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Input
            type="text"
            label={t('register.firstName')}
            required
            fullWidth
            placeholder={t('register.firstNamePlaceholder')}
            clearable
            inputProps={register('firstName', {
              required: true,
            })}
            {...transformFieldError(errors.firstName)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="text"
            label={t('register.lastName')}
            required
            fullWidth
            placeholder={t('register.lastNamePlaceholder')}
            clearable
            inputProps={register('lastName', {
              required: true,
            })}
            {...transformFieldError(errors.lastName)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="text" // absichtlich text da sonst browser popup
            label={t('register.emailAddress')}
            required
            fullWidth
            placeholder={t('auth.emailPlaceholder')}
            clearable
            inputProps={register('email', {
              required: true,
              validate: validateEmail,
            })}
            {...transformFieldError(errors.email)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="password"
            label={t('register.password')}
            required
            fullWidth
            placeholder={t('register.passwordPlaceholder')}
            showPasswordToggle
            inputProps={register('password', {
              required: true,
              validate: validatePassword,
            })}
            {...transformFieldError(errors.password)}
          />
        </FormRow>

        <FormRow>
          <Input
            type="password"
            label={t('register.passwordAgain')}
            required
            fullWidth
            placeholder={t('register.passwordPlaceholder')}
            showPasswordToggle
            inputProps={register('passwordSec', {
              required: true,
              validate: (value) =>
                checkIfSamePassword(value, getValues().password),
            })}
            {...transformFieldError(errors.passwordSec)}
          />
        </FormRow>
        <FormRow>
          <Button type="submit" flex disabled={isLoading}>
            {t('register.createAccountButton')}
          </Button>
        </FormRow>
      </FormContainer>
      {registerErrors && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {registerErrors}
        </div>
      )}

      <div className={style.signupPrompt}>
        <span>{t('register.alreadyHaveAccount')} </span>
        <Link href="/login" className={style.signupLink}>
          {t('register.signIn')}
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
