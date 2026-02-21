import { FC } from 'react';
import style from './Footer.module.scss';

const Footer: FC = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}></div>
    </footer>
  );
};

export default Footer;
