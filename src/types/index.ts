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

export type BusAmenity = 
  | 'wifi' 
  | 'airConditioning' 
  | 'usbOutlets' 
  | 'tv' 
  | 'toilets' 
  | 'recliningSeats';

export type SeatLayoutType = '2x2' | '2x1';

export interface Bus {
  id: string;
  registrationNumber: string; // Immatriculation (ex: 104-GT-01)
  brand: string; // Ex: Scania, Mercedes-Benz, Volvo
  model: string; // Ex: Marcopolo Paradiso G7, Travego
  category: 'VIP' | 'STANDARD' | 'CLIMATISE';
  totalSeats: number;
  status: BusStatus;
  currentAgencyId?: string;
  currentAgencyName?: string;
  mileageKm?: number;
  year?: number;
  lastMaintenanceDate?: string;
  nextInspectionDate?: string; // Prochaine visite technique
  insuranceExpiryDate?: string;
  lastOilChangeMileage?: number;
  amenities?: BusAmenity[];
  seatLayoutType?: SeatLayoutType;
  assignedDriverName?: string;
}

export type MaintenanceType = 
  | 'OIL_CHANGE' 
  | 'TECHNICAL_INSPECTION' 
  | 'BRAKES' 
  | 'TIRES' 
  | 'AIR_CONDITIONING' 
  | 'BODYWORK' 
  | 'GENERAL_REVISION';

export interface BusMaintenanceRecord {
  id: string;
  busId: string;
  busRegistration: string;
  date: string;
  type: MaintenanceType;
  description: string;
  cost: number; // en FCFA
  garageName: string;
  mileageAtService: number;
  performedBy?: string;
}

export type TripStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'CANCELLED';

export interface TransportRoute {
  id: string;
  code: string; // Ex: RT-ABJ-BKE
  departureCity: string;
  arrivalCity: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  basePrice: number;
  isActive: boolean;
}

export interface Trip {
  id: string;
  tripCode: string; // Ex: TR-2026-0042
  routeId?: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  estimatedArrivalTime: string; // HH:mm
  busId: string;
  busRegistration: string;
  busCategory: 'VIP' | 'STANDARD' | 'CLIMATISE';
  driverName: string;
  driverPhone?: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  status: TripStatus;
  isOnlineBookingEnabled: boolean; // Accessible pour l'app mobile Flutter
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
