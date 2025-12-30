'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, SessionData, UserInformation, UserInfo } from '@/types/auth';
import {
  createSession,
  getCurrentSession,
  login as _login,
  register as _register,
  logout as _logout,
  getCurrentUser,
  refreshToken,
  googleLogin as _googleLogin,
} from '@/requests/session.request';
import { Logger } from '@/utils/Logger.class';
import Cookies from 'js-cookie';

interface AuthContextType {
  userSessionData: User | undefined;
  sessionData: SessionData | undefined;
  userInformation: UserInformation | undefined;
  isLoading: boolean;
  isSessionReady: boolean;
  isAdmin: boolean;

  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (credential: string) => Promise<any>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userSessionData, setUserSessionData] = useState<User | undefined>(
    undefined,
  );
  const [userInformation, setUserInformation] = useState<any>();
  const [sessionData, setSessionData] = useState<SessionData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const resetToDefault = () => {
    sessionStorage.removeItem('user');
    setUserSessionData(undefined);
    setUserInformation(undefined);
    setIsAdmin(false);
  };

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);

      try {
        let sessionResponse = await getCurrentSession();
        if (!sessionResponse.success) {
          sessionResponse = await createSession();
        }

        const sessionId: string = sessionResponse?.data.sessionId;

        if (sessionId) {
          setSessionData(sessionResponse?.data);
          setIsSessionReady(true);
          sessionStorage.setItem(
            'session',
            JSON.stringify(sessionResponse?.data.data),
          );
        }
      } catch (sessionError) {
        Logger.error(sessionError);
      }

      const userStr = sessionStorage.getItem('user');

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (!user.token || !user.refreshToken) {
            resetToDefault();
          } else {
            try {
              const refreshResponse = await refreshToken();

              // Handle nested response structure
              const refreshedData = refreshResponse?.data;
              if (refreshedData && refreshedData.token) {
                sessionStorage.setItem('user', JSON.stringify(refreshedData));
                setUserSessionData(refreshedData);
                setIsAdmin(refreshedData.user.role === 'admin');

                // Get current user info
                const userInformation = await getCurrentUser();
                const userInfoData = userInformation?.data.user;
                if (userInfoData) {
                  setUserInformation(userInfoData);
                }
              } else {
                resetToDefault();
              }
            } catch {
              resetToDefault();
            }
          }
        } catch {
          resetToDefault();
        }
      }
    } catch (err) {
      Logger.error('Auth initialization failed:', err);
      setIsSessionReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await _login(email, password);

      if (response.success) {
        const newSessionData = {
          ...sessionData,
          data: {
            ...sessionData?.data,
            isAuthenticated: true,
          },
        };

        setUserSessionData(response?.data);
        setIsAdmin(response?.data?.user.role === 'admin');
        sessionStorage.setItem('user', JSON.stringify(response?.data)); // backup
        sessionStorage.setItem('session', JSON.stringify(newSessionData));

        try {
          const userInfo = await getCurrentUser();
          const userInfoData = userInfo?.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
          return response;
        } catch (userErr) {
          Logger.warn('Failed to get user info after login:', userErr);
          return response;
        }
      } else {
        Logger.log('Login failed or no data:', response);
        return response;
      }
    } catch (err: any) {
      Logger.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<any> => {
    setIsLoading(true);

    try {
      const response = await _register(email, password, firstName, lastName);
      const registerData = response.data;
      const isSuccess = response?.success !== false && registerData;

      if (isSuccess && registerData) {
        const userData = registerData.user || registerData;
        setUserSessionData(userData);
        setIsAdmin(userData.user.role === 'admin');
        sessionStorage.setItem('user', JSON.stringify(registerData));

        try {
          const userInfo = await getCurrentUser();
          const userInfoData = userInfo?.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
        } catch (userErr) {
          Logger.warn('Failed to get user info after registration:', userErr);
        }
      } else {
        Logger.log('❌ Registration failed or no data:', response);
        return response;
      }
    } catch (err: any) {
      Logger.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await _googleLogin(credential);

      if (response.success) {
        const newSessionData = {
          ...sessionData,
          data: {
            ...sessionData?.data,
            isAuthenticated: true,
          },
        };

        setUserSessionData({
          refreshToken: response?.data?.refreshToken as string,
          token: credential,
          user: response?.data?.user as UserInfo,
        });
        setIsAdmin(false); // no google admin for now
        sessionStorage.setItem('user', JSON.stringify(response?.data));
        sessionStorage.setItem('session', JSON.stringify(newSessionData));

        try {
          const userInfo = await getCurrentUser();
          const userInfoData = userInfo?.data?.user;
          if (userInfoData) {
            setUserInformation(userInfoData);
          }
          return response;
        } catch (userErr) {
          Logger.warn('Failed to get user info after Google login:', userErr);
          return response;
        }
      } else {
        Logger.log('Google login failed or no data:', response);
        return response;
      }
    } catch (err: any) {
      Logger.error('Google login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await _logout(sessionData?.sessionId as string);
    } catch (err) {
      Logger.error('Logout request failed:', err);
    }

    setIsAdmin(false);
    setUserSessionData(undefined);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('session');
    Cookies.remove('authToken');

    const session = await createSession();
    sessionStorage.setItem('session', JSON.stringify(session.data));
    setSessionData(session.data);
    setIsLoading(false);
  };

  const value: AuthContextType = {
    userInformation,
    userSessionData,
    sessionData,
    isLoading,
    isSessionReady,
    login,
    loginWithGoogle,
    register,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
