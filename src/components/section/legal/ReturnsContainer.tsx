'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const ReturnsContainer: React.FC = () => {
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
        <h1 className={style.title}>Rückgabe & Umtausch</h1>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Widerrufsrecht</h2>
            <p className={style.paragraph}>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
              diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
              Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
              der nicht der Beförderer ist, die Waren in Besitz genommen haben
              bzw. hat.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Rücksendevoraussetzungen</h2>
            <p className={style.paragraph}>
              Um das Widerrufsrecht auszuüben, müssen folgende Voraussetzungen
              erfüllt sein:
            </p>
            <ul className={style.list}>
              <li>Die Ware befindet sich im ursprünglichen Zustand</li>
              <li>Originalverpackung ist vorhanden</li>
              <li>Alle Etiketten und Anhänger sind noch angebracht</li>
              <li>Die Ware wurde nicht beschädigt oder verschmutzt</li>
              <li>Hygieneartikel sind ungeöffnet und versiegelt</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Ausgeschlossene Artikel</h2>
            <p className={style.paragraph}>
              Folgende Artikel sind vom Widerrufsrecht ausgeschlossen:
            </p>
            <ul className={style.list}>
              <li>Personalisierte oder individuell angefertigte Waren</li>
              <li>Verderbliche Waren oder Waren mit kurzer Haltbarkeit</li>
              <li>
                Versiegelte Waren, die aus Gründen des Gesundheitsschutzes nicht
                zur Rückgabe geeignet sind
              </li>
              <li>Waren, die nach der Lieferung vermischt wurden</li>
              <li>Digitale Inhalte ohne physischen Datenträger</li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Rückgabeprozess</h2>
            <p className={style.paragraph}>
              <strong>Schritt 1:</strong> Kontaktieren Sie uns per E-Mail an
              returns@example.ch.
            </p>
            <p className={style.paragraph}>
              <strong>Schritt 2:</strong> Sie erhalten eine Rücksendungsnummer
              und weitere Anweisungen.
            </p>
            <p className={style.paragraph}>
              <strong>Schritt 3:</strong> Verpacken Sie die Ware sicher und
              senden Sie sie mit der erhaltenen Rücksendungsnummer zurück.
            </p>
            <p className={style.paragraph}>
              <strong>Schritt 4:</strong> Nach Prüfung der Ware erstatten wir
              Ihnen den Kaufpreis innerhalb von 14 Tagen.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Rücksendekosten</h2>
            <p className={style.paragraph}>
              Die unmittelbaren Kosten der Rücksendung trägt grundsätzlich der
              Kunde. Bei einem berechtigten Widerruf oder bei einem Mangel der
              Ware übernehmen wir die Rücksendekosten.
            </p>
            <p className={style.paragraph}>
              <strong>Tipp:</strong> Verwenden Sie einen versicherten
              Versandweg, da wir keine Haftung für verloren gegangene
              Rücksendungen übernehmen können.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Erstattung</h2>
            <p className={style.paragraph}>
              Die Erstattung erfolgt über dieselbe Zahlungsmethode, die Sie bei
              der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
              Ihnen wurde ausdrücklich etwas anderes vereinbart. In keinem Fall
              werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <ul className={style.list}>
              <li>
                <strong>Kreditkarte:</strong> 3-5 Werktage
              </li>
              <li>
                <strong>Banküberweisung:</strong> 3-5 Werktage
              </li>
              <li>
                <strong>Sofortüberweisung:</strong> 1-3 Werktage
              </li>
            </ul>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Umtausch</h2>
            <p className={style.paragraph}>
              Einen direkten Umtausch bieten wir nicht an. Wenn Sie einen
              anderen Artikel wünschen, nutzen Sie bitte das Widerrufsrecht für
              die ursprüngliche Bestellung und bestellen den gewünschten Artikel
              separat.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kontakt</h2>
            <p className={style.paragraph}>
              Bei Fragen zur Rückgabe oder zum Umtausch wenden Sie sich gerne an
              unser Kundenservice-Team:
            </p>
            <p className={style.paragraph}>
              <strong>E-Mail:</strong> returns@example.ch
              <br />
              <strong>Telefon:</strong> +49 (0) 00000000
              <br />
              <strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReturnsContainer;
