import { axiosInstance } from './base.request';
import { paymentApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const createPaymentIntent = async (sessionId: string) => {
  try {
    const response = await axiosInstance.post(
      `${paymentApiUrl}/create-intent/${sessionId}`,
    );
    return response.data;
  } catch (error) {
    Logger.error('💳 Payment intent API error:', error);
    throw error;
  }
};
export const getPaymentMethode = async (paymentIntentId: string) => {
  try {
    const response = await axiosInstance.post(
      `${paymentApiUrl}/payment-info/${paymentIntentId}`,
    );
    return response.data;
  } catch {
    // Logger.error('💳 Payment intent API error:', error);
  }
};

export const confirmPayment = async (
  sessionId: string,
  paymentIntentId: string,
  paymentMethodId?: string,
) => {
  try {
    const response = await axiosInstance.post(
      `${paymentApiUrl}/confirm/${sessionId}`,
      {
        paymentIntentId,
        paymentMethodId,
      },
    );
    return response.data;
  } catch (error) {
    Logger.error('💳 Payment confirmation API error:', error);
  }
};
