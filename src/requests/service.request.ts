import { axiosInstance } from '@/requests/base.request';
import { Logger } from '@/utils/Logger.class';
import {
  ServiceResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
} from '@/types/service.types';
import { servicesApiUrl } from '@/config/api.config';

export const getAllServices = async (): Promise<ServiceResponse> => {
  try {
    const response = await axiosInstance.get(servicesApiUrl, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to get services', e);
    throw e;
  }
};

export const createService = async (
  data: CreateServiceRequest,
): Promise<ServiceResponse> => {
  try {
    const response = await axiosInstance.post(servicesApiUrl, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to create service', e);
    throw e;
  }
};

export const updateService = async (
  id: string,
  data: UpdateServiceRequest,
): Promise<ServiceResponse> => {
  try {
    const response = await axiosInstance.put(`${servicesApiUrl}/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to update service', e);
    throw e;
  }
};

export const deleteService = async (id: string): Promise<ServiceResponse> => {
  try {
    const response = await axiosInstance.delete(`${servicesApiUrl}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to delete service', e);
    throw e;
  }
};
