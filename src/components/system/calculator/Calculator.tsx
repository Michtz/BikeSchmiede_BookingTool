'use client';

import React, { FormEvent, useState } from 'react';
import { FormContainer, FormRow, FormTitle } from '../form/Form';
import Input from '../input/Input';
import Select from '../select/Select';
import Button from '../button/Button';
import style from './Calculator.module.scss';

// Example data for the dropdowns
const CALCULATOR_OPTIONS = {
  frame: [
    {
      label: 'Odin Carbon Race Frame - Matte Black',
      value: 'frame_carbon_black',
    },
    {
      label: 'Odin Carbon Race Frame - Glossy White',
      value: 'frame_carbon_white',
    },
    { label: 'Odin Titanium Endurance Frame', value: 'frame_titanium' },
  ],
  gruppe: [
    { label: 'Shimano Dura-Ace Di2', value: 'shimano_dura_ace' },
    { label: 'SRAM Red eTap AXS', value: 'sram_red_etap' },
    { label: 'Campagnolo Super Record EPS', value: 'campagnolo_super_record' },
  ],
  laufrader: [
    { label: 'DT Swiss ARC 1100 Dicut', value: 'dt_swiss_arc' },
    { label: 'Zipp 404 Firecrest', value: 'zipp_404' },
    { label: 'Enve SES 5.6', value: 'enve_ses' },
  ],
  reifen: [
    { label: 'Continental Grand Prix 5000 S TR', value: 'conti_gp5000' },
    { label: 'Vittoria Corsa Pro', value: 'vittoria_corsa' },
    { label: 'Schwalbe Pro One', value: 'schwalbe_pro_one' },
  ],
  tretlager: [
    { label: 'CeramicSpeed Coated', value: 'ceramicspeed' },
    { label: 'Shimano Dura-Ace', value: 'shimano_bb' },
    { label: 'Chris King ThreadFit', value: 'chris_king' },
  ],
  lenkerband: [
    { label: 'Supacaz Super Sticky Kush', value: 'supacaz' },
    { label: 'Lizard Skins DSP 2.5', value: 'lizard_skins' },
    { label: 'Fizik Vento Solocush', value: 'fizik_vento' },
  ],
  sattel: [
    { label: 'Selle Italia SLR Boost', value: 'selle_italia' },
    { label: 'Fizik Antares Versus Evo', value: 'fizik_antares' },
    { label: 'Specialized S-Works Power', value: 'specialized_power' },
  ],
};

interface CalculatorState {
  frame: string;
  gruppe: string;
  laufrader: string;
  reifen: string;
  tretlager: string;
  lenkerband: string;
  sattel: string;
  email: string;
}

const INITIAL_STATE: CalculatorState = {
  frame: '',
  gruppe: '',
  laufrader: '',
  reifen: '',
  tretlager: '',
  lenkerband: '',
  sattel: '',
  email: '',
};

export const Calculator: React.FC = () => {
  const [formData, setFormData] = useState<CalculatorState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof CalculatorState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Sending calculation to:', formData.email);
    console.log('Configuration:', formData);

    setLoading(false);
    setSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      setFormData(INITIAL_STATE);
    }, 3000);
  };

  return (
    <div className={style.calculatorContainer}>
      <FormContainer
        onSubmitAction={async (e) => await handleSubmit(e)}
        className=""
      >
        <FormTitle
          title="ODIN Roadbike Kalkulator"
          description="Konfigurieren Sie Ihr Traumrad und erhalten Sie das Angebot per E-Mail."
        />

        <div className={style.sectionTitle}>Komponenten</div>

        <FormRow direction="column" gap="medium">
          <Select
            label="Frame / Rahmen"
            name="frame"
            value={formData.frame}
            onChange={(e) => handleChange('frame', e.target.value)}
            options={CALCULATOR_OPTIONS.frame}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />

          <Select
            label="Gruppe"
            name="gruppe"
            value={formData.gruppe}
            onChange={(e) => handleChange('gruppe', e.target.value)}
            options={CALCULATOR_OPTIONS.gruppe}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />

          <Select
            label="Laufräder"
            name="laufrader"
            value={formData.laufrader}
            onChange={(e) => handleChange('laufrader', e.target.value)}
            options={CALCULATOR_OPTIONS.laufrader}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />
        </FormRow>

        <FormRow direction="column" gap="medium">
          <Select
            label="Reifen"
            name="reifen"
            value={formData.reifen}
            onChange={(e) => handleChange('reifen', e.target.value)}
            options={CALCULATOR_OPTIONS.reifen}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />

          <Select
            label="Tretlager"
            name="tretlager"
            value={formData.tretlager}
            onChange={(e) => handleChange('tretlager', e.target.value)}
            options={CALCULATOR_OPTIONS.tretlager}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />
        </FormRow>

        <FormRow direction="column" gap="medium">
          <Select
            label="Lenkerband"
            name="lenkerband"
            value={formData.lenkerband}
            onChange={(e) => handleChange('lenkerband', e.target.value)}
            options={CALCULATOR_OPTIONS.lenkerband}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />

          <Select
            label="Sattel"
            name="sattel"
            value={formData.sattel}
            onChange={(e) => handleChange('sattel', e.target.value)}
            options={CALCULATOR_OPTIONS.sattel}
            placeholder="Bitte wählen..."
            fullWidth
            required
          />
        </FormRow>

        <div className={style.sectionTitle}>Abschluss</div>

        <FormRow direction="column" gap="medium">
          <Input
            label="E-Mail Adresse"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="ihre.email@beispiel.com"
            fullWidth
            required
            helperText="Wir senden Ihnen die Konfiguration an diese Adresse."
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={success}
          >
            {success ? 'Gesendet!' : 'Kalkulation Senden'}
          </Button>
        </FormRow>
      </FormContainer>
    </div>
  );
};

export default Calculator;
