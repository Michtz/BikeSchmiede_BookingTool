'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

/*
 * this hook is used to show a feedback flag (mostly for easier development)
 */
// Todo: implement function to check if production then add a prop for is visible in production
export type FeedbackVariant = 'error' | 'info' | 'success';

interface FeedbackContextType {
  isVisible: boolean;
  variant: FeedbackVariant;
  label: string;
  showFeedback: (label: string, variant: FeedbackVariant) => void;
  hideFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined,
);

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<FeedbackVariant>('success');
  const [label, setLabel] = useState('');

  const showFeedback = useCallback(
    (newLabel: string, newVariant: FeedbackVariant) => {
      setLabel(newLabel);
      setVariant(newVariant);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    },
    [],
  );

  const hideFeedback = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value = {
    isVisible,
    variant,
    label,
    showFeedback,
    hideFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
