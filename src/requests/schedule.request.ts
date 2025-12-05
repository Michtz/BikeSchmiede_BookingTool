import { axiosInstance } from '@/requests/base.request';
import { Logger } from '@/utils/Logger.class';
import {
  ScheduleResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from '@/types/schedule.types';
import { schedulesApiUrl } from '@/config/api.config';

export const getAllSchedules = async (): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.get(schedulesApiUrl, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to get schedules', e);
    throw e;
  }
};

export const getSchedule = async (id: string): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.get(`${schedulesApiUrl}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to get schedule', e);
    throw e;
  }
};

export const createSchedule = async (
  data: CreateScheduleRequest,
): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.post(schedulesApiUrl, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to create schedule', e);
    throw e;
  }
};

export const updateSchedule = async (
  id: string,
  data: UpdateScheduleRequest,
): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.put(`${schedulesApiUrl}/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to update schedule', e);
    throw e;
  }
};

export const deleteSchedule = async (id: string): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.delete(`${schedulesApiUrl}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    Logger.error('Unable to delete schedule', e);
    throw e;
  }
};

export const activateSchedule = async (
  id: string,
): Promise<ScheduleResponse> => {
  try {
    const response = await axiosInstance.post(
      `${schedulesApiUrl}/${id}/activate`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to activate schedule', e);
    throw e;
  }
};
