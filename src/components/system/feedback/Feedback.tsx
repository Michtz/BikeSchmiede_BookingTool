'use client';
import React from 'react';
import MaterialIcon from '@/components/system/materialIcon/MaterialIcon';
import { useFeedback } from '@/hooks/FeedbackHook';
import styles from '@/components/system/feedback/Feedback.module.scss';

const Feedback: React.FC = React.memo(() => {
  const { isVisible, variant, label } = useFeedback();
  if (!isVisible) return null;

  const icon: string = variant === 'success' ? 'check' : 'error';
  return (
    <section className={styles.feedbackContainer} data-variant={variant}>
      <MaterialIcon icon={icon} color={'white'} />
      <div className={styles.feedbackContent}>{label}</div>
    </section>
  );
});

Feedback.displayName = 'Feedback';

export default Feedback;
