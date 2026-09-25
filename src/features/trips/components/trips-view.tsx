import React, { useState, useMemo } from "react";
import {
  Route as RouteIcon,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  Bus,
  Users,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Tag,
  Gauge,
  ArrowRight,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";
import { tripsService } from "../services/trips.service";
import { Trip, TransportRoute, TripStatus } from "@/types";
import { NewTripDialog } from "./new-trip-dialog";
import { NewRouteDialog } from "./new-route-dialog";
import { TripDetailsModal } from "./trip-details-modal";

export const TripsView: React.FC = () => {
  const { t } = useLanguage();

  // State
  const [trips, setTrips] = useState<Trip[]>(() => tripsService.getTrips());
  const [routes, setRoutes] = useState<TransportRoute[]>(() =>
    tripsService.getRoutes()
  );
  const [activeTab, setActiveTab] = useState<"TRIPS" | "ROUTES">("TRIPS");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"TODAY" | "TOMORROW" | "ALL">(
    "ALL"
  );
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [mobileOnlyFilter, setMobileOnlyFilter] = useState<boolean>(false);

  // Dialogs
  const [isNewTripOpen, setIsNewTripOpen] = useState(false);
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = trip.tripCode.toLowerCase().includes(q);
        const matchesCity =
          trip.departureCity.toLowerCase().includes(q) ||
          trip.arrivalCity.toLowerCase().includes(q);
        const matchesBus = trip.busRegistration.toLowerCase().includes(q);
        const matchesDriver = trip.driverName.toLowerCase().includes(q);
        if (!matchesCode && !matchesCity && !matchesBus && !matchesDriver) {
          return false;
        }
      }

      // Date
      if (dateFilter === "TODAY" && trip.departureDate !== todayStr) {
        return false;
      }
      if (dateFilter === "TOMORROW" && trip.departureDate !== tomorrowStr) {
        return false;
      }

      // Status
      if (statusFilter !== "ALL" && trip.status !== statusFilter) {
        return false;
      }

      // Mobile sync
      if (mobileOnlyFilter && !trip.isOnlineBookingEnabled) {
        return false;
      }

      return true;
    });
  }, [trips, searchQuery, dateFilter, statusFilter, mobileOnlyFilter, todayStr, tomorrowStr]);

  // Handlers
  const handleTripCreated = (newTrip: Trip) => {
    setTrips(tripsService.getTrips());
  };

  const handleRouteCreated = (newRoute: TransportRoute) => {
    setRoutes(tripsService.getRoutes());
  };

  const handleToggleOnline = (tripId: string) => {
    const updated = tripsService.toggleOnlineBooking(tripId);
    setTrips(updated);
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(updated.find((t) => t.id === tripId) || null);
    }
  };

  const handleStatusChange = (tripId: string, status: TripStatus) => {
    const updated = tripsService.updateTripStatus(tripId, status);
    setTrips(updated);
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(updated.find((t) => t.id === tripId) || null);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = tripsService.deleteTrip(tripId);
    setTrips(updated);
  };

  const handleToggleRoute = (routeId: string) => {
    const updated = tripsService.toggleRouteActive(routeId);
    setRoutes(updated);
  };

  // KPIs
  const todayTrips = useMemo(
    () => trips.filter((t) => t.departureDate === todayStr),
    [trips, todayStr]
  );
  const totalSeatsToday = todayTrips.reduce((acc, t) => acc + t.totalSeats, 0);
  const bookedSeatsToday = todayTrips.reduce((acc, t) => acc + t.bookedSeats, 0);
  const averageOccupancy =
    totalSeatsToday > 0 ? Math.round((bookedSeatsToday / totalSeatsToday) * 100) : 0;
  const availableSeatsToday = totalSeatsToday - bookedSeatsToday;
  const onlinePublishedCount = trips.filter((t) => t.isOnlineBookingEnabled).length;

  const renderStatusBadge = (status: TripStatus) => {
    switch (status) {
      case "BOARDING":
        return <Badge variant="warning">{t.modules.trips.status.BOARDING}</Badge>;
      case "IN_TRANSIT":
        return <Badge variant="info">{t.modules.trips.status.IN_TRANSIT}</Badge>;
      case "ARRIVED":
        return <Badge variant="success">{t.modules.trips.status.ARRIVED}</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">{t.modules.trips.status.CANCELLED}</Badge>;
      default:
        return <Badge variant="neutral">{t.modules.trips.status.SCHEDULED}</Badge>;
    }
  };

  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case "VIP":
        return (
          <Badge variant="primary" size="sm">
            {t.modules.trips.badges.vip}
          </Badge>
        );
      case "CLIMATISE":
        return (
          <Badge variant="info" size="sm">
            {t.modules.trips.badges.climatise}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {t.modules.trips.badges.standard}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent">
              <RouteIcon className="h-5 w-5" />
            </div>
            {t.modules.trips.title}
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
            {t.modules.trips.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsNewRouteOpen(true)}
            className="border-border dark:border-slate-800"
          >
            <RouteIcon className="h-4 w-4 mr-1.5" />
            {t.modules.trips.newRoute}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewTripOpen(true)}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {t.modules.trips.newTrip}
          </Button>
        </div>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Départs du jour */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                {t.modules.trips.kpis.todayTrips}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {todayTrips.length}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.trips.kpis.todayTripsDesc.replace('{count}', String(trips.length))}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent">
              <Bus className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 2: Taux de remplissage */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                {t.modules.trips.kpis.occupancyRate}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {averageOccupancy}%
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.trips.kpis.occupancyDesc.replace('{count}', String(bookedSeatsToday))}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 3: Places libres */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                {t.modules.trips.kpis.availableSeats}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {availableSeatsToday}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.trips.kpis.availableDesc}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Tag className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* KPI 4: En vente sur Mobile */}
        <Card className="p-4 bg-surface dark:bg-slate-900 border-border dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                {t.modules.trips.kpis.onlinePublished}
              </p>
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mt-1">
                {onlinePublishedCount}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.trips.kpis.onlineDesc}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Navigation Tabs ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-slate-800">
        <button
          onClick={() => setActiveTab("TRIPS")}
          className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "TRIPS"
              ? "border-primary text-primary dark:border-accent dark:text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Bus className="h-4 w-4" />
          {t.modules.trips.tabs.scheduledTrips} ({trips.length})
        </button>

        <button
          onClick={() => setActiveTab("ROUTES")}
          className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === "ROUTES"
              ? "border-primary text-primary dark:border-accent dark:text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <RouteIcon className="h-4 w-4" />
          {t.modules.trips.tabs.routes} ({routes.length})
        </button>
      </div>

      {/* ─── TAB 1: TRAJETS PROGRAMMÉS ───────────────────────────────────────── */}
      {activeTab === "TRIPS" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-sm">
            {/* Search Input */}
            <div className="w-full lg:w-80">
              <Input
                placeholder={t.modules.trips.filters.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter Pills */}
              <div className="flex items-center rounded-lg border border-border dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800/60">
                <button
                  onClick={() => setDateFilter("ALL")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    dateFilter === "ALL"
                      ? "bg-white dark:bg-slate-900 text-text-primary dark:text-white shadow-xs"
                      : "text-text-secondary dark:text-slate-400"
                  }`}
                >
                  {t.modules.trips.filters.all}
                </button>
                <button
                  onClick={() => setDateFilter("TODAY")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    dateFilter === "TODAY"
                      ? "bg-white dark:bg-slate-900 text-text-primary dark:text-white shadow-xs"
                      : "text-text-secondary dark:text-slate-400"
                  }`}
                >
                  {t.modules.trips.filters.today}
                </button>
                <button
                  onClick={() => setDateFilter("TOMORROW")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    dateFilter === "TOMORROW"
                      ? "bg-white dark:bg-slate-900 text-text-primary dark:text-white shadow-xs"
                      : "text-text-secondary dark:text-slate-400"
                  }`}
                >
                  {t.modules.trips.filters.tomorrow}
                </button>
              </div>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 text-xs text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary"
              >
                <option value="ALL">{t.modules.trips.filters.allStatuses}</option>
                <option value="SCHEDULED">{t.modules.trips.status.SCHEDULED}</option>
                <option value="BOARDING">{t.modules.trips.status.BOARDING}</option>
                <option value="IN_TRANSIT">{t.modules.trips.status.IN_TRANSIT}</option>
                <option value="ARRIVED">{t.modules.trips.status.ARRIVED}</option>
                <option value="CANCELLED">{t.modules.trips.status.CANCELLED}</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileOnlyFilter(!mobileOnlyFilter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                  mobileOnlyFilter
                    ? "bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent border-primary-200 dark:border-teal-800"
                    : "border-border dark:border-slate-800 text-text-secondary dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>{t.modules.trips.filters.mobileOnly}</span>
              </button>
            </div>
          </div>

          {/* Table Card */}
          <Card className="overflow-hidden border-border dark:border-slate-800 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">{t.modules.trips.table.code}</TableHead>
                  <TableHead>{t.modules.trips.table.line}</TableHead>
                  <TableHead>{t.modules.trips.table.departure}</TableHead>
                  <TableHead>{t.modules.trips.table.bus}</TableHead>
                  <TableHead>{t.modules.trips.table.driver}</TableHead>
                  <TableHead>{t.modules.trips.table.occupancy}</TableHead>
                  <TableHead>{t.modules.trips.table.price}</TableHead>
                  <TableHead>{t.modules.trips.table.status}</TableHead>
                  <TableHead className="text-center">{t.modules.trips.table.mobileSync}</TableHead>
                  <TableHead className="text-right">{t.modules.trips.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-text-muted">
                      {t.modules.trips.table.noTripsFound}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => {
                    const occupancyRate = Math.round(
                      (trip.bookedSeats / trip.totalSeats) * 100
                    );
                    return (
                      <TableRow key={trip.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        {/* Code */}
                        <TableCell className="font-mono text-xs font-semibold text-text-primary dark:text-white">
                          {trip.tripCode}
                        </TableCell>

                        {/* Itinerary */}
                        <TableCell>
                          <div className="font-medium text-text-primary dark:text-slate-100 flex items-center gap-1.5 text-xs">
                            <span>{trip.departureCity.split("(")[0].trim()}</span>
                            <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                            <span>{trip.arrivalCity.split("(")[0].trim()}</span>
                          </div>
                          <p className="text-[11px] text-text-muted dark:text-slate-500 truncate max-w-[200px]">
                            {trip.departureCity} ➔ {trip.arrivalCity}
                          </p>
                        </TableCell>

                        {/* Departure Date/Time */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-text-primary dark:text-slate-100">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>{trip.departureTime}</span>
                          </div>
                          <span className="text-[11px] text-text-muted dark:text-slate-400">
                            {trip.departureDate === todayStr ? "Aujourd'hui" : trip.departureDate}
                          </span>
                        </TableCell>

                        {/* Bus & Category */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {renderCategoryBadge(trip.busCategory)}
                            <span className="text-xs font-medium text-text-primary dark:text-slate-200">
                              {trip.busRegistration.split("(")[0].trim()}
                            </span>
                          </div>
                          <span className="text-[11px] text-text-muted dark:text-slate-500">
                            {trip.totalSeats} {t.modules.trips.table.seatsLabel}
                          </span>
                        </TableCell>

                        {/* Driver */}
                        <TableCell>
                          <span className="text-xs text-text-primary dark:text-slate-200 block">
                            {trip.driverName}
                          </span>
                          {trip.driverPhone && (
                            <span className="text-[10px] text-text-muted dark:text-slate-500">
                              {trip.driverPhone}
                            </span>
                          )}
                        </TableCell>

                        {/* Occupancy */}
                        <TableCell>
                          <div className="space-y-1 w-28">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-text-primary dark:text-slate-200">
                                {trip.bookedSeats}/{trip.totalSeats}
                              </span>
                              <span className="text-text-muted text-[10px]">
                                {occupancyRate}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  occupancyRate >= 95
                                    ? "bg-rose-500"
                                    : occupancyRate >= 70
                                    ? "bg-primary"
                                    : "bg-teal-500"
                                }`}
                                style={{ width: `${occupancyRate}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="font-bold text-xs text-text-primary dark:text-slate-100 whitespace-nowrap">
                          {formatCurrency(trip.price)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>{renderStatusBadge(trip.status)}</TableCell>

                        {/* Mobile Toggle Button */}
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleOnline(trip.id)}
                            title={
                              trip.isOnlineBookingEnabled
                                ? t.modules.trips.table.mobileTooltipRemove
                                : t.modules.trips.table.mobileTooltipPublish
                            }
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                              trip.isOnlineBookingEnabled
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <Smartphone className="h-3 w-3" />
                            {trip.isOnlineBookingEnabled ? t.modules.trips.table.online : t.modules.trips.table.counter}
                          </button>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTrip(trip);
                              setIsDetailsOpen(true);
                            }}
                            className="h-8 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1 text-primary" />
                            {t.modules.trips.table.details}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: LIGNES DE TRANSPORT ─────────────────────────────────────── */}
      {activeTab === "ROUTES" && (
        <div className="space-y-4">
          <Card className="overflow-hidden border-border dark:border-slate-800 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">{t.modules.trips.routesTable.code}</TableHead>
                  <TableHead>{t.modules.trips.routesTable.corridor}</TableHead>
                  <TableHead>{t.modules.trips.routesTable.distance}</TableHead>
                  <TableHead>{t.modules.trips.routesTable.duration}</TableHead>
                  <TableHead>{t.modules.trips.routesTable.basePrice}</TableHead>
                  <TableHead>{t.modules.trips.routesTable.status}</TableHead>
                  <TableHead className="text-right">{t.modules.trips.routesTable.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <TableCell className="font-mono text-xs font-bold text-primary dark:text-accent">
                      {route.code}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-text-primary dark:text-slate-100 flex items-center gap-1.5 text-xs">
                        <span>{route.departureCity}</span>
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span>{route.arrivalCity}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-text-secondary dark:text-slate-300">
                      {route.distanceKm} km
                    </TableCell>

                    <TableCell className="text-xs text-text-secondary dark:text-slate-300">
                      {Math.floor(route.estimatedDurationMinutes / 60)}h
                      {route.estimatedDurationMinutes % 60
                        ? `${route.estimatedDurationMinutes % 60}m`
                        : "00m"}
                    </TableCell>

                    <TableCell className="font-bold text-xs text-text-primary dark:text-slate-100">
                      {formatCurrency(route.basePrice)}
                    </TableCell>

                    <TableCell>
                      <button
                        onClick={() => handleToggleRoute(route.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                          route.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {route.isActive ? t.modules.trips.routesTable.active : t.modules.trips.routesTable.suspended}
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsNewTripOpen(true)}
                        className="h-8 text-xs font-medium"
                      >
                        <Plus className="h-3 w-3 mr-1" /> {t.modules.trips.newTrip}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}
      <NewTripDialog
        isOpen={isNewTripOpen}
        onClose={() => setIsNewTripOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <NewRouteDialog
        isOpen={isNewRouteOpen}
        onClose={() => setIsNewRouteOpen(false)}
        onRouteCreated={handleRouteCreated}
      />

      <TripDetailsModal
        trip={selectedTrip}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedTrip(null);
        }}
        onStatusChange={handleStatusChange}
        onToggleOnline={handleToggleOnline}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  );
};
