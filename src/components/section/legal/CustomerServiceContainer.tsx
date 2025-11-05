'use client';

import React from 'react';
import { Container } from '@/components/system/Container';
import style from '@/styles/LegalContainer.module.scss';

const CustomerServiceContainer: React.FC = () => {
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
        <h1 className={style.title}>Kundenservice</h1>

        <div className={style.content}>
          <div className={style.section}>
            <h2 className={style.sectionTitle}>Wir sind für Sie da</h2>
            <p className={style.paragraph}>
              Unser Kundenservice-Team steht Ihnen mit Rat und Tat zur Seite.
              Egal ob Sie Fragen zu Produkten haben, Hilfe bei Ihrer Bestellung
              benötigen oder Unterstützung bei Rückgaben brauchen - wir helfen
              Ihnen gerne weiter.
            </p>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Kontaktmöglichkeiten</h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Telefonischer Support</h3>
              <p className={style.paragraph}>
                <strong>Hotline:</strong> +49 (0) 123 456789
                <br />
                <strong>Montag - Freitag:</strong> 9:00 - 18:00 Uhr
                <br />
                <strong>Samstag:</strong> 10:00 - 16:00 Uhr
                <br />
                <strong>Sonntag:</strong> Geschlossen
              </p>
              <p className={style.paragraph}>
                <em>
                  Für dringende Anfragen ist dies der schnellste Weg, uns zu
                  erreichen.
                </em>
              </p>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>E-Mail Support</h3>
              <p className={style.paragraph}>
                <strong>Allgemeine Anfragen:</strong> service@myshop.de
                <br />
                <strong>Bestellfragen:</strong> orders@myshop.de
                <br />
                <strong>Rückgaben:</strong> returns@myshop.de
                <br />
                <strong>Technische Probleme:</strong> tech@myshop.de
              </p>
              <p className={style.paragraph}>
                <em>Antwortzeit: In der Regel innerhalb von 24 Stunden</em>
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Unser Service für Sie</h2>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Bestellhilfe</h3>
              <ul className={style.list}>
                <li>Unterstützung bei der Produktauswahl</li>
                <li>Hilfe bei Bestellproblemen</li>
                <li>Individuelle Produktempfehlungen</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Versand & Lieferung</h3>
              <ul className={style.list}>
                <li>Sendungsverfolgung</li>
                <li>Lieferadresse ändern</li>
                <li>Liefertermin koordinieren</li>
                <li>Expressversand-Beratung</li>
                <li>Internationale Lieferungen</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>After-Sales Service</h3>
              <ul className={style.list}>
                <li>Rückgabe-Abwicklung</li>
                <li>Reklamationsbearbeitung</li>
                <li>Garantie-Anfragen</li>
                <li>Ersatzteil-Service</li>
                <li>Reparatur-Vermittlung</li>
              </ul>
            </div>

            <div className={style.section}>
              <h3 className={style.sectionTitle}>Zahlungs-Support</h3>
              <ul className={style.list}>
                <li>Zahlungsprobleme lösen</li>
                <li>Ratenzahlung einrichten</li>
                <li>Rechnungen erklären</li>
                <li>Erstattungen verfolgen</li>
              </ul>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>
              Häufige Anfragen - Schnellhilfe
            </h2>

            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#f9f9f9',
                marginBottom: '1rem',
              }}
            >
              <h3 className={style.sectionTitle}>
                &quot;Wo ist meine Bestellung?&quot;
              </h3>
              <p className={style.paragraph}>
                Nutzen Sie die erhaltenen Sendungsverfolgung mit Ihrer
                Trackingnummer (Mail).
              </p>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#f9f9f9',
                marginBottom: '1rem',
              }}
            >
              <h3 className={style.sectionTitle}>
                &quot;Wie kann ich zurückgeben?&quot;
              </h3>
              <p className={style.paragraph}>
                Besuchen Sie unsere Rückgabe-Seite oder kontaktieren Sie
                returns@example.ch für eine Rücksendung.
              </p>
            </div>
          </div>

          <div className={style.section}>
            <h2 className={style.sectionTitle}>Feedback & Verbesserungen</h2>
            <p className={style.paragraph}>
              Ihr Feedback ist uns wichtig! Teilen Sie uns mit, wie wir unseren
              Service verbessern können:
            </p>
            <p className={style.paragraph}>
              <strong>Feedback-E-Mail:</strong> feedback@example.ch
              <br />
              <strong>Bewertung:</strong> Bewerten Sie uns nach jedem Kontakt
              <br />
              <strong>Beschwerden:</strong> Wir nehmen jede Beschwerde ernst und
              bearbeiten sie zeitnah
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CustomerServiceContainer;
