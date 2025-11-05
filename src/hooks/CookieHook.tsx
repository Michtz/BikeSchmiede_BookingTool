'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';

interface CookieContextType {
  showBanner: boolean;
  acceptCookies: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // only client side because user has no choice ( there are no optional cookies ony functional ;) )
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookie-consent', 'accepted-cookies', {
      expires: 10,
      path: '/',
      sameSite: 'strict',
    });
    setShowBanner(false);
  };

  return (
    <CookieContext.Provider value={{ showBanner, acceptCookies }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookie = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookie must be used within CookieProvider');
  }
  return context;
};
