import { FC } from 'react';
import { Accordion } from '@/components/system/accordion/Accordion';
import style from './LegalContainer.module.scss';
import { Container } from '@/components/system/containers/Containers';

interface LegalContainerProps {}

const LegalContainer: FC<LegalContainerProps> = () => {
  return (
    <Container flow={'column'}>
      <h1 className={style.title}>Datenschutz & Rechtliches</h1>

      <Accordion title="1. Datenschutz auf einen Blick" defaultOpen={true}>
        <p>
          Allgemeine Hinweise zum Umgang mit Ihren personenbezogenen Daten auf
          dieser Website. Verantwortlich für die Datenerfassung ist Michael
          Venetz.
        </p>
      </Accordion>

      <Accordion title="2. Datenerfassung auf dieser Website">
        <>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Die Kontaktdaten können Sie dem Impressum
            entnehmen.
          </p>
          <br />
          <p>
            <strong>Wie erfassen wir Ihre Daten?</strong>
            <br />
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
            aktiv mitteilen (z. B. über ein Buchungs- oder Kontaktformular).
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
            Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
            allem technische Daten wie Ihr Internetbrowser, Ihr Betriebssystem
            oder die Uhrzeit des Seitenaufrufs.
          </p>
          <br />
          <p>
            <strong>Wofür nutzen wir Ihre Daten?</strong>
            <br />
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung
            der Website zu gewährleisten. Andere Daten werden zur Bearbeitung
            Ihrer Anfragen und Buchungen oder zur Analyse des Nutzerverhaltens
            verwendet.
          </p>
        </>
      </Accordion>

      <Accordion title="3. Cookies und Analyse-Tools">
        <p>
          Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern.
          Weitere Informationen finden Sie im Cookie-Banner.
        </p>
      </Accordion>

      <Accordion title="4. Ihre Rechte">
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
          erhalten.
        </p>
      </Accordion>
    </Container>
  );
};

export default LegalContainer;
