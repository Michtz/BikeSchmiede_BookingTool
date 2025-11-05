'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const ImprintContainer: React.FC = () => {
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
        <h1 className={style.title}>
          Impressum
        </h1>
        
        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Angaben gemäß § 5 TMG</h2>
            <p className={style.paragraph}>
              <strong>MyShop GmbH</strong><br />
              Musterstraße 123<br />
              12345 Musterstadt<br />
              Deutschland
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Vertreten durch</h2>
            <p className={style.paragraph}>
              Geschäftsführer: Max Mustermann
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kontakt</h2>
            <p className={style.paragraph}>
              <strong>Telefon:</strong> +49 (0) 123 456789<br />
              <strong>E-Mail:</strong> info@myshop.de<br />
              <strong>Website:</strong> www.myshop.de
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Registereintrag</h2>
            <p className={style.paragraph}>
              <strong>Registergericht:</strong> Amtsgericht Musterstadt<br />
              <strong>Registernummer:</strong> HRB 12345
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Umsatzsteuer-ID</h2>
            <p className={style.paragraph}>
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              DE123456789
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className={style.paragraph}>
              Max Mustermann<br />
              Musterstraße 123<br />
              12345 Musterstadt
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Streitschlichtung</h2>
            <p className={style.paragraph}>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className={style.paragraph}>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Haftung für Inhalte</h2>
            <p className={style.paragraph}>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ImprintContainer;