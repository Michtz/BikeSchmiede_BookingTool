import React, { FC } from 'react';
import style from './ImpressumContainer.module.scss';
import { Container } from '@/components/system/containers/Containers';

interface ImpressumContainerProps {}

const ImpressumContainer: FC<ImpressumContainerProps> = () => {
  return (
    <Container flow={'column'}>
      <h1 className={style.title}>Impressum</h1>

      <div className={style.section}>
        <h2>Kontaktadresse</h2>
        <p>
          Bikeschmide
          <br />
          Gemeindehauspl. 13,
          <br /> 6048 Horw
          <br /> Schweiz
        </p>
      </div>

      <div className={style.section}>
        <h2>Vertretungsberechtigte Personen</h2>
        <p>Maikel nochefrog öb är oder angela !!, Geschäftsführer</p>
        {/*  // Todo: abklären wer berechtigt*/}
      </div>

      <div className={style.section}>
        <h2>Kontakt</h2>
        <p>
          Telefon:&nbsp; <a href="tel:+0413407044">+041 340 70 44</a>
          <br />
          E-Mail:&nbsp; <a href="mailto:info@odinbikes.ch">info@odinbikes.ch</a>
        </p>
      </div>

      <div className={style.section}>
        <h2>Webdesign & Entwicklung</h2>
        <p>Michael Venetz</p>
      </div>
    </Container>
  );
};

export default ImpressumContainer;
