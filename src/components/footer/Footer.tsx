'use client';

import React, { FC } from 'react';
import style from './Footer.module.scss';
import Link from '@/components/system/link/Link';
import MaterialIcon from '@/components/system/materialIcon/MaterialIcon';

const Footer: FC = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={style.footerContent}>
          <div className={style.footerColumn}>
            <h3 className={style.columnTitle}>Kontakt</h3>
            <ul className={style.linkList}>
              <li className={style.contactListItem}>
                <MaterialIcon icon="mail" iconSize="small" />
                <span className={style.contactContent}>
                  Email:&nbsp;
                  <a href="mailto:info@odinbikes.ch">info@odinbikes.ch</a>
                </span>
              </li>
              <li className={style.contactListItem}>
                <MaterialIcon icon="phone" iconSize="small" />
                <span className={style.contactContent}>
                  Telefon:&nbsp;
                  <a href="tel:+0413407044">+041 340 70 44</a>
                </span>
              </li>
            </ul>
          </div>

          <div className={style.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2720.1051332962143!2d8.305982377429231!3d47.018541328399124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ffb850a77b35d%3A0x1df9a8104e24d37b!2sBIKESCHMIEDE%20-%20Fahrradgesch%C3%A4ft%20%2F%20Bikefitting!5e0!3m2!1sde!2sch!4v1771950264182!5m2!1sde!2sch"
              loading="lazy"
              title="Standort Luzern"
              referrerPolicy="no-referrer-when-downgrade"
              className={style.mapIframe}
            ></iframe>
          </div>
        </div>

        <div className={`${style.footerColumn} ${style.additionalInfo}`}>
          <Link href="/legalterms" aria-label="Das Rechtliche">
            Impressum
          </Link>
          <Link href="/privacy" aria-label="Datenschutz">
            Datenschutz
          </Link>
        </div>

        <div className={style.footerBottom}>
          <div className={style.copyright}>
            <p>
              © {new Date().getFullYear()} OdinBikes. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
