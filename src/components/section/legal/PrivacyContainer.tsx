'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';
import { useTranslation } from 'react-i18next';

const PrivacyContainer: React.FC = () => {
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
        <h1 className={style.title}>{t('privacy.title')}</h1>
        <p className={style.lastUpdate}>
          {t('privacy.lastUpdate')}: 04.09.2025
        </p>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.overview.title')}
            </h2>
            <p className={style.paragraph}>{t('privacy.overview.intro')}</p>

            <div className={style.infoBox}>
              <h3>{t('privacy.overview.dataCollection')}</h3>
              <p>{t('privacy.overview.dataCollectionDesc')}</p>
            </div>

            <div className={style.infoBox}>
              <h3>{t('privacy.overview.dataUse')}</h3>
              <p>{t('privacy.overview.dataUseDesc')}</p>
            </div>

            <div className={style.infoBox}>
              <h3>{t('privacy.overview.dataProtection')}</h3>
              <p>{t('privacy.overview.dataProtectionDesc')}</p>
            </div>
          </div>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.responsible.title')}
            </h2>
            <p className={style.paragraph}>{t('privacy.responsible.text')}</p>
            <div className={style.contactInfo}>
              <p>
                <strong>Barista Accessoire</strong>
                <br />
                MusterStrasse 420
                <br />
                8000
                <br />
                Schweiz
              </p>
              <p>
                <strong>E-Mail:</strong> kontakt@barista-accessoire.ch
                <br />
              </p>
            </div>
          </div>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.visitData.title')}
            </h2>

            <h3 className={style.subsectionTitle}>
              {t('privacy.visitData.serverLogs.title')}
            </h3>
            <p className={style.paragraph}>
              {t('privacy.visitData.serverLogs.desc')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.visitData.serverLogs.browserType')}</li>
              <li>{t('privacy.visitData.serverLogs.os')}</li>
              <li>{t('privacy.visitData.serverLogs.referrer')}</li>
              <li>{t('privacy.visitData.serverLogs.timestamp')}</li>
              <li>{t('privacy.visitData.serverLogs.ip')}</li>
              <li>{t('privacy.account.registration.language')}</li>
            </ul>
            <p className={style.paragraph}>
              {t('privacy.visitData.serverLogs.purpose')}
            </p>
          </div>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('privacy.account.title')}</h2>

            <h3 className={style.subsectionTitle}>
              {t('privacy.account.registration.title')}
            </h3>
            <p className={style.paragraph}>
              {t('privacy.account.registration.desc')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.account.registration.email')}</li>
              <li>{t('privacy.account.registration.password')}</li>
              <li>{t('privacy.account.registration.name')}</li>
              <li>{t('privacy.account.orders.deliveryAddress')}</li>
            </ul>
            <p className={style.paragraph}>
              <strong>{t('privacy.legalBasis')}:</strong>{' '}
              {t('privacy.account.registration.legalBasis')}
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.retention')}:</strong>{' '}
              {t('privacy.account.registration.retention')}
            </p>

            <h3 className={style.subsectionTitle}>
              {t('privacy.account.orders.title')}
            </h3>
            <p className={style.paragraph}>
              {t('privacy.account.orders.desc')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.account.orders.orderHistory')}</li>
              <li>{t('privacy.account.orders.transactionId')}</li>
              <li>{t('privacy.account.orders.paymentStatus')}</li>
            </ul>
            <p className={style.paragraph}>
              <strong>{t('privacy.legalBasis')}:</strong>{' '}
              {t('privacy.account.orders.legalBasis')}
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.retention')}:</strong>{' '}
              {t('privacy.account.orders.retention')}
            </p>
          </div>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('privacy.payment.title')}</h2>

            <h3 className={style.subsectionTitle}>Stripe</h3>
            <p className={style.paragraph}>
              {t('privacy.payment.stripe.desc')}
            </p>
            <p className={style.paragraph}>
              {t('privacy.payment.stripe.data')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.payment.stripe.cardNumber')}</li>
              <li>{t('privacy.payment.stripe.expiry')}</li>
              <li>{t('privacy.payment.stripe.cvv')}</li>
              <li>{t('privacy.payment.stripe.name')}</li>
              <li>{t('privacy.payment.stripe.address')}</li>
            </ul>
            <p className={style.paragraph}>
              {t('privacy.payment.stripe.storage')}
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.payment.stripe.provider')}:</strong>
              <br />
              Stripe, Inc.
              <br />
              510 Townsend Street
              <br />
              San Francisco, CA 94103
              <br />
              USA
            </p>
            <p className={style.paragraph}>
              {t('privacy.payment.stripe.privacy')}:{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={style.link}
              >
                https://stripe.com/privacy
              </a>
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.security.title')}
            </h2>
            <p className={style.paragraph}>{t('privacy.security.measures')}</p>
            <ul className={style.list}>
              <li>{t('privacy.security.ssl')}</li>
              <li>{t('privacy.security.encryption')}</li>
              <li>{t('privacy.security.access')}</li>
              <li>{t('privacy.security.monitoring')}</li>
              <li>{t('privacy.security.updates')}</li>
            </ul>
            <p className={style.paragraph}>
              {t('privacy.security.disclaimer')}
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.noSharing.title')}
            </h2>
            <p className={style.paragraph}>
              <strong>{t('privacy.noSharing.statement')}</strong>
            </p>
            <p className={style.paragraph}>
              {t('privacy.noSharing.exceptions')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.noSharing.legal')}</li>
              <li>{t('privacy.noSharing.delivery')}</li>
              <li>{t('privacy.noSharing.payment')}</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('privacy.externalServices.title')}
            </h2>

            <h3 className={style.subsectionTitle}>
              {t('privacy.externalServices.googleFonts.title')}
            </h3>
            <p className={style.paragraph}>
              {t('privacy.externalServices.googleFonts.desc')}
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.externalServices.provider')}:</strong>
              <br />
              Google Ireland Limited
              <br />
              Gordon House, Barrow Street
              <br />
              Dublin 4, Irland
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.legalBasis')}:</strong>{' '}
              {t('privacy.externalServices.googleFonts.legalBasis')}
            </p>
            <p className={style.paragraph}>
              {t('privacy.externalServices.googleFonts.privacy')}:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={style.link}
              >
                https://policies.google.com/privacy
              </a>
            </p>

            <h3 className={style.subsectionTitle}>
              {t('privacy.externalServices.cloudinary.title')}
            </h3>
            <p className={style.paragraph}>
              {t('privacy.externalServices.cloudinary.desc')}
            </p>
            <p className={style.paragraph}>
              {t('privacy.externalServices.cloudinary.data')}
            </p>
            <ul className={style.list}>
              <li>{t('privacy.externalServices.cloudinary.ip')}</li>
              <li>{t('privacy.externalServices.cloudinary.browser')}</li>
              <li>{t('privacy.externalServices.cloudinary.timestamp')}</li>
            </ul>
            <p className={style.paragraph}>
              <strong>{t('privacy.externalServices.provider')}:</strong>
              <br />
              Cloudinary Ltd.
              <br />
              111 W Evelyn Ave, Suite 206
              <br />
              Sunnyvale, CA 94086, USA
            </p>
            <p className={style.paragraph}>
              <strong>{t('privacy.legalBasis')}:</strong>{' '}
              {t('privacy.externalServices.cloudinary.legalBasis')}
            </p>
            <p className={style.paragraph}>
              {t('privacy.externalServices.cloudinary.privacy')}:{' '}
              <a
                href="https://cloudinary.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={style.link}
              >
                https://cloudinary.com/privacy
              </a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyContainer;
