/**
 * QTransit Fleet Service
 * Centralized service managing bus inventory, specifications, seat configurations,
 * maintenance logs, and operational statuses.
 * Persists data in localStorage and synchronizes with trips service.
 */

import { Bus, BusStatus, BusMaintenanceRecord, MaintenanceType } from "@/types";

const STORAGE_KEY_BUSES = "qtransit_fleet_buses_v1";
const STORAGE_KEY_MAINTENANCE = "qtransit_fleet_maintenance_v1";

// ─── Initial Seed Buses ───────────────────────────────────────────────────────
const INITIAL_BUSES: Bus[] = [
  {
    id: "BUS-104",
    registrationNumber: "104-GT-01",
    brand: "Scania",
    model: "Marcopolo Paradiso G7 1200",
    category: "VIP",
    totalSeats: 50,
    status: "AVAILABLE",
    currentAgencyId: "AG-001",
    currentAgencyName: "Abidjan (Gare d'Adjamé)",
    mileageKm: 142500,
    year: 2023,
    lastMaintenanceDate: "2026-08-15",
    nextInspectionDate: "2026-11-20",
    insuranceExpiryDate: "2027-02-15",
    lastOilChangeMileage: 140000,
    amenities: [
      "wifi",
      "airConditioning",
      "usbOutlets",
      "tv",
      "toilets",
      "recliningSeats",
    ],
    seatLayoutType: "2x1",
    assignedDriverName: "Kouamé Jean-Baptiste",
  },
  {
    id: "BUS-208",
    registrationNumber: "208-AB-02",
    brand: "Mercedes-Benz",
    model: "Travego 15 SHD",
    category: "CLIMATISE",
    totalSeats: 45,
    status: "IN_TRIP",
    currentAgencyId: "AG-002",
    currentAgencyName: "Bouaké (Gare Centrale)",
    mileageKm: 198200,
    year: 2022,
    lastMaintenanceDate: "2026-07-28",
    nextInspectionDate: "2026-10-15",
    insuranceExpiryDate: "2026-12-31",
    lastOilChangeMileage: 195000,
    amenities: ["airConditioning", "usbOutlets", "tv", "recliningSeats"],
    seatLayoutType: "2x2",
    assignedDriverName: "Koné Bakary",
  },
  {
    id: "BUS-112",
    registrationNumber: "112-CD-01",
    brand: "Volvo",
    model: "9700 Grand Luxe",
    category: "VIP",
    totalSeats: 50,
    status: "AVAILABLE",
    currentAgencyId: "AG-003",
    currentAgencyName: "Yamoussoukro (Gare Morofé)",
    mileageKm: 87400,
    year: 2024,
    lastMaintenanceDate: "2026-09-02",
    nextInspectionDate: "2027-03-10",
    insuranceExpiryDate: "2027-04-01",
    lastOilChangeMileage: 85000,
    amenities: [
      "wifi",
      "airConditioning",
      "usbOutlets",
      "tv",
      "toilets",
      "recliningSeats",
    ],
    seatLayoutType: "2x1",
    assignedDriverName: "Ouattara Seydou",
  },
  {
    id: "BUS-315",
    registrationNumber: "315-EF-01",
    brand: "Yutong",
    model: "ZK6122HD Coach",
    category: "STANDARD",
    totalSeats: 55,
    status: "MAINTENANCE",
    currentAgencyId: "AG-001",
    currentAgencyName: "Abidjan (Gare Yopougon)",
    mileageKm: 245000,
    year: 2021,
    lastMaintenanceDate: "2026-09-18",
    nextInspectionDate: "2026-10-05",
    insuranceExpiryDate: "2026-11-30",
    lastOilChangeMileage: 240000,
    amenities: ["airConditioning", "recliningSeats"],
    seatLayoutType: "2x2",
    assignedDriverName: "Traoré Mamadou",
  },
  {
    id: "BUS-420",
    registrationNumber: "420-KL-02",
    brand: "Toyota",
    model: "Coaster Executive Shuttle",
    category: "VIP",
    totalSeats: 30,
    status: "AVAILABLE",
    currentAgencyId: "AG-004",
    currentAgencyName: "San-Pédro (Gare Bardot)",
    mileageKm: 64200,
    year: 2024,
    lastMaintenanceDate: "2026-08-30",
    nextInspectionDate: "2027-02-28",
    insuranceExpiryDate: "2027-03-15",
    lastOilChangeMileage: 60000,
    amenities: ["wifi", "airConditioning", "usbOutlets", "tv", "recliningSeats"],
    seatLayoutType: "2x1",
    assignedDriverName: "Bamba Drissa",
  },
  {
    id: "BUS-502",
    registrationNumber: "502-MN-01",
    brand: "Scania",
    model: "Irizar i6 High Deck",
    category: "CLIMATISE",
    totalSeats: 48,
    status: "IN_TRIP",
    currentAgencyId: "AG-005",
    currentAgencyName: "Korhogo (Gare Nord)",
    mileageKm: 175600,
    year: 2022,
    lastMaintenanceDate: "2026-07-12",
    nextInspectionDate: "2026-12-01",
    insuranceExpiryDate: "2027-01-20",
    lastOilChangeMileage: 170000,
    amenities: ["airConditioning", "usbOutlets", "tv", "recliningSeats"],
    seatLayoutType: "2x2",
    assignedDriverName: "Yao N'Guessan",
  },
];

