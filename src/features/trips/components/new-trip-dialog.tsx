import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Bus, User, MapPin, Tag, Smartphone, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  tripsService,
  AVAILABLE_BUSES,
  AVAILABLE_DRIVERS,
  CreateTripDto,
  BusOption,
} from "../services/trips.service";
import { Trip, TransportRoute } from "@/types";

interface NewTripDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (trip: Trip) => void;
}

export const NewTripDialog: React.FC<NewTripDialogProps> = ({
  isOpen,
  onClose,
  onTripCreated,
}) => {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [busOptions, setBusOptions] = useState<BusOption[]>(() => tripsService.getBusOptions());
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [departureTime, setDepartureTime] = useState("08:00");
  const [selectedBusId, setSelectedBusId] = useState(() => {
    const initial = tripsService.getBusOptions();
    return initial[0]?.id || AVAILABLE_BUSES[0].id;
  });
  const [selectedDriverId, setSelectedDriverId] = useState(
    AVAILABLE_DRIVERS[0].id
  );
  const [price, setPrice] = useState<number>(10000);
  const [isOnlineBookingEnabled, setIsOnlineBookingEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const activeRoutes = tripsService.getRoutes().filter((r) => r.isActive);
      setRoutes(activeRoutes);
      if (activeRoutes.length > 0) {
        setSelectedRouteId(activeRoutes[0].id);
        setPrice(activeRoutes[0].basePrice);
      }
      const currentBuses = tripsService.getBusOptions();
      setBusOptions(currentBuses);
      if (currentBuses.length > 0 && !currentBuses.some(b => b.id === selectedBusId)) {
        setSelectedBusId(currentBuses[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRouteChange = (routeId: string) => {
    setSelectedRouteId(routeId);
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      setPrice(route.basePrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRouteId) {
      setError("Veuillez sélectionner une ligne de transport.");
      return;
    }
    if (!departureDate) {
      setError("Veuillez renseigner la date de départ.");
      return;
    }
    if (!departureTime) {
      setError("Veuillez renseigner l'heure de départ.");
      return;
    }
    if (!selectedBusId) {
      setError("Veuillez sélectionner un bus.");
      return;
    }
    if (price <= 0) {
      setError("Le tarif du billet doit être supérieur à zéro.");
      return;
    }

    const driver = AVAILABLE_DRIVERS.find((d) => d.id === selectedDriverId);

    const dto: CreateTripDto = {
      routeId: selectedRouteId,
      departureDate,
      departureTime,
      busId: selectedBusId,
      driverName: driver ? driver.name : "Non assigné",
      driverPhone: driver?.phone,
      price: Number(price),
      isOnlineBookingEnabled,
    };

    try {
      const newTrip = tripsService.createTrip(dto);
      onTripCreated(newTrip);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de la création du trajet.");
    }
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);
  const selectedBus = busOptions.find((b) => b.id === selectedBusId) || AVAILABLE_BUSES.find((b) => b.id === selectedBusId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary dark:text-white">
                Planifier un Nouveau Trajet
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                Créez un départ et synchronisez-le avec la vente guichet et mobile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-4 text-sm flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-status-danger-light dark:bg-rose-950/50 border border-status-danger-border dark:border-rose-900 text-status-danger-text dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Ligne / Itinéraire */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
              Ligne de transport (Itinéraire) *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-text-muted dark:text-slate-400 pointer-events-none" />
              <select
                value={selectedRouteId}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 pl-10 pr-3.5 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.departureCity} ➔ {r.arrivalCity} ({r.distanceKm} km ~ {Math.floor(r.estimatedDurationMinutes / 60)}h{r.estimatedDurationMinutes % 60 ? r.estimatedDurationMinutes % 60 : ""})
                  </option>
                ))}
              </select>
            </div>
            {selectedRoute && (
              <p className="mt-1 text-[11px] text-text-muted dark:text-slate-500">
                Tarif de base recommandé : {formatCurrency(selectedRoute.basePrice)} • Durée estimée : {Math.floor(selectedRoute.estimatedDurationMinutes / 60)}h{selectedRoute.estimatedDurationMinutes % 60 ? selectedRoute.estimatedDurationMinutes % 60 : "00"}
              </p>
            )}
          </div>

          {/* Date & Heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Date de départ *
              </label>
              <Input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                icon={<Calendar className="h-4 w-4" />}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Heure de départ *
              </label>
              <Input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                icon={<Clock className="h-4 w-4" />}
                required
              />
            </div>
          </div>

          {/* Bus & Chauffeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Bus affecté *
              </label>
              <div className="relative">
                <Bus className="absolute left-3.5 top-3 h-4 w-4 text-text-muted dark:text-slate-400 pointer-events-none" />
                <select
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 pl-10 pr-3.5 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {busOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              {selectedBus && (
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant={selectedBus.category === "VIP" ? "primary" : selectedBus.category === "CLIMATISE" ? "info" : "neutral"} size="sm">
                    {selectedBus.category}
                  </Badge>
                  <span className="text-[11px] text-text-muted dark:text-slate-500">
                    Capacité : {selectedBus.totalSeats} places
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Chauffeur principal
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-text-muted dark:text-slate-400 pointer-events-none" />
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 pl-10 pr-3.5 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {AVAILABLE_DRIVERS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tarif du Billet */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
              Tarif du billet (FCFA) *
            </label>
            <Input
              type="number"
              min="500"
              step="500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              icon={<Tag className="h-4 w-4" />}
              required
            />
          </div>

          {/* Switch: Réservation Mobile (Flutter Sync) */}
          <div className="rounded-xl border border-primary-200 dark:border-teal-900/60 bg-primary-50/50 dark:bg-teal-950/20 p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-teal-900/60 text-primary dark:text-accent shrink-0 mt-0.5">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary dark:text-slate-100">
                  Ouvrir à la réservation sur l'Application Mobile
                </p>
                <p className="text-[11px] text-text-secondary dark:text-slate-400 mt-0.5">
                  Rend ce voyage visible immédiatement pour les passagers sur l'application mobile Flutter.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOnlineBookingEnabled(!isOnlineBookingEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOnlineBookingEnabled ? "bg-primary dark:bg-teal-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isOnlineBookingEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border dark:border-slate-800 shrink-0">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="md">
              Créer & Planifier le Trajet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
