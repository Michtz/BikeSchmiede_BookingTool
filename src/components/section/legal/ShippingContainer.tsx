'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const ShippingContainer: React.FC = () => {
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
        <h1 className={style.title}>Versand & Lieferung</h1>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Lieferzeiten</h2>
            <p className={style.paragraph}>
              Die Lieferzeit beträgt in der Regel 2-5 Werktage nach
              Vertragsschluss (bei vereinbarter Vorauszahlung nach
              Zahlungseingang). Bitte beachten Sie, dass an Sonn- und Feiertagen
              keine Zustellung erfolgt.
            </p>
            <ul className={style.list}>
              <li>
                <strong>Standardversand:</strong> 3-5 Werktage
              </li>
              <li>
                <strong>Expressversand:</strong> 1-2 Werktage
              </li>
              <li>
                <strong>Overnight-Express:</strong> 1 Werktag
              </li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Versandkosten</h2>
            <p className={style.paragraph}>
              Die Versandkosten richten sich nach dem Gewicht, der Größe und dem
              Zielort der Sendung:
            </p>
            <ul className={style.list}>
              <li>
                <strong>Deutschland:</strong> 4,95 EUR (kostenlos ab 50 EUR
                Bestellwert)
              </li>
              <li>
                <strong>EU-Länder:</strong> 9,95 EUR (kostenlos ab 75 EUR
                Bestellwert)
              </li>
              <li>
                <strong>Schweiz:</strong> 14,95 EUR (kostenlos ab 100 EUR
                Bestellwert)
              </li>
              <li>
                <strong>Expressversand:</strong> zzgl. 9,95 EUR
              </li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Liefergebiete</h2>
            <p className={style.paragraph}>
              Wir liefern an Adressen in folgenden Ländern:
            </p>
            <ul className={style.list}>
              <li>Schweiz</li>
              <li>Other examples</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Verpackung</h2>
            <p className={style.paragraph}>
              Ihre Bestellung wird sorgfältig und umweltfreundlich verpackt. Wir
              verwenden recycelbare Materialien und verzichten auf unnötige
              Verpackungen. Zerbrechliche Artikel werden zusätzlich geschützt.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Sendungsverfolgung</h2>
            <p className={style.paragraph}>
              Nach dem Versand Ihrer Bestellung erhalten Sie eine E-Mail mit der
              Sendungsnummer (Tracking-Code). Mit dieser Nummer können Sie den
              Versandstatus Ihrer Sendung online verfolgen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Besondere Versandbedingungen</h2>
            <p className={style.paragraph}>
              <strong>Große oder schwere Artikel:</strong> Artikel ab einem
              bestimmten Gewicht oder einer bestimmten Größe werden per
              Spedition geliefert. Die Lieferzeit beträgt hier 5-10 Werktage.
            </p>
            <p className={style.paragraph}>
              <strong>Personalisierte Artikel:</strong> Individuell angefertigte
              oder personalisierte Produkte haben eine längere Lieferzeit von
              7-14 Werktagen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Abwesenheit bei Lieferung</h2>
            <p className={style.paragraph}>
              Sollten Sie bei der Zustellung nicht anwesend sein, hinterlässt
              der Zusteller eine Benachrichtigung. Sie können das Paket dann bei
              der örtlichen Postfiliale oder einem Paketshop abholen oder einen
              neuen Zustelltermin vereinbaren.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ShippingContainer;
