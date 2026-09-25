/**
 * QTransit Trips & Routes Service
 * Manages transport lines (routes) and scheduled trips.
 * Uses localStorage persistence so operations persist in frontend mode,
 * and structured for seamless migration to the FastAPI backend.
 */

import { Trip, TransportRoute, TripStatus } from "@/types";
import { fleetService } from "@/features/fleet/services/fleet.service";

export interface BusOption {
  id: string;
  registrationNumber: string;
  category: 'VIP' | 'STANDARD' | 'CLIMATISE';
  totalSeats: number;
  label: string;
}

export interface DriverOption {
  id: string;
  name: string;
  phone: string;
}

// ─── Default Routes ──────────────────────────────────────────────────────────
const DEFAULT_ROUTES: TransportRoute[] = [
  {
    id: "RT-001",
    code: "ABJ-BKE",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Bouaké (Gare Centrale)",
    distanceKm: 350,
    estimatedDurationMinutes: 300,
    basePrice: 10000,
    isActive: true,
  },
  {
    id: "RT-002",
    code: "ABJ-YAM",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Yamoussoukro (Gare Morofé)",
    distanceKm: 240,
    estimatedDurationMinutes: 180,
    basePrice: 6000,
    isActive: true,
  },
  {
    id: "RT-003",
    code: "ABJ-SPD",
    departureCity: "Abidjan (Gare Yopougon)",
    arrivalCity: "San-Pédro (Gare Bardot)",
    distanceKm: 360,
    estimatedDurationMinutes: 330,
    basePrice: 9000,
    isActive: true,
  },
  {
    id: "RT-004",
    code: "ABJ-KGO",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Korhogo (Gare Nord)",
    distanceKm: 570,
    estimatedDurationMinutes: 480,
    basePrice: 14000,
    isActive: true,
  },
  {
    id: "RT-005",
    code: "BKE-KGO",
    departureCity: "Bouaké (Gare Centrale)",
    arrivalCity: "Korhogo (Gare Nord)",
    distanceKm: 220,
    estimatedDurationMinutes: 210,
    basePrice: 5000,
    isActive: true,
  },
];

// ─── Default Buses ───────────────────────────────────────────────────────────
export const AVAILABLE_BUSES: BusOption[] = [
  {
    id: "BUS-104",
    registrationNumber: "104-GT-01",
    category: "VIP",
    totalSeats: 50,
    label: "Bus #104 — VIP (50 places - Climatisation, Wifi, USB)",
  },
  {
    id: "BUS-208",
    registrationNumber: "208-AB-02",
    category: "CLIMATISE",
    totalSeats: 45,
    label: "Bus #208 — Climatisé (45 places)",
  },
  {
    id: "BUS-112",
    registrationNumber: "112-CD-01",
    category: "VIP",
    totalSeats: 50,
    label: "Bus #112 — VIP (50 places - Confort Supérieur)",
  },
  {
    id: "BUS-301",
    registrationNumber: "301-KL-03",
    category: "VIP",
    totalSeats: 55,
    label: "Bus #301 — VIP Grande Capacité (55 places)",
  },
  {
    id: "BUS-087",
    registrationNumber: "087-XZ-01",
    category: "STANDARD",
    totalSeats: 60,
    label: "Bus #087 — Standard Express (60 places)",
  },
];

// ─── Default Drivers ─────────────────────────────────────────────────────────
export const AVAILABLE_DRIVERS: DriverOption[] = [
  { id: "DRV-01", name: "Kouassi Jean", phone: "+225 07 08 09 10 11" },
  { id: "DRV-02", name: "Traoré Moussa", phone: "+225 05 06 07 08 09" },
  { id: "DRV-03", name: "Konan Marc", phone: "+225 01 02 03 04 05" },
  { id: "DRV-04", name: "Diallo Ibrahim", phone: "+225 07 44 55 66 77" },
  { id: "DRV-05", name: "Bamba Sekou", phone: "+225 05 88 99 00 11" },
];

