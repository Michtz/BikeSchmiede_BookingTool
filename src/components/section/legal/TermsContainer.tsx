'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const TermsContainer: React.FC = () => {
  // bewusst nicht übersetzt da nur example für ev privat Kunden
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
        <h1 className={style.title}>Allgemeine Geschäftsbedingungen (AGB)</h1>

        <p className={style.paragraph} style={{ color: 'red' }}>
          <strong>
            Achtung der komplette Shop ist nur ein Schulprojekt und es kan
            nichts erworben werden!
          </strong>
        </p>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>1. Geltungsbereich</h2>
            <p className={style.paragraph}>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge
              zwischen uns und unseren Kunden über die Lieferung von Waren, die
              in unserem Online-Shop angeboten werden. Abweichende Bedingungen
              des Kunden erkennen wir nicht an, es sei denn, wir stimmen ihrer
              Geltung ausdrücklich schriftlich zu.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>2. Vertragsschluss</h2>
            <p className={style.paragraph}>
              Die Darstellung der Produkte in unserem Online-Shop stellt kein
              bindendes Angebot, sondern einen unverbindlichen Online-Katalog
              dar. Durch Anklicken des Buttons &quot;Kaufen&quot; geben Sie eine
              verbindliche Bestellung der auf der Bestellseite aufgelisteten
              Waren ab.
            </p>
            <p className={style.paragraph}>
              Der Vertrag kommt zustande, wenn wir Ihre Bestellung durch eine
              Auftragsbestätigung per E-Mail unmittelbar nach dem Erhalt Ihrer
              Bestellung annehmen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              3. Preise und Zahlungsbedingungen
            </h2>
            <p className={style.paragraph}>
              Alle Preise verstehen sich inklusive der gesetzlichen
              Mehrwertsteuer und sonstiger Preisbestandteile. Hinzu kommen
              etwaige Versandkosten.
            </p>
            <p className={style.paragraph}>
              Die Zahlung erfolgt wahlweise per Vorkasse, Paypal,
              Sofortüberweisung oder Kreditkarte. Bei Zahlung per Vorkasse
              erfolgt die Lieferung nach Zahlungseingang.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>4. Lieferung</h2>
            <p className={style.paragraph}>
              Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse.
              Die Lieferzeit beträgt in der Regel 2-5 Werktage nach
              Vertragsschluss bzw. nach Zahlungseingang.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>5. Widerrufsrecht</h2>
            <p className={style.paragraph}>
              Verbrauchern steht ein Widerrufsrecht nach Maßgabe der
              gesetzlichen Bestimmungen zu. Das Widerrufsrecht beträgt 14 Tage
              und beginnt mit Erhalt der Ware.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>6. Gewährleistung</h2>
            <p className={style.paragraph}>
              Es gelten die gesetzlichen Gewährleistungsbestimmungen. Bei
              Verbrauchern beträgt die Gewährleistungsfrist für neue Waren zwei
              Jahre ab Ablieferung der Ware.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>7. Datenschutz</h2>
            <p className={style.paragraph}>
              Ihre personenbezogenen Daten werden gemäß unserer
              Datenschutzerklärung verarbeitet. Diese finden Sie unter dem
              entsprechenden Link in unserem Online-Shop.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TermsContainer;
