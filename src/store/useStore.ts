import { create } from 'zustand';
import { Client, Gallery, Booking, Package, Referral, Reminder } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Store {
  clients: Client[];
  galleries: Gallery[];
  bookings: Booking[];
  packages: Package[];
  referrals: Referral[];
  reminders: Reminder[];

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'referralCount' | 'totalBookings' | 'totalSpent'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Gallery actions
  addGallery: (gallery: Omit<Gallery, 'id' | 'createdAt'>) => void;
  updateGallery: (id: string, gallery: Partial<Gallery>) => void;
  deleteGallery: (id: string) => void;

  // Booking actions
  addBooking: (booking: Omit<Booking, 'id' | 'reminderSent'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;

  // Package actions
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;

  // Referral actions
  addReferral: (referral: Omit<Referral, 'id' | 'date'>) => void;
  updateReferral: (id: string, referral: Partial<Referral>) => void;
}

const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Essential',
    description: 'Perfect for quick sessions and portraits',
    price: 299,
    duration: 60,
    photoCount: 20,
    features: ['1 hour session', '20 edited photos', 'Online gallery', 'Print release'],
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Ideal for events and special occasions',
    price: 599,
    duration: 120,
    photoCount: 50,
    features: ['2 hour session', '50 edited photos', 'Online gallery', 'Print release', '2 locations', 'Outfit changes'],
    popular: true,
  },
  {
    id: '3',
    name: 'Premium',
    description: 'Complete coverage for your important moments',
    price: 999,
    duration: 240,
    photoCount: 100,
    features: ['4 hour session', '100 edited photos', 'Premium online gallery', 'Print release', 'Multiple locations', 'Unlimited outfit changes', 'Same-day preview'],
  },
];

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Emma Watson',
    email: 'emma.watson@email.com',
    phone: '(555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    referralCount: 2,
    totalBookings: 3,
    totalSpent: 1797,
    createdAt: new Date('2024-01-15'),
    notes: 'Loves outdoor sessions, prefers golden hour lighting',
  },
  {
    id: '2',
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    phone: '(555) 234-5678',
    referralCount: 0,
    totalBookings: 1,
    totalSpent: 599,
    createdAt: new Date('2024-02-20'),
  },
];

const initialGalleries: Gallery[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Emma Watson',
    title: 'Spring Portrait Session',
    description: 'Beautiful outdoor spring portraits',
    coverImage: 'https://images.unsplash.com/photo-1522621032211-ac0031dfbddc?w=800',
    photoCount: 45,
    createdAt: new Date('2024-03-10'),
    deliveryStatus: 'delivered',
    accessLink: 'https://gallery.example.com/spring-emma',
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'James Rodriguez',
    title: 'Family Session',
    description: 'Annual family photos',
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
    photoCount: 30,
    createdAt: new Date('2024-03-15'),
    deliveryStatus: 'processing',
  },
];

const initialBookings: Booking[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Emma Watson',
    packageId: '2',
    packageName: 'Professional',
    date: new Date('2024-04-15T14:00:00'),
    location: 'Central Park, New York',
    status: 'scheduled',
    duration: 120,
    price: 599,
    notes: 'Client prefers sunset timing',
    reminderSent: false,
  },
];

const initialReferrals: Referral[] = [
  {
    id: '1',
    referrerId: '1',
    referrerName: 'Emma Watson',
    referredClientName: 'Sarah Johnson',
    status: 'converted',
    date: new Date('2024-02-01'),
    value: 599,
  },
];

export const useStore = create<Store>((set) => ({
  clients: initialClients,
  galleries: initialGalleries,
  bookings: initialBookings,
  packages: initialPackages,
  referrals: initialReferrals,
  reminders: [],

  addClient: (client) => set((state) => ({
    clients: [...state.clients, {
      ...client,
      id: uuidv4(),
      createdAt: new Date(),
      referralCount: 0,
      totalBookings: 0,
      totalSpent: 0,
    }],
  })),

  updateClient: (id, client) => set((state) => ({
    clients: state.clients.map((c) => c.id === id ? { ...c, ...client } : c),
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
  })),

  addGallery: (gallery) => set((state) => ({
    galleries: [...state.galleries, {
      ...gallery,
      id: uuidv4(),
      createdAt: new Date(),
    }],
  })),

  updateGallery: (id, gallery) => set((state) => ({
    galleries: state.galleries.map((g) => g.id === id ? { ...g, ...gallery } : g),
  })),

  deleteGallery: (id) => set((state) => ({
    galleries: state.galleries.filter((g) => g.id !== id),
  })),

  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, {
      ...booking,
      id: uuidv4(),
      reminderSent: false,
    }],
  })),

  updateBooking: (id, booking) => set((state) => ({
    bookings: state.bookings.map((b) => b.id === id ? { ...b, ...booking } : b),
  })),

  deleteBooking: (id) => set((state) => ({
    bookings: state.bookings.filter((b) => b.id !== id),
  })),

  addPackage: (pkg) => set((state) => ({
    packages: [...state.packages, {
      ...pkg,
      id: uuidv4(),
    }],
  })),

  updatePackage: (id, pkg) => set((state) => ({
    packages: state.packages.map((p) => p.id === id ? { ...p, ...pkg } : p),
  })),

  deletePackage: (id) => set((state) => ({
    packages: state.packages.filter((p) => p.id !== id),
  })),

  addReferral: (referral) => set((state) => ({
    referrals: [...state.referrals, {
      ...referral,
      id: uuidv4(),
      date: new Date(),
    }],
  })),

  updateReferral: (id, referral) => set((state) => ({
    referrals: state.referrals.map((r) => r.id === id ? { ...r, ...referral } : r),
  })),
}));
