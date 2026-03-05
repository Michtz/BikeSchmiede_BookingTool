'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, FormRow, FormTitle } from '../form/Form';
import Input from '../input/Input';
import Select from '../select/Select';
import Button, { ButtonContainer } from '../button/Button';
import style from './Calculator.module.scss';
import BookingModal from '@/components/modals/BookingModal';

interface CalculatorOption {
  label: string;
  value: string;
  price: number;
}

const CALCULATOR_OPTIONS: Record<string, CalculatorOption[]> = {
  frame: [
    {
      label: 'Odin Carbon Race Frame - Matte Black',
      value: 'frame_carbon_black',
      price: 100,
    },
    {
      label: 'Odin Carbon Race Frame - Glossy White',
      value: 'frame_carbon_white',
      price: 100,
    },
    {
      label: 'Odin Titanium Endurance Frame',
      value: 'frame_titanium',
      price: 100,
    },
  ],
  gruppe: [
    { label: 'Shimano Dura-Ace Di2', value: 'shimano_dura_ace', price: 100 },
    { label: 'SRAM Red eTap AXS', value: 'sram_red_etap', price: 100 },
    {
      label: 'Campagnolo Super Record EPS',
      value: 'campagnolo_super_record',
      price: 100,
    },
  ],
  laufrader: [
    { label: 'DT Swiss ARC 1100 Dicut', value: 'dt_swiss_arc', price: 100 },
    { label: 'Zipp 404 Firecrest', value: 'zipp_404', price: 100 },
    { label: 'Enve SES 5.6', value: 'enve_ses', price: 100 },
  ],
  reifen: [
    {
      label: 'Continental Grand Prix 5000 S TR',
      value: 'conti_gp5000',
      price: 100,
    },
    { label: 'Vittoria Corsa Pro', value: 'vittoria_corsa', price: 100 },
    { label: 'Schwalbe Pro One', value: 'schwalbe_pro_one', price: 100 },
  ],
  tretlager: [
    { label: 'CeramicSpeed Coated', value: 'ceramicspeed', price: 100 },
    { label: 'Shimano Dura-Ace', value: 'shimano_bb', price: 100 },
    { label: 'Chris King ThreadFit', value: 'chris_king', price: 100 },
  ],
  lenkerband: [
    { label: 'Supacaz Super Sticky Kush', value: 'supacaz', price: 100 },
    { label: 'Lizard Skins DSP 2.5', value: 'lizard_skins', price: 100 },
    { label: 'Fizik Vento Solocush', value: 'fizik_vento', price: 100 },
  ],
  sattel: [
    { label: 'Selle Italia SLR Boost', value: 'selle_italia', price: 100 },
    { label: 'Fizik Antares Versus Evo', value: 'fizik_antares', price: 100 },
    {
      label: 'Specialized S-Works Power',
      value: 'specialized_power',
      price: 100,
    },
  ],
};

type CalculatorOptions =
  | 'frame'
  | 'gruppe'
  | 'laufrader'
  | 'reifen'
  | 'tretlager'
  | 'lenkerband'
  | 'sattel'
  | 'email';

type CalculatorState = Record<CalculatorOptions, string>;

export const Calculator: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<CalculatorState>();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formValues: CalculatorState = watch();

  const currentTotal = Object.keys(CALCULATOR_OPTIONS).reduce((total, key) => {
    const selectedValue = formValues[key as keyof CalculatorState];
    const option = CALCULATOR_OPTIONS[key].find(
      (o) => o.value === selectedValue,
    );
    return total + (option?.price || 0);
  }, 0);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isModalOpen]);

  const onSubmit = async (data: CalculatorState) => {
    setLoading(true);
    setIsModalOpen(true);
    setLoading(false);
  }; // Todo: fix submit and use it to open..

  const bookingDataString = `
Konfiguration:
Rahmen: ${formValues.frame}
Gruppe: ${formValues.gruppe}
Laufräder: ${formValues.laufrader}
Reifen: ${formValues.reifen}
Tretlager: ${formValues.tretlager}
Lenkerband: ${formValues.lenkerband}
Sattel: ${formValues.sattel}

Gesamtpreis: ${currentTotal} €
Kunden-Email: ${formValues.email}
`.trim();

  return (
    <div className={style.calculatorContainer}>
      <FormContainer onSubmitAction={handleSubmit(onSubmit)} className="">
        <FormTitle
          title="ODIN Konfigurator"
          description="Konfigurieren Sie Ihr Traumrad und erhalten Sie das Angebot per E-Mail oder buchen Sie einen Termin für die Beratung."
        />
        <FormRow direction="column" gap="medium">
          <Select
            label="Rahmen-Type:"
            options={CALCULATOR_OPTIONS.frame}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('frame')}
          />
          <Select
            label="Schalt-Gruppe:"
            options={CALCULATOR_OPTIONS.gruppe}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('gruppe')}
          />
          <Select
            label="Laufräder:"
            options={CALCULATOR_OPTIONS.laufrader}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('laufrader')}
          />
        </FormRow>
        <FormRow direction="column" gap="medium">
          <Select
            label="Reifen:"
            options={CALCULATOR_OPTIONS.reifen}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('reifen')}
          />
          <Select
            label="Tretlager:"
            options={CALCULATOR_OPTIONS.tretlager}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('tretlager')}
          />
        </FormRow>
        <FormRow direction="column" gap="medium">
          <Select
            label="Lenkerband:"
            options={CALCULATOR_OPTIONS.lenkerband}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('lenkerband')}
          />
          <Select
            label="Sattel"
            options={CALCULATOR_OPTIONS.sattel}
            placeholder="Bitte wählen..."
            fullWidth
            required
            {...register('sattel')}
          />
        </FormRow>
        <div className={style.sectionTitle}>Zusammenfassung</div>
        <ul className={style.summaryList}>
          {(Object.keys(formValues) as CalculatorOptions[]).map((opt) => {
            if (!formValues[opt]) return null;
            return (
              <li className={style.summaryItem} key={opt}>
                <span>{opt}: </span>
                <span>
                  {formValues[opt]} &nbsp;
                  {
                    CALCULATOR_OPTIONS[opt]?.find(
                      (items) => items.value === formValues[opt],
                    )?.price
                  }
                  Chf.
                </span>
              </li>
            );
          })}
        </ul>
        <div className={style.totalSection}>
          <span className={style.totalLabel}>Aktueller Preis:</span>
          <span className={style.totalPrice}>{currentTotal} Chf.</span>
        </div>
        <FormRow direction="column" gap="medium">
          <Input
            label="E-Mail Adresse"
            type="email"
            placeholder="ihre.email@beispiel.com"
            fullWidth
            required
            helperText="Wir senden Ihnen die Konfiguration an diese Adresse."
            {...register('email')}
          />
          <ButtonContainer side={'right'}>
            {/*<Button*/}
            {/*  type="submit"*/}
            {/*  variant="secondary"*/}
            {/*  loading={loading}*/}
            {/*  disabled={success}*/}
            {/*>*/}
            {/*  {success ? 'Gesendet!' : 'Kalkulation Senden'}*/}
            {/*</Button>*/}
            <Button type="submit" variant="primary" loading={loading}>
              Beratung Buchen
            </Button>
          </ButtonContainer>
        </FormRow>
      </FormContainer>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calLink="michael-venetz-mer2x6"
        notes={bookingDataString}
      />
    </div>
  );
};

export default Calculator;
