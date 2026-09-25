import React, { useState } from "react";
import { X, Wrench, Calendar, DollarSign, Gauge, Building2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { Bus, MaintenanceType, BusMaintenanceRecord } from "@/types";
import { fleetService } from "../services/fleet.service";

interface NewMaintenanceDialogProps {
  isOpen: boolean;
  bus: Bus | null;
  onClose: () => void;
  onMaintenanceAdded: (record: BusMaintenanceRecord) => void;
}

export const NewMaintenanceDialog: React.FC<NewMaintenanceDialogProps> = ({
  isOpen,
  bus,
  onClose,
  onMaintenanceAdded,
}) => {
  const { t } = useLanguage();

  const [type, setType] = useState<MaintenanceType>("OIL_CHANGE");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [cost, setCost] = useState<number>(150000);
  const [mileage, setMileage] = useState<number>(bus?.mileageKm ?? 100000);
  const [garageName, setGarageName] = useState("Atelier Central de Maintenance");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !bus) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!garageName.trim()) {
      setError("Veuillez renseigner le nom de l'atelier ou du prestataire.");
      return;
    }
    if (cost < 0) {
      setError("Le coût ne peut pas être négatif.");
      return;
    }
    if (mileage < 0) {
      setError("Le kilométrage doit être positif.");
      return;
    }

    try {
      const record = fleetService.addMaintenanceRecord({
        busId: bus.id,
        busRegistration: bus.registrationNumber,
        date,
        type,
        cost: Number(cost),
        garageName: garageName.trim(),
        mileageAtService: Number(mileage),
        description: description.trim() || t.modules.fleet.maintenanceTypes[type],
        performedBy: "Service Technique",
      });

      onMaintenanceAdded(record);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de l'enregistrement de l'intervention.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary dark:text-slate-100">
                {t.modules.fleet.newMaintenance.title}
              </h2>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                Véhicule <span className="font-semibold text-primary dark:text-accent">{bus.registrationNumber}</span> — {bus.brand} {bus.model}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-red-950/40 border border-danger-200 dark:border-red-800/60 text-danger-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type d'intervention */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
              {t.modules.fleet.newMaintenance.typeLabel}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
              className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="OIL_CHANGE">{t.modules.fleet.maintenanceTypes.OIL_CHANGE}</option>
              <option value="TECHNICAL_INSPECTION">{t.modules.fleet.maintenanceTypes.TECHNICAL_INSPECTION}</option>
              <option value="BRAKES">{t.modules.fleet.maintenanceTypes.BRAKES}</option>
              <option value="TIRES">{t.modules.fleet.maintenanceTypes.TIRES}</option>
              <option value="AIR_CONDITIONING">{t.modules.fleet.maintenanceTypes.AIR_CONDITIONING}</option>
              <option value="BODYWORK">{t.modules.fleet.maintenanceTypes.BODYWORK}</option>
              <option value="GENERAL_REVISION">{t.modules.fleet.maintenanceTypes.GENERAL_REVISION}</option>
            </select>
          </div>

          {/* Date & Kilométrage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newMaintenance.dateLabel}
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newMaintenance.mileageLabel}
              </label>
              <Input
                type="number"
                min="0"
                step="100"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Coût & Atelier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newMaintenance.costLabel}
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newMaintenance.garageLabel}
              </label>
              <Input
                type="text"
                placeholder={t.modules.fleet.newMaintenance.garagePlaceholder}
                value={garageName}
                onChange={(e) => setGarageName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
              {t.modules.fleet.newMaintenance.descLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.modules.fleet.newMaintenance.descPlaceholder}
              className="flex w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-text-primary dark:text-slate-100 placeholder:text-text-muted dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-border dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t.modules.fleet.newMaintenance.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
