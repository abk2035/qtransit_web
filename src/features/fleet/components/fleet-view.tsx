import React, { useState, useMemo } from "react";
import {
  Bus as BusIcon,
  Plus,
  Search,
  Filter,
  Gauge,
  Calendar,
  MapPin,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Eye,
  Trash2,
  ArrowUpDown,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/context/language-context";
import { Bus, BusStatus } from "@/types";
import { fleetService } from "../services/fleet.service";
import { NewBusDialog } from "./new-bus-dialog";
import { BusDetailsModal } from "./bus-details-modal";
import { NewMaintenanceDialog } from "./new-maintenance-dialog";

export const FleetView: React.FC = () => {
  const { t } = useLanguage();

  // State
  const [buses, setBuses] = useState<Bus[]>(() => fleetService.getBuses());
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [agencyFilter, setAgencyFilter] = useState<string>("ALL");

  // Modals state
  const [isNewBusOpen, setIsNewBusOpen] = useState(false);
  const [selectedBusForDetails, setSelectedBusForDetails] = useState<Bus | null>(null);
  const [selectedBusForMaintenance, setSelectedBusForMaintenance] = useState<Bus | null>(null);

  const agencies = useMemo(() => fleetService.getAvailableAgencies(), []);

  // Filtered buses
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPlate = bus.registrationNumber.toLowerCase().includes(q);
        const matchesBrand = bus.brand.toLowerCase().includes(q);
        const matchesModel = bus.model.toLowerCase().includes(q);
        const matchesAgency = (bus.currentAgencyName ?? "").toLowerCase().includes(q);
        const matchesDriver = (bus.assignedDriverName ?? "").toLowerCase().includes(q);
        if (!matchesPlate && !matchesBrand && !matchesModel && !matchesAgency && !matchesDriver) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && bus.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "ALL" && bus.category !== categoryFilter) {
        return false;
      }

      // Agency
      if (agencyFilter !== "ALL" && bus.currentAgencyId !== agencyFilter) {
        return false;
      }

      return true;
    });
  }, [buses, searchQuery, statusFilter, categoryFilter, agencyFilter]);

  // KPIs
  const totalCount = buses.length;
  const availableCount = buses.filter((b) => b.status === "AVAILABLE").length;
  const inTripCount = buses.filter((b) => b.status === "IN_TRIP").length;
  const maintenanceCount = buses.filter((b) => b.status === "MAINTENANCE" || b.status === "OUT_OF_SERVICE").length;
  const availabilityRate = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  // Handlers
  const handleBusCreated = (newBus: Bus) => {
    setBuses(fleetService.getBuses());
  };

  const handleStatusChange = (busId: string, status: BusStatus) => {
    const updated = fleetService.updateBusStatus(busId, status);
    if (updated) {
      setBuses(fleetService.getBuses());
      if (selectedBusForDetails && selectedBusForDetails.id === busId) {
        setSelectedBusForDetails(updated);
      }
    }
  };

  const handleDeleteBus = (busId: string) => {
    if (confirm("Êtes-vous sûr de vouloir retirer ce bus de la flotte ?")) {
      const remaining = fleetService.deleteBus(busId);
      setBuses(remaining);
      if (selectedBusForDetails && selectedBusForDetails.id === busId) {
        setSelectedBusForDetails(null);
      }
    }
  };

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

  return (
    <div className="space-y-6">
      {/* ─── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-slate-100 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent shadow-xs">
              <BusIcon className="h-5 w-5" />
            </div>
            {t.modules.fleet.title}
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
            {t.modules.fleet.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewBusOpen(true)}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {t.modules.fleet.addBus}
          </Button>
        </div>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Parc */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                {t.modules.fleet.kpis.totalBuses}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {totalCount}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.kpis.totalDesc}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-text-primary dark:text-slate-200">
              <BusIcon className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 2: Disponibles */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {t.modules.fleet.kpis.available}
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {availableCount}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.kpis.availableDesc}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 3: En Trajet Actif */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                {t.modules.fleet.kpis.inTrip}
              </p>
              <h3 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {inTripCount}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.kpis.inTripDesc}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 4: En Maintenance */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {t.modules.fleet.kpis.maintenance}
              </p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {maintenanceCount}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.kpis.maintenanceDesc}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 5: Taux de Disponibilité */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary dark:text-accent uppercase tracking-wider">
                {t.modules.fleet.kpis.availabilityRate}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {availabilityRate}%
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.kpis.rateDesc}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent">
              <Gauge className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Search & Filters Bar ────────────────────────────────────────────── */}
      <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-muted dark:text-slate-400" />
            <Input
              type="text"
              placeholder={t.modules.fleet.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>

          {/* Filters and View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary"
            >
              <option value="ALL">{t.modules.fleet.status.ALL}</option>
              <option value="AVAILABLE">{t.modules.fleet.status.AVAILABLE}</option>
              <option value="IN_TRIP">{t.modules.fleet.status.IN_TRIP}</option>
              <option value="MAINTENANCE">{t.modules.fleet.status.MAINTENANCE}</option>
              <option value="OUT_OF_SERVICE">{t.modules.fleet.status.OUT_OF_SERVICE}</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary"
            >
              <option value="ALL">{t.modules.fleet.categories.ALL}</option>
              <option value="VIP">{t.modules.fleet.categories.VIP}</option>
              <option value="CLIMATISE">{t.modules.fleet.categories.CLIMATISE}</option>
              <option value="STANDARD">{t.modules.fleet.categories.STANDARD}</option>
            </select>

            {/* Agency Filter */}
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="h-9 rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary"
            >
              <option value="ALL">Toutes les gares</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("GRID")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "GRID"
                    ? "bg-surface dark:bg-slate-900 text-primary dark:text-accent shadow-2xs font-semibold"
                    : "text-text-muted hover:text-text-primary dark:text-slate-400"
                }`}
                title={t.modules.fleet.viewGrid}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("TABLE")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "TABLE"
                    ? "bg-surface dark:bg-slate-900 text-primary dark:text-accent shadow-2xs font-semibold"
                    : "text-text-muted hover:text-text-primary dark:text-slate-400"
                }`}
                title={t.modules.fleet.viewTable}
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Empty state ────────────────────────────────────────────────────── */}
      {filteredBuses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400 mb-4">
              <BusIcon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-text-primary dark:text-slate-100">
              {t.modules.fleet.noBusesFound}
            </h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              Essayez de modifier vos filtres ou d'enregistrer un nouveau véhicule dans le parc.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "GRID" ? (
        /* ─── Grid View (Cards) ────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBuses.map((bus) => (
            <Card
              key={bus.id}
              className="group overflow-hidden border-border dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Plate badge & Category & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Realistic styled license plate */}
                    <span className="font-mono font-bold text-xs tracking-wider px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-950 text-amber-400 border border-slate-700 shadow-2xs">
                      {bus.registrationNumber}
                    </span>
                    {renderCategoryBadge(bus.category)}
                  </div>
                  {renderStatusBadge(bus.status)}
                </div>

                {/* Brand & Model */}
                <div>
                  <h3 className="text-base font-bold text-text-primary dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {bus.brand} {bus.model}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-muted dark:text-slate-400 mt-0.5">
                    <span>Année {bus.year ?? "2023"}</span>
                    <span>•</span>
                    <span>
                      {bus.totalSeats} {t.modules.fleet.card.seats} ({bus.seatLayoutType === "2x1" ? "VIP 2+1" : "Standard 2+2"})
                    </span>
                  </div>
                </div>

                {/* Location / Agency */}
                <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-primary dark:text-accent shrink-0" />
                  <span className="truncate">{bus.currentAgencyName ?? "Gare d'attache"}</span>
                </div>

                {/* Mileage bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-muted dark:text-slate-400 flex items-center gap-1">
                      <Gauge className="h-3.5 w-3.5" />
                      {t.modules.fleet.card.mileage}
                    </span>
                    <span className="font-semibold text-text-primary dark:text-slate-200">
                      {(bus.mileageKm ?? 0).toLocaleString("fr-FR")} km
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary dark:bg-accent rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(15, ((bus.mileageKm ?? 0) % 50000) / 500))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Amenities pills */}
                {bus.amenities && bus.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bus.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-300"
                      >
                        {t.modules.fleet.amenities[amenity] ?? amenity}
                      </span>
                    ))}
                    {bus.amenities.length > 4 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400">
                        +{bus.amenities.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/70 dark:bg-slate-900/60 border-t border-border dark:border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBusForDetails(bus)}
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  {t.modules.fleet.card.viewDetails}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBusForMaintenance(bus)}
                  className="text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  title={t.modules.fleet.card.newMaintenance}
                >
                  <Wrench className="h-3.5 w-3.5" />
                </Button>

                <button
                  type="button"
                  onClick={() => handleDeleteBus(bus.id)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-red-950/30 transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* ─── Table View (List) ────────────────────────────────────────────── */
        <Card className="overflow-hidden border-border dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 dark:bg-slate-800/50">
                <TableHead className="font-semibold text-xs">Véhicule & Marque</TableHead>
                <TableHead className="font-semibold text-xs">Immatriculation</TableHead>
                <TableHead className="font-semibold text-xs">Catégorie</TableHead>
                <TableHead className="font-semibold text-xs">Capacité</TableHead>
                <TableHead className="font-semibold text-xs">Statut</TableHead>
                <TableHead className="font-semibold text-xs">Gare d'attache</TableHead>
                <TableHead className="font-semibold text-xs">Kilométrage</TableHead>
                <TableHead className="font-semibold text-xs">Prochaine Visite</TableHead>
                <TableHead className="text-right font-semibold text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuses.map((bus) => (
                <TableRow
                  key={bus.id}
                  className="hover:bg-surface-hover dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedBusForDetails(bus)}
                >
                  <TableCell>
                    <div className="font-bold text-xs text-text-primary dark:text-slate-100">
                      {bus.brand} {bus.model}
                    </div>
                    <div className="text-[11px] text-text-muted dark:text-slate-400">
                      Année {bus.year ?? "2023"} • {bus.assignedDriverName ?? "Chauffeur libre"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-950 text-amber-400 border border-slate-700">
                      {bus.registrationNumber}
                    </span>
                  </TableCell>
                  <TableCell>{renderCategoryBadge(bus.category)}</TableCell>
                  <TableCell className="text-xs font-semibold">
                    {bus.totalSeats} pl. ({bus.seatLayoutType === "2x1" ? "VIP" : "2x2"})
                  </TableCell>
                  <TableCell>{renderStatusBadge(bus.status)}</TableCell>
                  <TableCell className="text-xs text-text-secondary dark:text-slate-300">
                    {bus.currentAgencyName ?? "Gare Principale"}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {(bus.mileageKm ?? 0).toLocaleString("fr-FR")} km
                  </TableCell>
                  <TableCell className="text-xs text-text-secondary dark:text-slate-300">
                    {bus.nextInspectionDate ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBusForDetails(bus)}
                        className="h-8 px-2 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBusForMaintenance(bus)}
                        className="h-8 px-2 text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        title={t.modules.fleet.card.newMaintenance}
                      >
                        <Wrench className="h-3.5 w-3.5" />
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBus(bus.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-red-950/30 transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      <NewBusDialog
        isOpen={isNewBusOpen}
        onClose={() => setIsNewBusOpen(false)}
        onBusCreated={handleBusCreated}
      />

      <BusDetailsModal
        isOpen={!!selectedBusForDetails}
        bus={selectedBusForDetails}
        onClose={() => setSelectedBusForDetails(null)}
        onStatusChange={handleStatusChange}
        onOpenMaintenanceModal={(bus) => {
          setSelectedBusForDetails(null);
          setSelectedBusForMaintenance(bus);
        }}
        maintenanceRecords={
          selectedBusForDetails
            ? fleetService.getMaintenanceRecords(selectedBusForDetails.id)
            : []
        }
      />

      <NewMaintenanceDialog
        isOpen={!!selectedBusForMaintenance}
        bus={selectedBusForMaintenance}
        onClose={() => setSelectedBusForMaintenance(null)}
        onMaintenanceAdded={() => {
          setBuses(fleetService.getBuses());
        }}
      />
    </div>
  );
};
