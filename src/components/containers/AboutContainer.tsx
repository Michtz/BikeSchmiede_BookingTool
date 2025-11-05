'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/AboutContainer.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '@/components/system/Button';

const AboutContainer: React.FC = () => {
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
      <div className={style.aboutContainer}>
        <h1 className={style.title}>{t('about.title')}</h1>
        <p className={style.subtitle}>{t('about.subtitle')}</p>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('about.project.title')}</h2>
            <p className={style.paragraph}>{t('about.project.description')}</p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('about.technical.title')}</h2>

            <div className={style.techStack}>
              <div className={style.stackColumn}>
                <h3>{t('about.technical.frontend.title')}</h3>
                <ul className={style.list}>
                  <li>{t('about.technical.frontend.react')}</li>
                  <li>{t('about.technical.frontend.i18n')}</li>
                  <li>{t('about.technical.frontend.scss')}</li>
                  <li>{t('about.technical.frontend.socket')}</li>
                  <li>{t('about.technical.frontend.oauth')}</li>
                </ul>
              </div>

              <div className={style.stackColumn}>
                <h3>{t('about.technical.backend.title')}</h3>
                <ul className={style.list}>
                  <li>{t('about.technical.backend.api')}</li>
                  <li>{t('about.technical.backend.mongodb')}</li>
                  <li>{t('about.technical.backend.jwt')}</li>
                  <li>{t('about.technical.backend.session')}</li>
                  <li>{t('about.technical.backend.stripe')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('about.features.title')}</h2>
            <ul className={style.featureList}>
              <li>
                <strong>{t('about.features.user.title')}:</strong>{' '}
                {t('about.features.user.desc')}
              </li>
              <li>
                <strong>{t('about.features.admin.title')}:</strong>{' '}
                {t('about.features.admin.desc')}
              </li>
              <li>
                <strong>{t('about.features.shop.title')}:</strong>{' '}
                {t('about.features.shop.desc')}
              </li>
              <li>
                <strong>{t('about.features.payment.title')}:</strong>{' '}
                {t('about.features.payment.desc')}
              </li>
              <li>
                <strong>{t('about.features.blog.title')}:</strong>{' '}
                {t('about.features.blog.desc')}
              </li>
              <li>
                <strong>{t('about.features.realtime.title')}:</strong>{' '}
                {t('about.features.realtime.desc')}
              </li>
              <li>
                <strong>{t('about.features.google.title')}:</strong>{' '}
                {t('about.features.google.desc')}
              </li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              {t('about.deployment.title')}
            </h2>
            <ul className={style.list}>
              <li>
                <strong>Frontend:</strong> {t('about.deployment.frontend')}
              </li>
              <li>
                <strong>Backend:</strong> {t('about.deployment.backend')}
              </li>
              <li>
                <strong>Database:</strong> {t('about.deployment.database')}
              </li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>{t('about.scope.title')}</h2>
            <p className={style.paragraph}>{t('about.scope.description')}</p>

            <div className={style.infoBox}>
              <p>
                <strong>{t('about.scope.period')}:</strong>{' '}
                {t('about.scope.periodValue')}
              </p>
              <p>
                <strong>{t('about.scope.developer')}:</strong>{' '}
                {t('about.scope.developerName')}
              </p>
              <p>
                <strong>{t('about.scope.education')}:</strong>{' '}
                {t('about.scope.educationValue')}
              </p>
            </div>
          </div>

          <div className={style.disclaimer}>
            <p className={style.paragraph}>
              <em>{t('about.disclaimer')}</em>
            </p>
            <Button href={'https://kaffeezentrale.ch/'}>
              {t('goToKaffeeZentrale')}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutContainer;