// ─── Default Scheduled Trips ──────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const DEFAULT_TRIPS: Trip[] = [
  {
    id: "TR-001",
    tripCode: "TR-2026-0042",
    routeId: "RT-001",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Bouaké (Gare Centrale)",
    departureDate: todayStr,
    departureTime: "08:30",
    estimatedArrivalTime: "13:30",
    busId: "BUS-104",
    busRegistration: "Bus #104 (104-GT-01)",
    busCategory: "VIP",
    driverName: "Kouassi Jean",
    driverPhone: "+225 07 08 09 10 11",
    totalSeats: 50,
    bookedSeats: 48,
    price: 10000,
    status: "BOARDING",
    isOnlineBookingEnabled: true,
  },
  {
    id: "TR-002",
    tripCode: "TR-2026-0043",
    routeId: "RT-003",
    departureCity: "Abidjan (Gare Yopougon)",
    arrivalCity: "San-Pédro (Gare Bardot)",
    departureDate: todayStr,
    departureTime: "09:00",
    estimatedArrivalTime: "14:30",
    busId: "BUS-208",
    busRegistration: "Bus #208 (208-AB-02)",
    busCategory: "CLIMATISE",
    driverName: "Traoré Moussa",
    driverPhone: "+225 05 06 07 08 09",
    totalSeats: 45,
    bookedSeats: 45,
    price: 9000,
    status: "SCHEDULED",
    isOnlineBookingEnabled: true,
  },
  {
    id: "TR-003",
    tripCode: "TR-2026-0044",
    routeId: "RT-002",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Yamoussoukro (Gare Morofé)",
    departureDate: todayStr,
    departureTime: "10:15",
    estimatedArrivalTime: "13:15",
    busId: "BUS-112",
    busRegistration: "Bus #112 (112-CD-01)",
    busCategory: "VIP",
    driverName: "Konan Marc",
    driverPhone: "+225 01 02 03 04 05",
    totalSeats: 50,
    bookedSeats: 28,
    price: 6000,
    status: "SCHEDULED",
    isOnlineBookingEnabled: true,
  },
  {
    id: "TR-004",
    tripCode: "TR-2026-0045",
    routeId: "RT-004",
    departureCity: "Abidjan (Gare d'Adjamé)",
    arrivalCity: "Korhogo (Gare Nord)",
    departureDate: todayStr,
    departureTime: "07:00",
    estimatedArrivalTime: "15:00",
    busId: "BUS-301",
    busRegistration: "Bus #301 (301-KL-03)",
    busCategory: "VIP",
    driverName: "Diallo Ibrahim",
    driverPhone: "+225 07 44 55 66 77",
    totalSeats: 55,
    bookedSeats: 52,
    price: 14000,
    status: "IN_TRANSIT",
    isOnlineBookingEnabled: true,
  },
  {
    id: "TR-005",
    tripCode: "TR-2026-0046",
    routeId: "RT-005",
    departureCity: "Bouaké (Gare Centrale)",
    arrivalCity: "Korhogo (Gare Nord)",
    departureDate: tomorrowStr,
    departureTime: "14:00",
    estimatedArrivalTime: "17:30",
    busId: "BUS-087",
    busRegistration: "Bus #087 (087-XZ-01)",
    busCategory: "STANDARD",
    driverName: "Bamba Sekou",
    driverPhone: "+225 05 88 99 00 11",
    totalSeats: 60,
    bookedSeats: 15,
    price: 5000,
    status: "SCHEDULED",
    isOnlineBookingEnabled: false, // Hors ligne / Guichet uniquement
  },
];

// Storage keys
const STORAGE_KEY_TRIPS = "qtransit_trips_data";
const STORAGE_KEY_ROUTES = "qtransit_routes_data";

function getStoredTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(DEFAULT_TRIPS));
      return DEFAULT_TRIPS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TRIPS;
  }
}

function saveStoredTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
  } catch (err) {
    console.error("Failed to save trips to localStorage", err);
  }
}

function getStoredRoutes(): TransportRoute[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROUTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(DEFAULT_ROUTES));
      return DEFAULT_ROUTES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ROUTES;
  }
}

function saveStoredRoutes(routes: TransportRoute[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
  } catch (err) {
    console.error("Failed to save routes to localStorage", err);
  }
}

export interface CreateTripDto {
  routeId: string;
  departureDate: string;
  departureTime: string;
  busId: string;
  driverName: string;
  driverPhone?: string;
  price: number;
  isOnlineBookingEnabled: boolean;
}

export interface CreateRouteDto {
  code: string;
  departureCity: string;
  arrivalCity: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  basePrice: number;
}

