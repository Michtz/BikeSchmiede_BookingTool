import { ApiResponse } from '@/types/auth';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BookingType = 'booking' | 'blocker';

export interface IServiceSnapshot {
  name: string;
  price: number;
  durationMinutes: number;
}

export interface IBooking {
  _id: string;
  bookingNumber: string;
  userId?:
    | string
    | { _id: string; email: string; firstName?: string; lastName?: string }; // Populated or ID
  userEmail?: string;

  start: string; // ISO Date String
  end: string;

  type: BookingType;
  status: BookingStatus;

  services: IServiceSnapshot[];
  customerNotes?: string;
  adminNotes?: string;

  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse extends ApiResponse {
  data?: IBooking | IBooking[];
}

export interface CreateBlockerRequest {
  start: string;
  end: string;
  adminNotes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}

export interface UpdateAdminNotesRequest {
  adminNotes: string;
}