// ─── Initial Maintenance Logs ─────────────────────────────────────────────────
const INITIAL_MAINTENANCE: BusMaintenanceRecord[] = [
  {
    id: "MNT-2026-001",
    busId: "BUS-104",
    busRegistration: "104-GT-01",
    date: "2026-08-15",
    type: "OIL_CHANGE",
    description: "Vidange complète 15W40 Heavy Duty, remplacement filtres à huile, gazole et air.",
    cost: 165000,
    garageName: "Atelier Central Scania CI (Abidjan)",
    mileageAtService: 140000,
    performedBy: "Équipe Mécanique Poids Lourds",
  },
  {
    id: "MNT-2026-002",
    busId: "BUS-315",
    busRegistration: "315-EF-01",
    date: "2026-09-18",
    type: "BRAKES",
    description: "Remplacement complet des garnitures de freins tambours arrière et plaquettes avant.",
    cost: 340000,
    garageName: "Garage Mécanique Express Yopougon",
    mileageAtService: 245000,
    performedBy: "M. Touré (Chef mécano)",
  },
  {
    id: "MNT-2026-003",
    busId: "BUS-208",
    busRegistration: "208-AB-02",
    date: "2026-07-28",
    type: "TECHNICAL_INSPECTION",
    description: "Contrôle technique officiel SICTA valide 6 mois. Aucun défaut majeur.",
    cost: 85000,
    garageName: "Centre de Contrôle Automobile SICTA Vridi",
    mileageAtService: 195000,
    performedBy: "Inspecteur Agréé SICTA",
  },
  {
    id: "MNT-2026-004",
    busId: "BUS-112",
    busRegistration: "112-CD-01",
    date: "2026-09-02",
    type: "AIR_CONDITIONING",
    description: "Recharge gaz R134a et nettoyage du compresseur de climatisation de toit.",
    cost: 120000,
    garageName: "Froid & Climatisation Transport Morofé",
    mileageAtService: 85000,
    performedBy: "Technicien Frigoriste",
  },
];

class FleetService {
  // ─── Buses CRUD ────────────────────────────────────────────────────────────
  public getBuses(): Bus[] {
    const raw = localStorage.getItem(STORAGE_KEY_BUSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BUSES, JSON.stringify(INITIAL_BUSES));
      return INITIAL_BUSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BUSES;
    }
  }

  public getBusById(id: string): Bus | undefined {
    return this.getBuses().find((b) => b.id === id);
  }

  public createBus(data: Omit<Bus, "id">): Bus {
    const buses = this.getBuses();
    const nextNumber = buses.length + 101;
    const newBus: Bus = {
      ...data,
      id: `BUS-${nextNumber}`,
    };
    const updated = [newBus, ...buses];
    localStorage.setItem(STORAGE_KEY_BUSES, JSON.stringify(updated));
    return newBus;
  }

  public updateBus(id: string, updates: Partial<Bus>): Bus | null {
    const buses = this.getBuses();
    const index = buses.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updatedBus: Bus = {
      ...buses[index],
      ...updates,
    };
    buses[index] = updatedBus;
    localStorage.setItem(STORAGE_KEY_BUSES, JSON.stringify(buses));
    return updatedBus;
  }

  public updateBusStatus(id: string, status: BusStatus): Bus | null {
    return this.updateBus(id, { status });
  }

  public deleteBus(id: string): Bus[] {
    const buses = this.getBuses().filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY_BUSES, JSON.stringify(buses));
    return buses;
  }

  // ─── Maintenance Records ───────────────────────────────────────────────────
  public getMaintenanceRecords(busId?: string): BusMaintenanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY_MAINTENANCE);
    let records: BusMaintenanceRecord[] = [];
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY_MAINTENANCE,
        JSON.stringify(INITIAL_MAINTENANCE)
      );
      records = INITIAL_MAINTENANCE;
    } else {
      try {
        records = JSON.parse(raw);
      } catch {
        records = INITIAL_MAINTENANCE;
      }
    }

    if (busId) {
      return records.filter((r) => r.busId === busId);
    }
    return records;
  }

  public addMaintenanceRecord(
    record: Omit<BusMaintenanceRecord, "id">
  ): BusMaintenanceRecord {
    const records = this.getMaintenanceRecords();
    const id = `MNT-2026-${String(records.length + 1).padStart(3, "0")}`;
    const newRecord: BusMaintenanceRecord = {
      ...record,
      id,
    };
    const updatedRecords = [newRecord, ...records];
    localStorage.setItem(
      STORAGE_KEY_MAINTENANCE,
      JSON.stringify(updatedRecords)
    );

    // Also update bus lastMaintenanceDate and mileage if applicable
    this.updateBus(record.busId, {
      lastMaintenanceDate: record.date,
      ...(record.type === "OIL_CHANGE"
        ? { lastOilChangeMileage: record.mileageAtService }
        : {}),
      mileageKm: Math.max(
        this.getBusById(record.busId)?.mileageKm ?? 0,
        record.mileageAtService
      ),
    });

    return newRecord;
  }

  // ─── Available Agencies & Drivers helper ───────────────────────────────────
  public getAvailableAgencies(): { id: string; name: string }[] {
    return [
      { id: "AG-001", name: "Abidjan (Gare d'Adjamé)" },
      { id: "AG-002", name: "Bouaké (Gare Centrale)" },
      { id: "AG-003", name: "Yamoussoukro (Gare Morofé)" },
      { id: "AG-004", name: "San-Pédro (Gare Bardot)" },
      { id: "AG-005", name: "Korhogo (Gare Nord)" },
      { id: "AG-006", name: "Abidjan (Gare Yopougon)" },
    ];
  }
}

export const fleetService = new FleetService();
