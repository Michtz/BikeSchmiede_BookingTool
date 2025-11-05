'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';
import { useTranslation } from 'react-i18next';

const FAQContainer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container
      flow="column"
      alignItems="center"
      justifyContent="flex-start"
      padding={true}
      maxWidth="1150"
      gap="2"
    >
      <div className={style.legalContainer}>
        <h1 className={style.title}>{t('faq.title')}</h1>

        <div className={style.content}>
          <div className={style.section}>
            <p className={style.paragraph} style={{ color: 'red' }}>
              <strong>
                Achtung der komplette Shop ist nur ein Schulprojekt und es kan
                nichts erworben werden!
              </strong>
            </p>

            <h2 className={style.sectionTitle}>
              {t('faq.sections.orderPayment')}
            </h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.orderPayment.howToOrder.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.orderPayment.howToOrder.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.orderPayment.paymentMethods.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.orderPayment.paymentMethods.answer')}
              </p>
              <ul className={style.list}>
                <li>{t('faq.orderPayment.paymentMethods.method1')}</li>
                <li>{t('faq.orderPayment.paymentMethods.method2')}</li>
                <li>{t('faq.orderPayment.paymentMethods.method3')}</li>
                <li>{t('faq.orderPayment.paymentMethods.method4')}</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.orderPayment.changeOrder.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.orderPayment.changeOrder.answer')}
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('faq.sections.shippingDelivery')}
            </h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.shippingDelivery.deliveryTime.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.shippingDelivery.deliveryTime.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.shippingDelivery.shippingCosts.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.shippingDelivery.shippingCosts.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.shippingDelivery.trackOrder.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.shippingDelivery.trackOrder.answer')}
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('faq.sections.returnExchange')}
            </h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.returnExchange.canReturn.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.returnExchange.canReturn.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.returnExchange.returnCosts.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.returnExchange.returnCosts.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.returnExchange.refundTime.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.returnExchange.refundTime.answer')}
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('faq.sections.accountService')}
            </h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.accountService.needAccount.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.accountService.needAccount.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.accountService.resetPassword.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.accountService.resetPassword.answer')}
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>
                {t('faq.accountService.unsubscribeNewsletter.question')}
              </h3>
              <p className={style.paragraph}>
                {t('faq.accountService.unsubscribeNewsletter.answer')}
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('faq.sections.products')}</h2>

            <h3 className={style.sectionTitle}>
              {t('faq.products.colorAccuracy.question')}
            </h3>
            <p className={style.paragraph}>
              {t('faq.products.colorAccuracy.answer')}
            </p>
          </div>

          <div className={style.section}>
            <h3 className={style.sectionTitle}>
              {t('faq.products.availability.question')}
            </h3>
            <p className={style.paragraph}>
              {t('faq.products.availability.answer')}
            </p>
          </div>
        </div>

        <div className={style.section}>
          <h2 className={style.sectionTitle}>
            {t('faq.sections.moreQuestions')}
          </h2>
          <p className={style.paragraph}>{t('faq.contact.description')}</p>
          <ul className={style.list}>
            <li>
              <strong>{t('faq.contact.phone')}:</strong> +41 00 000 00 00
            </li>
            <li>
              <strong>{t('faq.contact.email')}:</strong> onlyExample@example.ch
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default FAQContainer;
