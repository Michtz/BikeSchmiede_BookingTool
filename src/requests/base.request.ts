import axios from 'axios';
import { prodApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || prodApiUrl;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (request) => {
  try {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr)?.token : null;
      if (token) request.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Failed to parse session storage data:', err);
  }
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    Logger.error('API-Error:', {
      message: error.message || 'Error',
      code: error.response?.status || 'UNKNOWN_ERROR',
      url: error.config?.url,
    });

    const returnError = {
      message: error.response.data.error || 'Error',
      code: error.response?.status || 'UNKNOWN_ERROR',
      url: error.config?.url,
    };

    return Promise.reject(returnError);
  },
);
