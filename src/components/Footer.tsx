'use client';

import React, { FC } from 'react';
import Link from '@/components/system/Link';
import style from '@/styles/Footer.module.scss';
import { useTranslation } from 'react-i18next';
import Button from '@/components/system/Button';

const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerContent}>
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>
              {t('footer.navigation.customerService')}
            </h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/service/contact">
                  {t('footer.navigation.contact')}
                </Link>
              </li>
              <li>
                <Link href="/service/faq">
                  {t('footer.navigation.faqHelp')}
                </Link>
              </li>
            </ul>
          </div>

          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.legal.title')}</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/legal/terms">{t('footer.legal.terms')}</Link>
              </li>
              <li>
                <Link href="/legal/privacy">{t('footer.legal.privacy')}</Link>
              </li>
              <li>
                <Link href="/legal/imprint">{t('footer.legal.imprint')}</Link>
              </li>
              <li>
                <Link href="/legal/returns">{t('footer.legal.returns')}</Link>
              </li>
            </ul>
          </div>

          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>{t('footer.company.title')}</h3>
            <ul className={style.linkList}>
              <li>
                <Link href="/about">{t('footer.company.aboutUs')}</Link>
              </li>
            </ul>
          </div>
          <Button
            style={{ backgroundColor: 'var(--foreground)' }}
            className={style.link}
            href={'https://kaffeezentrale.ch/'}
          >
            {t('goToKaffeeZentrale')}
          </Button>
        </div>

        <div className={style.footerBottom}>
          <div className={style.copyright}>
            <p>
              {t('footer.copyright.text', {
                year: 2024,
                companyName: 'Barista Accessoire ',
              })}
            </p>
            <p>{t('footer.copyright.disclaimer')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
