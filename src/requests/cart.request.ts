import { axiosInstance } from '@/requests/base.request';
import { cartApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';

export const getCart = async (
  sessionId: string,
  userId?: string,
): Promise<any> => {
  try {
    if (!sessionId || sessionId === 'undefined') {
      throw new Error('Valid session ID is required');
    }

    const url = userId
      ? `${cartApiUrl}/${sessionId}/${userId}`
      : `${cartApiUrl}/${sessionId}`;

    return await axiosInstance.get(url, {
      withCredentials: true,
    });
  } catch {
    // Logger.error('Unable to get the cart'); commented to remove error logs when no cart was created ( todo: change locig oder bakend responce for it)
  }
};

export const updateCartUser = async (
  sessionId: string,
  userInfo: any,
  guestInfo: any,
): Promise<any> => {
  try {
    const requestBody = {
      userInfo: {
        selectedAddress: userInfo,
        guestInfo: guestInfo,
      },
    };
    return await axiosInstance.put(
      `${cartApiUrl}/${sessionId}/user`,
      requestBody,
      {
        withCredentials: true,
      },
    );
  } catch (e) {
    Logger.error('Unable to update cart user');
    throw e;
  }
};

export const updateCartItem = async (
  sessionId: string,
  productId: string,
  quantity: number | string,
  userId?: string,
): Promise<any> => {
  try {
    const url: string = userId ? `${sessionId}/${userId}` : sessionId;
    const requestBody = {
      items: [
        {
          productId: productId,
          quantity: quantity,
        },
      ],
    };
    return await axiosInstance.put(`${cartApiUrl}/${url}`, requestBody, {
      withCredentials: true,
    });
  } catch (e) {
    Logger.error('Unable to update cart item');
    throw e;
  }
};

export const updateCartItems = async (
  sessionId: string,
  items: Array<{ productId: string; quantity: number }>,
): Promise<any> => {
  try {
    const requestBody = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    return await axiosInstance.put(
      `${cartApiUrl}/${sessionId}/items`,
      requestBody,
      { withCredentials: true },
    );
  } catch (e) {
    Logger.error('Unable to update cart items');
    throw e;
  }
};

export const deleteCartItem = async (
  sessionId: string,
  productId: string,
  userId?: string,
): Promise<any> => {
  try {
    const url: string = userId ? `${sessionId}/${userId}` : sessionId;
    const requestBody = {
      items: [
        {
          productId: productId,
        },
      ],
    };

    return await axiosInstance.delete(`${cartApiUrl}/${url}`, {
      data: requestBody,
    });
  } catch (e) {
    Logger.error('Unable to delete cart item');
    throw e;
  }
};

export const getOrder = async (orderNumber: string): Promise<any> => {
  try {
    return await axiosInstance.get(`/api/order/${orderNumber}`);
  } catch (e) {
    Logger.error('Unable to delete cart item');
    throw e;
  }
};
