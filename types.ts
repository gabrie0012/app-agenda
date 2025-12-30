
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
  category: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  date: string; // ISO string
  time: string; // HH:mm
  status: 'scheduled' | 'completed' | 'canceled';
}

export interface WorkingHours {
  day: number; // 0-6
  start: string; // HH:mm
  end: string; // HH:mm
  isActive: boolean;
}

export interface BusinessConfig {
  name: string;
  slug: string;
  about: string;
  workingHours: WorkingHours[];
}
