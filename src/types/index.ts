export type RoleType = 
  | 'SUPER_ADMIN' 
  | 'COMPANY_ADMIN' 
  | 'AGENCY_MANAGER' 
  | 'CASHIER' 
  | 'DISPATCHER' 
  | 'CONTROLLER' 
  | 'ACCOUNTANT';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: RoleType;
  agencyId?: string;
  agencyName?: string;
  companyId: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface Agency {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  isMainAgency: boolean;
  isActive: boolean;
}

export type BusStatus = 'AVAILABLE' | 'IN_TRIP' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface Bus {
  id: string;
  registrationNumber: string; // Immatriculation
  brand: string;
  model: string;
  category: 'VIP' | 'STANDARD' | 'CLIMATISE';
  totalSeats: number;
  status: BusStatus;
  currentAgencyId?: string;
  lastMaintenanceDate?: string;
}

export type TripStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'CANCELLED';

export interface Trip {
  id: string;
  tripCode: string; // Ex: TR-2026-0042
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  estimatedArrivalTime: string;
  busId: string;
  busRegistration: string;
  driverName: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  status: TripStatus;
}

export interface DashboardKPIs {
  dailyRevenue: number;
  revenueTrend: number; // percentage +/-
  dailyTripsCount: number;
  tripsTrend: number;
  dailyPassengersCount: number;
  passengersTrend: number;
  fleetOccupancyRate: number; // percentage
  occupancyTrend: number;
  activeBusesCount: number;
  totalBusesCount: number;
}
