import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import HamburgerIcon from '@/components/icons/HamburgerIcon';
import SideNav from '@/components/system/SideNav';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import Cookies from 'js-cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import SideCart from '@/components/system/SideCart';
import { useSideCart } from '@/hooks/SideCartHook';
import OdinLogo from '@/components/icons/OdinLogo';

const ResponsiveAppBar = () => {
  const { t } = useTranslation();
  const router: AppRouterInstance = useRouter();
  const { isLoading, isAdmin } = useAuth();
  const { isSideCartOpen, closeSideCart } = useSideCart();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

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
              <Link href={'/about'}>Gravelbikes</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/workshop'}>Roadbikes</Link>
            </li>{' '}
            {isAdmin && (
              <li className={style.navItem}>
                <Link href={'/admin'}>{t('nav.admin')}</Link>
              </li>
            )}
          </ul>
          <span
            className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
            onClick={() => router.replace(`/${Cookies.get('language') || ''}`)}
          >
            <OdinLogo className={style.headerLogo} />
          </span>
          <ul className={style.navItemContainer}>
            <li className={style.navItem}>
              <Link href={'/roadbikes'}>Configurator</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/blog'}>Weels</Link>
            </li>{' '}
          </ul>
        </div>

        {/*<span*/}
        {/*  className={`${style.rightNavContainer} ${!isLoading ? style.fadeIn : style.fadeOut}`}*/}
        {/*>*/}
        {/*  /!*<div className={style.cartIcon}>*!/*/}
        {/*  /!*  <CartIcon onClick={() => router.replace('/cart')} />*!/*/}
        {/*  /!*  {cartItems && cartItems?.length}*!/*/}
        {/*  /!*</div>*!/*/}
        {/*  <div className={style.cartIcon}>*/}
        {/*    <ProfileIcon onClick={handleUserClick} />*/}
        {/*  </div>*/}
        {/*  <div className={style.translationIcon}>*/}
        {/*    <span*/}
        {/*      className={`${style.navItem} ${style.languageDropdown}`}*/}
        {/*      ref={languageDropdownRef}*/}
        {/*    >*/}
        {/*      <span*/}
        {/*        onClick={toggleLanguageDropdown}*/}
        {/*        className={style.languageToggle}*/}
        {/*      >*/}
        {/*        <TranslateIcon />*/}
        {/*      </span>*/}
        {/*      {isLanguageDropdownOpen && (*/}
        {/*        <div className={style.dropdownMenu}>*/}
        {/*          {languagesOptions.map((lang) => (*/}
        {/*            <span*/}
        {/*              key={lang.code}*/}
        {/*              className={`${style.dropdownItem} ${params.locale === lang.code ? style.activeLanguage : ''}`}*/}
        {/*              onClick={() =>*/}
        {/*                handleLanguageChange({*/}
        {/*                  language: lang.code,*/}
        {/*                  router,*/}
        {/*                  path,*/}
        {/*                  preferences: sessionData?.data.preferences,*/}
        {/*                  sessionId: sessionData?.sessionId as string,*/}
        {/*                  action: i18n.changeLanguage,*/}
        {/*                  setIsLanguageDropdownOpen,*/}
        {/*                })*/}
        {/*              }*/}
        {/*            >*/}
        {/*              {lang.name}*/}
        {/*            </span>*/}
        {/*          ))}*/}
        {/*        </div>*/}
        {/*      )}*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</span>*/}
      </header>

      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      <SideCart isOpen={isSideCartOpen} onClose={() => closeSideCart()} />
    </>
  );
};

export default ResponsiveAppBar;
