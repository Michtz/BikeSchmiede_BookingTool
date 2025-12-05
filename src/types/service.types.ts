import { ApiResponse } from '@/types/auth';

export interface IService {
  _id: string;
  name: string;
  description?: string;
  price: number;
  durationCustomerMinutes: number; // Wie lange der Kunde dabei sein muss
  durationTotalMinutes: number; // Gesamtdauer für den Slot
  category?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface ServiceResponse extends ApiResponse {
  data?: IService | IService[];
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  durationCustomerMinutes: number;
  durationTotalMinutes: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}
