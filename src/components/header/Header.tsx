'use client';
import React, { useEffect, useState, useRef } from 'react';
import style from './Header.module.scss';
import Link from '@/components/system/link/Link';
import HamburgerIcon from '@/components/icons/HamburgerIcon';
import SideNav from '@/components/system/sideNav/SideNav';
import LoadingSpinner from '@/components/system/loader/LoadingSpinner';
import OdinLogo from '@/components/icons/OdinLogo';

const ResponsiveAppBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setIsSticky(true);

        if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsSticky(false);
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = [
    style.header,
    isLoading ? style.headerHidden : style.headerVisible,
    isSticky ? style.sticky : '',
    !isVisible && isSticky ? style.hidden : '',
  ].join(' ');

  return (
    <>
      {/* Loading Overlay */}
      <div
        className={`${style.loadingOverlay} ${!isLoading ? style.hidden : ''}`}
      >
        <OdinLogo width={300} href={'/'} className={style.loadingLogo} />
        <LoadingSpinner color={'white'} />
      </div>

      <header className={headerClasses}>
        <div
          className={`${style.NavContainer} ${!isLoading ? style.fadeIn : style.fadeOut}`}
        >
          <div className={style.hamburgerMenu}>
            <HamburgerIcon
              // isOpen={isSideNavOpen}
              // onClick={toggleSideNav}
              width={24}
              height={24}
            />
          </div>

          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/bikes/gravelbikes'}>Gravelbikes</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/bikes/roadbikes'}>Rennräder</Link>
            </li>
          </ul>
          <span
            className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
          >
            <OdinLogo className={style.headerLogo} href={'/'} />
          </span>
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/configurator'}>Configurator</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/parts'}>Parts</Link>
            </li>
          </ul>
        </div>
      </header>

      <SideNav
      // isOpen={isSideNavOpen} onClose={closeSideNav}
      />
    </>
  );
};

export default ResponsiveAppBar;
