import React, { useState } from "react";
import {
  X,
  Bus as BusIcon,
  Shield,
  Gauge,
  Calendar,
  MapPin,
  Sparkles,
  Wrench,
  Wifi,
  Wind,
  Zap,
  Tv,
  Coffee,
  Armchair,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Compass,
  DollarSign,
  Building2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { Bus, BusStatus, BusMaintenanceRecord, BusAmenity } from "@/types";
import { fleetService } from "../services/fleet.service";

interface BusDetailsModalProps {
  isOpen: boolean;
  bus: Bus | null;
  onClose: () => void;
  onStatusChange: (busId: string, status: BusStatus) => void;
  onOpenMaintenanceModal: (bus: Bus) => void;
  maintenanceRecords: BusMaintenanceRecord[];
}

export const BusDetailsModal: React.FC<BusDetailsModalProps> = ({
  isOpen,
  bus,
  onClose,
  onStatusChange,
  onOpenMaintenanceModal,
  maintenanceRecords,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"GENERAL" | "SEATS" | "MAINTENANCE">("GENERAL");

  if (!isOpen || !bus) return null;

  const totalMaintenanceSpent = maintenanceRecords.reduce(
    (acc, record) => acc + (record.cost || 0),
    0
  );

  const renderStatusBadge = (status: BusStatus) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge variant="success">{t.modules.fleet.status.AVAILABLE}</Badge>;
      case "IN_TRIP":
        return <Badge variant="info">{t.modules.fleet.status.IN_TRIP}</Badge>;
      case "MAINTENANCE":
        return <Badge variant="warning">{t.modules.fleet.status.MAINTENANCE}</Badge>;
      case "OUT_OF_SERVICE":
        return <Badge variant="danger">{t.modules.fleet.status.OUT_OF_SERVICE}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case "VIP":
        return (
          <Badge variant="primary" size="sm">
            {t.modules.fleet.categories.VIP}
          </Badge>
        );
      case "CLIMATISE":
        return (
          <Badge variant="info" size="sm">
            {t.modules.fleet.categories.CLIMATISE}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {t.modules.fleet.categories.STANDARD}
          </Badge>
        );
    }
  };

  const getAmenityIcon = (amenity: BusAmenity) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4 text-sky-500" />;
      case "airConditioning":
        return <Wind className="h-4 w-4 text-teal-500" />;
      case "usbOutlets":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "tv":
        return <Tv className="h-4 w-4 text-purple-500" />;
      case "toilets":
        return <Coffee className="h-4 w-4 text-emerald-500" />;
      case "recliningSeats":
        return <Armchair className="h-4 w-4 text-blue-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  // Generate 2D cabin seat grid layout
  const renderCabinLayout = () => {
    const isVipLayout = bus.seatLayoutType === "2x1";
    const total = bus.totalSeats || 50;

    // Normal rows have 3 seats (VIP: 2+1) or 4 seats (Standard: 2+2)
    const seatsPerRow = isVipLayout ? 3 : 4;
    // Keep 5 seats for the very back row
    const regularSeatsCount = Math.max(0, total - 5);
    const numRegularRows = Math.ceil(regularSeatsCount / seatsPerRow);

    let seatCounter = 1;

    return (
      <div className="flex flex-col items-center py-4">
        {/* Bus shell container */}
        <div className="w-full max-w-md rounded-[2.5rem] border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 shadow-xl overflow-hidden p-6 relative">
          {/* Front Windshield / Driver Cabin */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-200/70 dark:bg-slate-800/80 p-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.details.driverCabin}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted dark:text-slate-400 bg-surface dark:bg-slate-900 px-2.5 py-1 rounded-md border border-border dark:border-slate-800">
              🚪 Porte Entrée
            </div>
          </div>

          {/* Rows of seats */}
          <div className="space-y-3">
            {Array.from({ length: numRegularRows }).map((_, rowIndex) => {
              if (isVipLayout) {
                // VIP 2x1 Layout
                const seat1 = seatCounter++;
                const seat2 = seatCounter <= regularSeatsCount ? seatCounter++ : null;
                const seat3 = seatCounter <= regularSeatsCount ? seatCounter++ : null;

                return (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex items-center justify-between gap-3 px-2"
                  >
                    {/* Left side: 2 seats */}
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-primary-100 dark:bg-teal-950/80 border border-primary-200 dark:border-teal-800 text-primary dark:text-accent font-bold text-xs flex items-center justify-center shadow-xs">
                        {seat1}
                      </div>
                      {seat2 ? (
                        <div className="h-9 w-9 rounded-xl bg-primary-100 dark:bg-teal-950/80 border border-primary-200 dark:border-teal-800 text-primary dark:text-accent font-bold text-xs flex items-center justify-center shadow-xs">
                          {seat2}
                        </div>
                      ) : (
                        <div className="h-9 w-9" />
                      )}
                    </div>

                    {/* Central aisle */}
                    <div className="text-[10px] uppercase font-mono tracking-wider text-text-muted/60 dark:text-slate-600 select-none">
                      {rowIndex + 1}
                    </div>

                    {/* Right side: 1 spacious VIP seat */}
                    <div className="flex items-center">
                      {seat3 ? (
                        <div className="h-9 w-10 rounded-xl bg-accent-100/90 dark:bg-teal-900/60 border border-accent-300 dark:border-teal-600 text-primary-800 dark:text-accent font-bold text-xs flex items-center justify-center shadow-xs">
                          {seat3}
                        </div>
                      ) : (
                        <div className="h-9 w-10" />
                      )}
                    </div>
                  </div>
                );
              } else {
                // Standard 2x2 Layout
                const seat1 = seatCounter++;
                const seat2 = seatCounter <= regularSeatsCount ? seatCounter++ : null;
                const seat3 = seatCounter <= regularSeatsCount ? seatCounter++ : null;
                const seat4 = seatCounter <= regularSeatsCount ? seatCounter++ : null;

                return (
                  <div
                    key={`row-${rowIndex}`}
                    className="flex items-center justify-between gap-3 px-2"
                  >
                    {/* Left: 2 seats */}
                    <div className="flex items-center gap-1.5">
                      <div className="h-8 w-8 rounded-lg bg-surface dark:bg-slate-800 border border-border dark:border-slate-700 text-text-primary dark:text-slate-200 font-semibold text-xs flex items-center justify-center shadow-xs">
                        {seat1}
                      </div>
                      {seat2 ? (
                        <div className="h-8 w-8 rounded-lg bg-surface dark:bg-slate-800 border border-border dark:border-slate-700 text-text-primary dark:text-slate-200 font-semibold text-xs flex items-center justify-center shadow-xs">
                          {seat2}
                        </div>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>

                    {/* Central Aisle */}
                    <div className="text-[10px] font-mono text-text-muted/60 dark:text-slate-600 select-none">
                      {rowIndex + 1}
                    </div>

                    {/* Right: 2 seats */}
                    <div className="flex items-center gap-1.5">
                      {seat3 ? (
                        <div className="h-8 w-8 rounded-lg bg-surface dark:bg-slate-800 border border-border dark:border-slate-700 text-text-primary dark:text-slate-200 font-semibold text-xs flex items-center justify-center shadow-xs">
                          {seat3}
                        </div>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                      {seat4 ? (
                        <div className="h-8 w-8 rounded-lg bg-surface dark:bg-slate-800 border border-border dark:border-slate-700 text-text-primary dark:text-slate-200 font-semibold text-xs flex items-center justify-center shadow-xs">
                          {seat4}
                        </div>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                  </div>
                );
              }
            })}

            {/* Back Row (5 seats across) */}
            <div className="pt-3 border-t border-dashed border-slate-300 dark:border-slate-700">
              <div className="text-center text-[10px] font-semibold text-text-muted dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                {t.modules.fleet.details.backSeats}
              </div>
              <div className="flex items-center justify-between gap-1.5 px-1">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const backSeatNum = seatCounter <= total ? seatCounter++ : null;
                  return backSeatNum ? (
                    <div
                      key={`back-${idx}`}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary-50 dark:bg-teal-950/60 border border-primary-200 dark:border-teal-800 text-primary dark:text-accent font-bold text-xs flex items-center justify-center shadow-xs"
                    >
                      {backSeatNum}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-primary-100 dark:bg-teal-950 border border-primary-300 dark:border-teal-700" />
            <span>{t.modules.fleet.details.legendAvailable}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-primary dark:text-accent">
              {bus.seatLayoutType === "2x1" ? "VIP Confort (2+1)" : "Standard Interurbain (2+2)"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Armchair className="h-4 w-4 text-text-muted" />
            <span>Capacité certifiée : {bus.totalSeats} places</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent shadow-xs">
              <BusIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg tracking-wide px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-text-primary dark:text-slate-100 border border-border dark:border-slate-700">
                  {bus.registrationNumber}
                </span>
                {renderCategoryBadge(bus.category)}
                {renderStatusBadge(bus.status)}
              </div>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
                {bus.brand} {bus.model} • {bus.year ?? "2023"} • {bus.totalSeats} {t.modules.fleet.card.seats}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary dark:text-slate-400 dark:hover:text-slate-100 hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-border dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("GENERAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "GENERAL"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary dark:text-slate-400 hover:bg-surface-hover dark:hover:bg-slate-800"
            }`}
          >
            {t.modules.fleet.details.tabGeneral}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SEATS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "SEATS"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary dark:text-slate-400 hover:bg-surface-hover dark:hover:bg-slate-800"
            }`}
          >
            {t.modules.fleet.details.tabSeats}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("MAINTENANCE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "MAINTENANCE"
                ? "bg-primary text-white shadow-xs"
                : "text-text-secondary dark:text-slate-400 hover:bg-surface-hover dark:hover:bg-slate-800"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            {t.modules.fleet.details.tabMaintenance}
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-text-primary dark:text-slate-100">
              {maintenanceRecords.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto py-4 flex-1">
          {activeTab === "GENERAL" && (
            <div className="space-y-6">
              {/* Quick status change bar */}
              <div className="p-3.5 rounded-xl border border-border dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-text-primary dark:text-slate-200">
                    {t.modules.fleet.details.changeStatusTitle}
                  </span>
                  <span className="text-xs text-text-muted dark:text-slate-400">
                    Statut actuel : <span className="font-bold">{t.modules.fleet.status[bus.status]}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={bus.status === "AVAILABLE" ? "primary" : "outline"}
                    onClick={() => onStatusChange(bus.id, "AVAILABLE")}
                    className="text-xs justify-center"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                    {t.modules.fleet.status.AVAILABLE}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={bus.status === "IN_TRIP" ? "primary" : "outline"}
                    onClick={() => onStatusChange(bus.id, "IN_TRIP")}
                    className="text-xs justify-center"
                  >
                    <Clock className="h-3.5 w-3.5 mr-1 text-sky-500" />
                    {t.modules.fleet.status.IN_TRIP}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={bus.status === "MAINTENANCE" ? "primary" : "outline"}
                    onClick={() => onStatusChange(bus.id, "MAINTENANCE")}
                    className="text-xs justify-center"
                  >
                    <Wrench className="h-3.5 w-3.5 mr-1 text-amber-500" />
                    {t.modules.fleet.status.MAINTENANCE}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={bus.status === "OUT_OF_SERVICE" ? "primary" : "outline"}
                    onClick={() => onStatusChange(bus.id, "OUT_OF_SERVICE")}
                    className="text-xs justify-center"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mr-1 text-rose-500" />
                    {t.modules.fleet.status.OUT_OF_SERVICE}
                  </Button>
                </div>
              </div>

              {/* Technical specs grid */}
              <div>
                <h4 className="text-xs font-bold text-text-primary dark:text-slate-200 uppercase tracking-wider mb-3">
                  {t.modules.fleet.details.specsTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.brandModel}
                    </span>
                    <span className="text-sm font-semibold text-text-primary dark:text-slate-100">
                      {bus.brand} {bus.model}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.currentAgency}
                    </span>
                    <span className="text-sm font-semibold text-text-primary dark:text-slate-100 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary dark:text-accent" />
                      {bus.currentAgencyName ?? "Gare Principale"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.mileage}
                    </span>
                    <span className="text-sm font-bold text-text-primary dark:text-slate-100 flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-amber-500" />
                      {(bus.mileageKm ?? 0).toLocaleString("fr-FR")} km
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.year}
                    </span>
                    <span className="text-sm font-semibold text-text-primary dark:text-slate-100">
                      {bus.year ?? "2023"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.nextInspection}
                    </span>
                    <span className="text-sm font-semibold text-text-primary dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-rose-500" />
                      {bus.nextInspectionDate ?? "Non programmée"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
                    <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.insuranceExpiry}
                    </span>
                    <span className="text-sm font-semibold text-text-primary dark:text-slate-100 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      {bus.insuranceExpiryDate ?? "Valide"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chauffeur habituel */}
              <div className="p-3.5 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-primary dark:text-slate-200">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted dark:text-slate-400 block">
                      {t.modules.fleet.details.driverAssigned}
                    </span>
                    <span className="text-sm font-bold text-text-primary dark:text-slate-100">
                      {bus.assignedDriverName || t.modules.fleet.details.noDriver}
                    </span>
                  </div>
                </div>
                {renderCategoryBadge(bus.category)}
              </div>

              {/* Amenities */}
              {bus.amenities && bus.amenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-text-primary dark:text-slate-200 uppercase tracking-wider mb-2.5">
                    {t.modules.fleet.details.amenitiesTitle}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 text-xs font-medium text-text-primary dark:text-slate-200 shadow-2xs"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{t.modules.fleet.amenities[amenity] ?? amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "SEATS" && (
            <div>
              <p className="text-xs text-text-secondary dark:text-slate-400 mb-2 text-center">
                {t.modules.fleet.details.seatsGuide}
              </p>
              {renderCabinLayout()}
            </div>
          )}

          {activeTab === "MAINTENANCE" && (
            <div className="space-y-4">
              {/* Cost summary card & action button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30">
                <div>
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 block">
                    {t.modules.fleet.details.totalMaintenanceCost}
                  </span>
                  <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
                    {formatCurrency(totalMaintenanceSpent)}
                  </span>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                    Sur {maintenanceRecords.length} intervention(s) technique(s)
                  </p>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenMaintenanceModal(bus)}
                  className="shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {t.modules.fleet.details.addMaintenanceBtn}
                </Button>
              </div>

              {/* Maintenance records list */}
              {maintenanceRecords.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 text-text-muted dark:text-slate-400 text-xs">
                  {t.modules.fleet.details.noMaintenanceYet}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {maintenanceRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-3.5 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Wrench className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-text-primary dark:text-slate-100">
                              {t.modules.fleet.maintenanceTypes[record.type] ?? record.type}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted dark:text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {record.date}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Gauge className="h-3 w-3" />
                                {record.mileageAtService.toLocaleString("fr-FR")} km
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-primary dark:text-accent">
                            {formatCurrency(record.cost)}
                          </span>
                          <span className="text-[11px] text-text-muted dark:text-slate-400 block">
                            {record.garageName}
                          </span>
                        </div>
                      </div>

                      {record.description && (
                        <p className="mt-2 text-xs text-text-secondary dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-border/50 dark:border-slate-800">
                          {record.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border dark:border-slate-800 flex items-center justify-end shrink-0">
          <Button variant="outline" size="md" onClick={onClose}>
            {t.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
};
