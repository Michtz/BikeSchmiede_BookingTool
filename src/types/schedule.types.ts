import { ApiResponse } from '@/types/auth';

export interface ITimeSlot {
  start: string; // "09:00"
  end: string; // "12:00"
  _id?: string;
}

export interface IWeekProfile {
  monday: ITimeSlot[];
  tuesday: ITimeSlot[];
  wednesday: ITimeSlot[];
  thursday: ITimeSlot[];
  friday: ITimeSlot[];
  saturday: ITimeSlot[];
  sunday: ITimeSlot[];
  [key: string]: ITimeSlot[]; // Index signature für dyn. Zugriff
}

export interface ISchedule {
  _id: string;
  name: string;
  validFrom: string; // ISO Date String
  validUntil?: string;
  isActive: boolean;
  slotDurationMinutes: number;
  openingHours: IWeekProfile;
}

export interface ScheduleResponse extends ApiResponse {
  data?: ISchedule | ISchedule[];
}

export interface CreateScheduleRequest {
  name: string;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  slotDurationMinutes: number;
  openingHours: IWeekProfile;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {}
