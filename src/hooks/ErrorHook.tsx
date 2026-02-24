'use client';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FieldError } from 'react-hook-form';

/*
 * this hook is used to handle errors in forms
 */
interface TransformedFieldError {
  error: boolean;
  helperText?: string;
}

interface ErrorHook {
  transformFieldError: (error?: FieldError) => TransformedFieldError;
}

const errorMessages: { [key: string]: string } = {
  notAEmail: 'Geben Sie eine gültige E-Mail-Adresse ein.',
  required: 'Dieses Feld ist erforderlich.',
  email: 'Geben Sie eine gültige E-Mail-Adresse ein.',
  minLength: 'Die Eingabe ist zu kurz.',
  maxLength: 'Die Eingabe ist zu lang.',
  toSmall: 'Der Wert ist zu klein.',
  noValidEmail: 'Ungültige E-Mail-Adresse.',
  notTheSamePassword: 'Die Passwörter stimmen nicht überein.',
  invalidPhoneNumber: 'Ungültige Telefonnummer.',
};

const ErrorContext = createContext<ErrorHook | undefined>(undefined);

export const ErrorProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const transformFieldError = (error?: FieldError): TransformedFieldError => {
    if (!error) return { error: false };
    const errorKey: string | undefined = error.message || error.type;
    if (errorKey && errorKey in errorMessages)
      return {
        error: true,
        helperText: errorMessages[errorKey],
      };

    return {
      error: true,
      helperText: 'Es ist ein Fehler aufgetreten.',
    };
  };

  return (
    <ErrorContext.Provider value={{ transformFieldError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorHook => {
  const context: ErrorHook | undefined = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
