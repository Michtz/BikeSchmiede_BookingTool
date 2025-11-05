'use client';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import style from '@/styles/UserProfileForm.module.scss';
import { useError } from '@/hooks/ErrorHook';
import {
  checkIfSamePassword,
  FormContainer,
  FormRow,
} from '@/components/system/Form';
import Input from '@/components/system/Input';
import Button, { ButtonContainer } from '@/components/system/Button';
import { useFeedback } from '@/hooks/FeedbackHook';
import { Logger } from '@/utils/Logger.class';
import { changePassword } from '@/requests/user.request';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useTranslation } from 'react-i18next';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordChangeForm: FC = () => {
  const { t } = useTranslation();
  const { transformFieldError } = useError();
  const { showFeedback } = useFeedback();
  const router: AppRouterInstance = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeData>({
    mode: 'onSubmit',
  });

  const onSubmit = async (data: PasswordChangeData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      router.push('/profile');
      showFeedback(t('passwordChange.passwordChangedSuccess'), 'success');
    } catch (error) {
      Logger.error('Error changing password:', error);
      showFeedback(t('passwordChange.passwordChangeError'), 'error');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <section className={style.section}>
      <FormContainer
        className={style.passwordFormContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Input
            label={t('passwordChange.currentPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.currentPasswordPlaceholder')}
            inputProps={register('currentPassword', {
              required: true,
            })}
            {...transformFieldError(errors.currentPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label={t('passwordChange.newPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.newPasswordPlaceholder')}
            inputProps={register('newPassword', {
              required: true,
              minLength: { value: 8, message: 'minLength' },
            })}
            {...transformFieldError(errors.newPassword)}
          />
        </FormRow>

        <FormRow>
          <Input
            label={t('passwordChange.confirmNewPassword')}
            type="password"
            required
            fullWidth
            placeholder={t('passwordChange.confirmPasswordPlaceholder')}
            inputProps={register('confirmNewPassword', {
              required: true,
              validate: (value) =>
                checkIfSamePassword(value, getValues().newPassword),
            })}
            {...transformFieldError(errors.confirmNewPassword)}
          />
        </FormRow>

        <ButtonContainer>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {t('passwordChange.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('passwordChange.changing')
              : t('passwordChange.changePasswordButton')}
          </Button>
        </ButtonContainer>
      </FormContainer>
    </section>
  );
};

export default PasswordChangeForm;
