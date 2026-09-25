import React from "react";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Bus,
  User,
  Phone,
  Tag,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Trip, TripStatus } from "@/types";

interface TripDetailsModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (tripId: string, status: TripStatus) => void;
  onToggleOnline: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  isOpen,
  onClose,
  onStatusChange,
  onToggleOnline,
  onDeleteTrip,
}) => {
  if (!isOpen || !trip) return null;

  const occupancyRate = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
  const availableSeats = trip.totalSeats - trip.bookedSeats;
  const totalRevenue = trip.bookedSeats * trip.price;

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case "BOARDING":
        return <Badge variant="warning">En Embarquement</Badge>;
      case "IN_TRANSIT":
        return <Badge variant="info">En Route</Badge>;
      case "ARRIVED":
        return <Badge variant="success">Arrivé</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Annulé</Badge>;
      default:
        return <Badge variant="neutral">Programmé</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "VIP":
        return <Badge variant="primary">VIP</Badge>;
      case "CLIMATISE":
        return <Badge variant="info">Climatisé</Badge>;
      default:
        return <Badge variant="neutral">Standard</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-text-primary dark:text-white">
                {trip.tripCode}
              </span>
              {getStatusBadge(trip.status)}
              {getCategoryBadge(trip.busCategory)}
            </div>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              Fiche détaillée du départ et gestion opérationnelle
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
          {/* Itinerary Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                  Départ
                </span>
                <p className="text-sm font-bold text-text-primary dark:text-white">
                  {trip.departureCity}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-slate-300 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{trip.departureTime}</span>
                  <span className="text-text-muted">• {trip.departureDate}</span>
                </div>
              </div>

              <div className="text-center px-3">
                <span className="text-xs font-semibold text-primary dark:text-accent">➔</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                  Arrivée Estimée
                </span>
                <p className="text-sm font-bold text-text-primary dark:text-white">
                  {trip.arrivalCity}
                </p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-text-secondary dark:text-slate-300 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{trip.estimatedArrivalTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Occupancy Card */}
          <div className="p-4 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-text-primary dark:text-slate-200">
                  Remplissage des Sièges
                </span>
              </div>
              <span className="text-xs font-bold text-text-primary dark:text-white">
                {trip.bookedSeats} / {trip.totalSeats} places ({occupancyRate}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  occupancyRate >= 95
                    ? "bg-rose-500"
                    : occupancyRate >= 75
                    ? "bg-primary"
                    : "bg-teal-500"
                }`}
                style={{ width: `${occupancyRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-text-muted dark:text-slate-400">
                Places encore disponibles : <strong className="text-text-primary dark:text-slate-200">{availableSeats}</strong>
              </span>
              <span className="text-text-muted dark:text-slate-400">
                Recette actuelle : <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRevenue)}</strong>
              </span>
            </div>
          </div>

          {/* Bus & Driver Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
              <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 text-xs mb-1">
                <Bus className="h-4 w-4 text-primary" />
                <span>Véhicule</span>
              </div>
              <p className="text-sm font-semibold text-text-primary dark:text-white">
                {trip.busRegistration}
              </p>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                Tarif : <strong className="text-primary font-bold">{formatCurrency(trip.price)}</strong> / place
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900">
              <div className="flex items-center gap-2 text-text-muted dark:text-slate-400 text-xs mb-1">
                <User className="h-4 w-4 text-primary" />
                <span>Chauffeur</span>
              </div>
              <p className="text-sm font-semibold text-text-primary dark:text-white">
                {trip.driverName}
              </p>
              {trip.driverPhone && (
                <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {trip.driverPhone}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Sync Toggle */}
          <div className="rounded-xl border border-border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-teal-900/60 text-primary dark:text-accent">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary dark:text-white">
                  Visibilité Réservation Mobile
                </p>
                <p className="text-[11px] text-text-secondary dark:text-slate-400">
                  {trip.isOnlineBookingEnabled
                    ? "Actif — Les passagers peuvent réserver depuis l'app Flutter"
                    : "Inactif — Trajet réservable uniquement au guichet physique"}
                </p>
              </div>
            </div>

            <button
              onClick={() => onToggleOnline(trip.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                trip.isOnlineBookingEnabled
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {trip.isOnlineBookingEnabled ? "Activé (En ligne)" : "Désactivé (Guichet)"}
            </button>
          </div>

          {/* Quick Status Change */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-2">
              Changer le statut du départ :
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onStatusChange(trip.id, "SCHEDULED")}
                className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  trip.status === "SCHEDULED"
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    : "border-border dark:border-slate-800 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Programmé
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(trip.id, "BOARDING")}
                className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  trip.status === "BOARDING"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "border-border dark:border-slate-800 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Embarquement
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(trip.id, "IN_TRANSIT")}
                className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  trip.status === "IN_TRANSIT"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-border dark:border-slate-800 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                En Transit
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(trip.id, "ARRIVED")}
                className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  trip.status === "ARRIVED"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-border dark:border-slate-800 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Arrivé
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(trip.id, "CANCELLED")}
                className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                  trip.status === "CANCELLED"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-border dark:border-slate-800 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-slate-800 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
                onDeleteTrip(trip.id);
                onClose();
              }
            }}
            className="text-status-danger hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Supprimer ce voyage
          </Button>

          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
