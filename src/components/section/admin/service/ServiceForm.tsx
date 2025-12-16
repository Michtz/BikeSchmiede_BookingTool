'use client';

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import style from '@/styles/admin/ProductForm.module.scss';
import { IService, CreateServiceRequest } from '@/types/service.types';
import { createService, updateService } from '@/requests/service.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { mutate } from 'swr';
import { FormContainer, FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Checkbox from '@/components/system/Checkbox';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';
import Select from '@/components/system/Select';

interface ServiceFormProps {
  onClose: () => void;
  service?: IService;
}

const CATEGORIES = ['Werkstatt', 'Beratung', 'Bikefitting', 'Sonstiges'];

const ServiceForm: React.FC<ServiceFormProps> = ({ onClose, service }) => {
  const { showFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading, isDirty, isValid },
  } = useForm<CreateServiceRequest>({
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price || 0,
      durationTotalMinutes: service?.durationTotalMinutes || 60,
      durationCustomerMinutes: service?.durationCustomerMinutes || 0,
      category: service?.category || 'Werkstatt',
      isActive: service?.isActive ?? true,
      imageUrl: service?.imageUrl || '',
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<CreateServiceRequest> = async (data) => {
    try {
      if (service?._id) {
        await updateService(service._id, data);
        showFeedback('Service aktualisiert', 'success');
      } else {
        await createService(data);
        showFeedback('Service erstellt', 'success');
      }
      mutate('/api/services');
      onClose();
    } catch {
      showFeedback('Fehler beim Speichern', 'error');
    }
  };

  return (
    <div className={style.productForm}>
      <div className={style.formHeader}>
        <h2>{service ? 'Service bearbeiten' : 'Neuen Service erstellen'}</h2>
        <Button
          appearance="icon"
          icon="close"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        />
      </div>

      <FormContainer
        className={style.formContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <Input
            label="Name"
            required
            fullWidth
            inputProps={register('name', { required: 'Name ist erforderlich' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </FormRow>

        <FormRow>
          <Input
            label="Beschreibung"
            multiline
            minRows={3}
            fullWidth
            inputProps={register('description')}
          />
        </FormRow>

        <FormRow direction="row">
          <Input
            label="Preis (CHF)"
            type="number"
            required
            fullWidth
            inputProps={register('price', { valueAsNumber: true, min: 0 })}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Kategorie"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                fullWidth
              />
            )}
          />
        </FormRow>

        <FormRow direction="row">
          <Input
            label="Gesamtdauer (Min)"
            type="number"
            required
            fullWidth
            inputProps={register('durationTotalMinutes', {
              valueAsNumber: true,
              min: 1,
            })}
            helperText="Wie lange ist die Werkstatt belegt?"
          />
          <Input
            label="Kundendauer (Min)"
            type="number"
            required
            fullWidth
            inputProps={register('durationCustomerMinutes', {
              valueAsNumber: true,
              min: 0,
            })}
            helperText="Wie lange muss der Kunde dabei sein?"
          />
        </FormRow>

        <FormRow>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Service ist aktiv buchbar"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormRow>

        <ButtonContainer>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isDirty || !isValid}
          >
            <>
              <MaterialIcon icon="save" iconSize="small" /> Speichern
            </>
          </Button>
        </ButtonContainer>
      </FormContainer>
    </div>
  );
};

export default ServiceForm;
