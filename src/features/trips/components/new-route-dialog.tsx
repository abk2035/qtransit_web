import React, { useState } from "react";
import { X, Route as RouteIcon, MapPin, Gauge, Clock, Tag, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tripsService, CreateRouteDto } from "../services/trips.service";
import { TransportRoute } from "@/types";

interface NewRouteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: (route: TransportRoute) => void;
}

export const NewRouteDialog: React.FC<NewRouteDialogProps> = ({
  isOpen,
  onClose,
  onRouteCreated,
}) => {
  const [code, setCode] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [distanceKm, setDistanceKm] = useState<number>(250);
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState<number>(180);
  const [basePrice, setBasePrice] = useState<number>(6000);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!departureCity.trim() || !arrivalCity.trim()) {
      setError("Les villes de départ et d'arrivée sont obligatoires.");
      return;
    }
    if (distanceKm <= 0) {
      setError("La distance doit être supérieure à zéro.");
      return;
    }
    if (estimatedDurationMinutes <= 0) {
      setError("La durée estimée doit être supérieure à zéro.");
      return;
    }
    if (basePrice <= 0) {
      setError("Le tarif de base doit être supérieur à zéro.");
      return;
    }

    const generatedCode =
      code.trim() ||
      `${departureCity.slice(0, 3).toUpperCase()}-${arrivalCity.slice(0, 3).toUpperCase()}`;

    const dto: CreateRouteDto = {
      code: generatedCode,
      departureCity: departureCity.trim(),
      arrivalCity: arrivalCity.trim(),
      distanceKm: Number(distanceKm),
      estimatedDurationMinutes: Number(estimatedDurationMinutes),
      basePrice: Number(basePrice),
    };

    try {
      const newRoute = tripsService.createRoute(dto);
      onRouteCreated(newRoute);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de l'enregistrement de la ligne.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent">
              <RouteIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary dark:text-white">
                Ajouter une Ligne de Transport
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                Définissez un corridor interurbain et son tarif de référence
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-sm">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-status-danger-light dark:bg-rose-950/50 border border-status-danger-border dark:border-rose-900 text-status-danger-text dark:text-rose-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Code Ligne */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
              Code Ligne (Ex: ABJ-BKE)
            </label>
            <Input
              type="text"
              placeholder="Laisser vide pour générer automatiquement"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          {/* Villes de Départ et Arrivée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Ville / Gare de Départ *
              </label>
              <Input
                type="text"
                placeholder="Ex: Abidjan (Gare d'Adjamé)"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Ville / Gare d'Arrivée *
              </label>
              <Input
                type="text"
                placeholder="Ex: Bouaké (Gare Centrale)"
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                required
              />
            </div>
          </div>

          {/* Distance & Durée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Distance (km) *
              </label>
              <Input
                type="number"
                min="1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                icon={<Gauge className="h-4 w-4" />}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
                Durée estimée (minutes) *
              </label>
              <Input
                type="number"
                min="10"
                step="15"
                value={estimatedDurationMinutes}
                onChange={(e) => setEstimatedDurationMinutes(Number(e.target.value))}
                icon={<Clock className="h-4 w-4" />}
                required
              />
              <p className="mt-1 text-[11px] text-text-muted dark:text-slate-500">
                Soit ~{Math.floor(estimatedDurationMinutes / 60)}h{estimatedDurationMinutes % 60 ? estimatedDurationMinutes % 60 : "00"} de route
              </p>
            </div>
          </div>

          {/* Tarif de Base */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 mb-1.5">
              Tarif de Référence Standard (FCFA) *
            </label>
            <Input
              type="number"
              min="500"
              step="500"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              icon={<Tag className="h-4 w-4" />}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border dark:border-slate-800">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="md">
              Enregistrer la Ligne
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
