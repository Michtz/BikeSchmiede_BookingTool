'use client';

import React from 'react';
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import style from '@/styles/admin/ProductForm.module.scss';
import {
  ISchedule,
  CreateScheduleRequest,
  IWeekProfile,
} from '@/types/schedule.types';
import { createSchedule, updateSchedule } from '@/requests/schedule.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import { mutate } from 'swr';
import { FormContainer, FormRow } from '@/components/system/Form';
import Input from '@/components/system/Input';
import Button, { ButtonContainer } from '@/components/system/Button';
import MaterialIcon from '@/components/system/MaterialIcon';

interface ScheduleFormProps {
  onClose: () => void;
  schedule?: ISchedule;
}

const DAYS = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' },
];

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onClose, schedule }) => {
  const { showFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isLoading, isDirty, isValid },
  } = useForm<CreateScheduleRequest>({
    defaultValues: {
      name: schedule?.name || '',
      validFrom: schedule?.validFrom
        ? new Date(schedule.validFrom).toISOString().split('T')[0]
        : '',
      validUntil: schedule?.validUntil
        ? new Date(schedule.validUntil).toISOString().split('T')[0]
        : undefined,
      isActive: schedule?.isActive ?? false,
      slotDurationMinutes: schedule?.slotDurationMinutes || 60,
      openingHours: schedule?.openingHours || {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    },
    mode: 'onChange',
  });

  const openingHours = watch('openingHours');

  // Helper zum Hinzufügen eines Slots zu einem Tag
  const addSlot = (day: string) => {
    const currentSlots = (openingHours as any)[day] || [];
    const newSlots = [...currentSlots, { start: '09:00', end: '12:00' }];
    setValue(`openingHours.${day}` as any, newSlots, { shouldDirty: true });
  };

  // Helper zum Entfernen eines Slots
  const removeSlot = (day: string, index: number) => {
    const currentSlots = (openingHours as any)[day] || [];
    const newSlots = currentSlots.filter((_: any, i: number) => i !== index);
    setValue(`openingHours.${day}` as any, newSlots, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<CreateScheduleRequest> = async (data) => {
    try {
      // Datum validieren (optional: Enddatum leer lassen erlaubt)
      if (data.validUntil === '') delete data.validUntil;

      if (schedule?._id) {
        await updateSchedule(schedule._id, data);
        showFeedback('Plan aktualisiert', 'success');
      } else {
        await createSchedule(data);
        showFeedback('Plan erstellt', 'success');
      }
      mutate('/api/schedules');
      onClose();
    } catch (e) {
      showFeedback('Fehler beim Speichern', 'error');
    }
  };

  return (
    <div className={style.productForm}>
      <div className={style.formHeader}>
        <h2>{schedule ? 'Plan bearbeiten' : 'Neuen Zeitplan erstellen'}</h2>
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
            label="Name des Plans (z.B. Sommer 2025)"
            required
            fullWidth
            inputProps={register('name', { required: 'Name ist erforderlich' })}
            error={!!errors.name}
          />
        </FormRow>

        <FormRow direction="row">
          <Input
            label="Gültig ab"
            type="date"
            required
            fullWidth
            inputProps={register('validFrom', {
              required: 'Startdatum erforderlich',
            })}
          />
          <Input
            label="Gültig bis (optional)"
            type="date"
            fullWidth
            inputProps={register('validUntil')}
          />
        </FormRow>

        <FormRow>
          <Input
            label="Slot-Dauer (Minuten)"
            type="number"
            required
            fullWidth
            inputProps={register('slotDurationMinutes', {
              valueAsNumber: true,
              min: 15,
            })}
            helperText="Standard-Dauer eines Termins (z.B. 60 Min)"
          />
        </FormRow>

        <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>
          Öffnungszeiten
        </h3>

        {DAYS.map((day) => (
          <div
            key={day.key}
            style={{
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <strong>{day.label}</strong>
              <Button
                size="small"
                variant="secondary"
                onClick={() => addSlot(day.key)}
                icon="add"
              >
                Zeit hinzufügen
              </Button>
            </div>

            {/* Slots rendern */}
            {((openingHours as any)[day.key] || []).map(
              (slot: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <Input
                    type="time"
                    // @ts-ignore
                    inputProps={register(
                      `openingHours.${day.key}.${index}.start` as const,
                      { required: true },
                    )}
                    containerStyle={{ width: '150px' }}
                  />
                  <span>bis</span>
                  <Input
                    type="time"
                    // @ts-ignore
                    inputProps={register(
                      `openingHours.${day.key}.${index}.end` as const,
                      { required: true },
                    )}
                    containerStyle={{ width: '150px' }}
                  />
                  <Button
                    appearance="icon"
                    variant="ghost"
                    icon="delete"
                    onClick={() => removeSlot(day.key, index)}
                    title="Slot entfernen"
                  />
                </div>
              ),
            )}

            {(openingHours as any)[day.key]?.length === 0 && (
              <div
                style={{
                  fontSize: '0.9em',
                  color: '#888',
                  fontStyle: 'italic',
                }}
              >
                Geschlossen
              </div>
            )}
          </div>
        ))}

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

export default ScheduleForm;
