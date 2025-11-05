import { axiosInstance } from '@/requests/base.request';
import { authApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import { UserInformation } from '@/types/auth';

export const updateUserInfo = async (
  userInfo: UserInformation,
): Promise<any> => {
  try {
    return await axiosInstance.post(
      `${authApiUrl}/change-user-info`,
      { userInfo },
      {
        withCredentials: true,
      },
    );
  } catch (e) {
    Logger.error('Unable to logout');
    throw e;
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<any> => {
  try {
    return await axiosInstance.post(
      `${authApiUrl}/change-password`,
      { currentPassword, newPassword },
      {
        withCredentials: true,
      },
    );
  } catch (e) {
    console.error('🔐 Password change error:', e);
    Logger.error('Unable to change password');
    throw e;
  }
};
