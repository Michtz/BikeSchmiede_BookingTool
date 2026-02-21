import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './SideNav.module.scss';
import Link from '@/components/system/link/Link';
import OdinLogo from '@/components/icons/OdinLogo';

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen = false, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`${style.backdrop} ${isOpen ? style.backdropVisible : ''}`}
        onClick={onClose}
      />

      <nav className={`${style.sideNav} ${isOpen ? style.sideNavOpen : ''}`}>
        <div className={style.sideNavContent}>
          <div className={style.navSection}>
            <OdinLogo width={250} height={30} />
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/public">{t('nav.home')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/about">{t('nav.about')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/blog">{t('nav.blog')}</Link>
              </li>
            </ul>
          </div>

          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.service')}</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/service/contact">{t('sideNav.contact')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/customer-service">
                  {t('sideNav.customerService')}
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/faq">{t('sideNav.faq')}</Link>
              </li>
            </ul>
          </div>

          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.legal')}</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/legal/imprint">{t('sideNav.imprint')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/privacy">{t('sideNav.privacy')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/terms">{t('sideNav.terms')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/shipping">{t('sideNav.shipping')}</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/returns">{t('sideNav.returns')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
