'use client';
import React from 'react';
import style from './SideNav.module.scss';
import Link from '@/components/system/link/Link';
import OdinLogo from '@/components/icons/OdinLogo';

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen = false, onClose }) => {
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
                <Link href="/">Home</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/about">Über uns</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>Service</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/service/contact">Kontakt</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/customer-service">
                  Kundenservice
                </Link>
              </li>
              <li className={style.navItem}>
                <Link href="/service/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className={style.navSection}>
            <h3 className={style.sectionTitle}>Rechtliches</h3>
            <ul className={style.navList}>
              <li className={style.navItem}>
                <Link href="/legal/imprint">Impressum</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/privacy">Datenschutz</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/terms">AGB</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/shipping">Versand</Link>
              </li>
              <li className={style.navItem}>
                <Link href="/legal/returns">Rückgabe</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
