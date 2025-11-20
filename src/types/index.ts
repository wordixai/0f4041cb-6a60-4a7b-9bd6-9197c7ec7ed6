export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  referredBy?: string;
  referralCount: number;
  totalBookings: number;
  totalSpent: number;
  createdAt: Date;
  notes?: string;
}

export interface Gallery {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description?: string;
  coverImage: string;
  photoCount: number;
  createdAt: Date;
  deliveryStatus: 'pending' | 'processing' | 'delivered';
  accessLink?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  packageId: string;
  packageName: string;
  date: Date;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number;
  price: number;
  notes?: string;
  reminderSent: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  photoCount: number;
  popular?: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredClientId?: string;
  referredClientName?: string;
  status: 'pending' | 'converted' | 'declined';
  date: Date;
  value?: number;
}

export interface Reminder {
  id: string;
  bookingId: string;
  clientName: string;
  type: 'booking' | 'delivery' | 'followup';
  scheduledFor: Date;
  sent: boolean;
  message: string;
}