export const tripsService = {
  // Trips
  getTrips: (): Trip[] => {
    return getStoredTrips();
  },

  getBusOptions: (): BusOption[] => {
    const fleetBuses = fleetService.getBuses();
    if (fleetBuses && fleetBuses.length > 0) {
      return fleetBuses.map((b) => ({
        id: b.id,
        registrationNumber: b.registrationNumber,
        category: b.category,
        totalSeats: b.totalSeats,
        label: `${b.registrationNumber} — ${b.brand} ${b.model} (${b.category}, ${b.totalSeats} places)`,
      }));
    }
    return AVAILABLE_BUSES;
  },

  createTrip: (dto: CreateTripDto): Trip => {
    const routes = getStoredRoutes();
    const route = routes.find((r) => r.id === dto.routeId);
    const busOptions = tripsService.getBusOptions();
    const bus = busOptions.find((b) => b.id === dto.busId) || AVAILABLE_BUSES.find((b) => b.id === dto.busId);

    // Compute estimated arrival time based on departure + route duration
    const [depHours, depMins] = dto.departureTime.split(":").map(Number);
    const duration = route?.estimatedDurationMinutes ?? 180;
    const totalMinutes = depHours * 60 + depMins + duration;
    const arrHours = Math.floor((totalMinutes / 60) % 24);
    const arrMins = totalMinutes % 60;
    const estimatedArrivalTime = `${String(arrHours).padStart(2, "0")}:${String(arrMins).padStart(2, "0")}`;

    const trips = getStoredTrips();
    const nextNumber = trips.length + 42;
    const newTrip: Trip = {
      id: `TR-${Date.now()}`,
      tripCode: `TR-2026-${String(nextNumber).padStart(4, "0")}`,
      routeId: dto.routeId,
      departureCity: route?.departureCity ?? "Abidjan",
      arrivalCity: route?.arrivalCity ?? "Destination",
      departureDate: dto.departureDate,
      departureTime: dto.departureTime,
      estimatedArrivalTime,
      busId: dto.busId,
      busRegistration: bus ? `${bus.label.split("—")[0].trim()} (${bus.registrationNumber})` : "Bus inconnu",
      busCategory: bus?.category ?? "STANDARD",
      driverName: dto.driverName,
      driverPhone: dto.driverPhone,
      totalSeats: bus?.totalSeats ?? 50,
      bookedSeats: 0,
      price: dto.price,
      status: "SCHEDULED",
      isOnlineBookingEnabled: dto.isOnlineBookingEnabled,
    };

    const updated = [newTrip, ...trips];
    saveStoredTrips(updated);
    return newTrip;
  },

  updateTripStatus: (tripId: string, status: TripStatus): Trip[] => {
    const trips = getStoredTrips().map((t) =>
      t.id === tripId ? { ...t, status } : t
    );
    saveStoredTrips(trips);
    return trips;
  },

  toggleOnlineBooking: (tripId: string): Trip[] => {
    const trips = getStoredTrips().map((t) =>
      t.id === tripId
        ? { ...t, isOnlineBookingEnabled: !t.isOnlineBookingEnabled }
        : t
    );
    saveStoredTrips(trips);
    return trips;
  },

  deleteTrip: (tripId: string): Trip[] => {
    const trips = getStoredTrips().filter((t) => t.id !== tripId);
    saveStoredTrips(trips);
    return trips;
  },

  // Routes
  getRoutes: (): TransportRoute[] => {
    return getStoredRoutes();
  },

  createRoute: (dto: CreateRouteDto): TransportRoute => {
    const routes = getStoredRoutes();
    const newRoute: TransportRoute = {
      id: `RT-${Date.now()}`,
      code: dto.code.toUpperCase(),
      departureCity: dto.departureCity,
      arrivalCity: dto.arrivalCity,
      distanceKm: dto.distanceKm,
      estimatedDurationMinutes: dto.estimatedDurationMinutes,
      basePrice: dto.basePrice,
      isActive: true,
    };
    const updated = [...routes, newRoute];
    saveStoredRoutes(updated);
    return newRoute;
  },

  toggleRouteActive: (routeId: string): TransportRoute[] => {
    const routes = getStoredRoutes().map((r) =>
      r.id === routeId ? { ...r, isActive: !r.isActive } : r
    );
    saveStoredRoutes(routes);
    return routes;
  },
};
