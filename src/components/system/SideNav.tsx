import React, { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import style from '@/styles/system/SideNav.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import Logo from '@/components/icons/Logo';
import { Params } from 'next/dist/server/request/params';
import {
  handleLanguageChange,
  LanguageOptionType,
  languagesOptions,
} from '@/i18n/client';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { sessionData } = useAuth();
  const params: Params = useParams();
  const path: string = usePathname();

  useEffect(() => {
    onClose();
  }, [path]); /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <>
      <div
        className={`${style.backdrop} ${isOpen ? style.backdropVisible : ''}`}
        onClick={onClose}
      />

      <nav className={`${style.sideNav} ${isOpen ? style.sideNavOpen : ''}`}>
        <div className={style.sideNavContent}>
          <div className={style.navSection}>
            <Logo width={250} height={30} />
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/">{t('nav.home')}</Link>
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

          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>{t('sideNav.language')}</h3>
            <ul className={style.navList}>
              {languagesOptions.map((obj: LanguageOptionType) => (
                <li className={style.navItem} key={obj.code}>
                  <Link
                    className={
                      params.locale === obj.code ? style.activeLanguage : ''
                    }
                    onClick={() =>
                      handleLanguageChange({
                        language: obj.code,
                        router,
                        path,
                        preferences: sessionData?.data.preferences,
                        sessionId: sessionData?.sessionId as string,
                        action: i18n.changeLanguage,
                      })
                    }
                  >
                    {obj.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
