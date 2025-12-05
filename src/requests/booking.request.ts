import { axiosInstance } from '@/requests/base.request';
import { Logger } from '@/utils/Logger.class';
import {
  BookingResponse,
  CreateBlockerRequest,
  UpdateBookingStatusRequest,
  UpdateAdminNotesRequest,
  BookingStatus,
} from '@/types/booking.types';
import { bookingsApiUrl } from '@/config/api.config';

export const getAdminBookings = async (
  from?: string,
  to?: string,
): Promise<BookingResponse> => {
  try {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const response = await axiosInstance.get(
      `${bookingsApiUrl}/admin?${params.toString()}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to get admin bookings', e);
    throw e;
  }
};

export const createBlocker = async (
  data: CreateBlockerRequest,
): Promise<BookingResponse> => {
  try {
    const response = await axiosInstance.post(
      `${bookingsApiUrl}/admin/block`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to create blocker', e);
    throw e;
  }
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
): Promise<BookingResponse> => {
  try {
    const data: UpdateBookingStatusRequest = { status };
    const response = await axiosInstance.post(
      `${bookingsApiUrl}/admin/${id}/status`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to update booking status', e);
    throw e;
  }
};

export const updateAdminNotes = async (
  id: string,
  notes: string,
): Promise<BookingResponse> => {
  try {
    const data: UpdateAdminNotesRequest = { adminNotes: notes };
    const response = await axiosInstance.post(
      `${bookingsApiUrl}/admin/${id}/notes`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (e) {
    Logger.error('Unable to update admin notes', e);
    throw e;
  }
};
