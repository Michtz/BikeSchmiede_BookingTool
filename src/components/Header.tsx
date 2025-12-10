import * as React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import style from '@/styles/Header.module.scss';
import Link from '@/components/system/Link';
import { useAuth } from '@/hooks/AuthHook';
import CartIcon from '@/components/icons/CartIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import Logo from '@/components/icons/Logo';
import HamburgerIcon from '@/components/icons/HamburgerIcon';
import SideNav from '@/components/system/SideNav';
import TranslateIcon from '@/components/icons/TranslateIcon';
import LoadingSpinner from '@/components/system/LoadingSpinner';
import Cookies from 'js-cookie';
import { handleLanguageChange, languagesOptions } from '@/i18n/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Params } from 'next/dist/server/request/params';
import SideCart from '@/components/system/SideCart';
import { useSideCart } from '@/hooks/SideCartHook';
import useCart from '@/hooks/CartHook';

const ResponsiveAppBar = () => {
  const { t, i18n } = useTranslation();
  const router: AppRouterInstance = useRouter();
  const { cartItems } = useCart();
  const path = usePathname();
  const params: Params = useParams();
  const { userSessionData, sessionData, isLoading, isAdmin } = useAuth();
  const { isSideCartOpen, closeSideCart } = useSideCart();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLLIElement>(null);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const handleUserClick = () => {
    if (!!userSessionData) router.replace('/profile');
    if (!userSessionData) router.replace('/login');
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      )
        setIsLanguageDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      <div
        className={`${style.loadingOverlay} ${!isLoading ? style.hidden : ''}`}
      >
        <Logo className={style.loadingLogo} />
        <LoadingSpinner color={'white'} />
      </div>

      <header
        className={`${style.header} ${isLoading ? style.headerHidden : style.headerVisible}`}
      >
        <div
          className={`${style.leftNavContainer} ${!isLoading ? style.fadeIn : style.fadeOut}`}
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
              <Link href={'/about'}>BIKEFITTING</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/workshop'}>WERKSTATT</Link>
            </li>{' '}
            <li className={style.navItem}>
              <Link href={'/roadbikes'}>RENNRÄDER</Link>
            </li>
            <li className={style.navItem}>
              <Link href={'/blog'}>E-BIKES</Link>
            </li>{' '}
            <li className={style.navItem}>
              <Link href={'/brands'}>MARKEN</Link>
            </li>
            {isAdmin && (
              <li className={style.navItem}>
                <Link href={'/admin'}>{t('nav.admin')}</Link>
              </li>
            )}
          </ul>
        </div>
        <span
          className={`${style.logo} ${!isLoading ? style.logoSmall : ''}`}
          onClick={() => router.replace(`/${Cookies.get('language') || ''}`)}
        >
          <Logo className={style.headerLogo} />
        </span>
        <span
          className={`${style.rightNavContainer} ${!isLoading ? style.fadeIn : style.fadeOut}`}
        >
          {/*<div className={style.cartIcon}>*/}
          {/*  <CartIcon onClick={() => router.replace('/cart')} />*/}

          {/*  {cartItems && cartItems?.length}*/}
          {/*</div>*/}
          <div className={style.cartIcon}>
            <ProfileIcon onClick={handleUserClick} />
          </div>
          <div className={style.translationIcon}>
            <span
              className={`${style.navItem} ${style.languageDropdown}`}
              ref={languageDropdownRef}
            >
              <span
                onClick={toggleLanguageDropdown}
                className={style.languageToggle}
              >
                <TranslateIcon />
              </span>
              {isLanguageDropdownOpen && (
                <div className={style.dropdownMenu}>
                  {languagesOptions.map((lang) => (
                    <span
                      key={lang.code}
                      className={`${style.dropdownItem} ${params.locale === lang.code ? style.activeLanguage : ''}`}
                      onClick={() =>
                        handleLanguageChange({
                          language: lang.code,
                          router,
                          path,
                          preferences: sessionData?.data.preferences,
                          sessionId: sessionData?.sessionId as string,
                          action: i18n.changeLanguage,
                          setIsLanguageDropdownOpen,
                        })
                      }
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </span>
          </div>
        </span>
      </header>

      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      <SideCart isOpen={isSideCartOpen} onClose={() => closeSideCart()} />
    </>
  );
};

export default ResponsiveAppBar;
