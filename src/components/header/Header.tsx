import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import style from './Header.module.scss';
import Link from '@/components/system/link/Link';
import HamburgerIcon from '@/components/icons/HamburgerIcon';
import SideNav from '@/components/system/sideNav/SideNav';
import LoadingSpinner from '@/components/system/loader/LoadingSpinner';
import Cookies from 'js-cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import OdinLogo from '@/components/icons/OdinLogo';

const ResponsiveAppBar = () => {
  const router: AppRouterInstance = useRouter();
  const pathName = usePathname();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };
  const isLoading = false;

  return (
    <>
      {/* Loading Overlay */}
      <div
        className={`${style.loadingOverlay} ${!isLoading ? style.hidden : ''}`}
      >
        <OdinLogo width={300} className={style.loadingLogo} />
        <LoadingSpinner color={'white'} />
      </div>

      <header
        className={`${style.header} ${isLoading ? style.headerHidden : style.headerVisible}`}
      >
        <div
          className={`${style.NavContainer} ${!isLoading ? style.fadeIn : style.fadeOut}`}
        >
          <div className={style.hamburgerMenu}>
            <HamburgerIcon
              isOpen={isSideNavOpen}
              onClick={toggleSideNav}
              width={24}
              height={24}
            />
          </div>

          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/bikes/gravelbikes'}>Gravelbikes</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/bikes/roadbikes'}>
                {pathName.split('/').pop() === 'roadbikes'
                  ? 'Besprechung Buchen'
                  : 'Rennräder'}
              </Link>
            </li>
          </ul>
          <span
            className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
            onClick={() => router.replace(`/${Cookies.get('language') || ''}`)}
          >
            <OdinLogo className={style.headerLogo} />
          </span>
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/configurator'}>
                {pathName.split('/').pop() === 'configurator'
                  ? 'Besprechung Buchen'
                  : 'Configurator'}
              </Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/parts'}>Parts</Link>
            </li>
          </ul>
        </div>
      </header>

      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
    </>
  );
};

export default ResponsiveAppBar;
