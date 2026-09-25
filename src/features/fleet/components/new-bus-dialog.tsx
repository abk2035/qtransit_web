import React, { useState } from "react";
import { X, Bus as BusIcon, Shield, MapPin, Gauge, Calendar, Sparkles, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { Bus, BusAmenity, SeatLayoutType } from "@/types";
import { fleetService } from "../services/fleet.service";

interface NewBusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBusCreated: (bus: Bus) => void;
}

export const NewBusDialog: React.FC<NewBusDialogProps> = ({
  isOpen,
  onClose,
  onBusCreated,
}) => {
  const { t } = useLanguage();
  const agencies = fleetService.getAvailableAgencies();

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [brand, setBrand] = useState("Scania");
  const [model, setModel] = useState("Marcopolo Paradiso G7");
  const [category, setCategory] = useState<"VIP" | "CLIMATISE" | "STANDARD">("VIP");
  const [totalSeats, setTotalSeats] = useState<number>(50);
  const [seatLayoutType, setSeatLayoutType] = useState<SeatLayoutType>("2x1");
  const [agencyId, setAgencyId] = useState(agencies[0]?.id || "AG-001");
  const [mileageKm, setMileageKm] = useState<number>(10000);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [nextInspectionDate, setNextInspectionDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split("T")[0];
  });
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  });
  const [assignedDriverName, setAssignedDriverName] = useState("");
  const [amenities, setAmenities] = useState<BusAmenity[]>([
    "wifi",
    "airConditioning",
    "usbOutlets",
    "recliningSeats",
  ]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: BusAmenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleCategoryChange = (cat: "VIP" | "CLIMATISE" | "STANDARD") => {
    setCategory(cat);
    if (cat === "VIP") {
      setSeatLayoutType("2x1");
      setTotalSeats(50);
    } else {
      setSeatLayoutType("2x2");
      setTotalSeats(cat === "CLIMATISE" ? 48 : 55);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const plate = registrationNumber.trim().toUpperCase();
    if (!plate) {
      setError("Veuillez renseigner le numéro d'immatriculation.");
      return;
    }

    const selectedAgency = agencies.find((a) => a.id === agencyId);

    try {
      const newBus = fleetService.createBus({
        registrationNumber: plate,
        brand: brand.trim(),
        model: model.trim(),
        category,
        totalSeats: Number(totalSeats),
        status: "AVAILABLE",
        currentAgencyId: agencyId,
        currentAgencyName: selectedAgency?.name ?? "Gare Principale",
        mileageKm: Number(mileageKm),
        year: Number(year),
        nextInspectionDate,
        insuranceExpiryDate,
        amenities,
        seatLayoutType,
        assignedDriverName: assignedDriverName.trim() || undefined,
        lastMaintenanceDate: new Date().toISOString().split("T")[0],
      });

      onBusCreated(newBus);
      onClose();
    } catch {
      setError("Une erreur est survenue lors de l'enregistrement du véhicule.");
    }
  };

  const amenityOptions: { id: BusAmenity; label: string }[] = [
    { id: "wifi", label: t.modules.fleet.amenities.wifi },
    { id: "airConditioning", label: t.modules.fleet.amenities.airConditioning },
    { id: "usbOutlets", label: t.modules.fleet.amenities.usbOutlets },
    { id: "tv", label: t.modules.fleet.amenities.tv },
    { id: "toilets", label: t.modules.fleet.amenities.toilets },
    { id: "recliningSeats", label: t.modules.fleet.amenities.recliningSeats },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-teal-950/60 text-primary dark:text-accent">
              <BusIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary dark:text-slate-100">
                {t.modules.fleet.newBus.title}
              </h2>
              <p className="text-xs text-text-secondary dark:text-slate-400 mt-0.5">
                {t.modules.fleet.newBus.subtitle}
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
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 pr-1">
          {error && (
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-red-950/40 border border-danger-200 dark:border-red-800/60 text-danger-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Immatriculation, Marque & Modèle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newBus.registrationLabel}
              </label>
              <Input
                type="text"
                placeholder={t.modules.fleet.newBus.registrationPlaceholder}
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="font-mono font-bold uppercase tracking-wider"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.brandLabel}
              </label>
              <Input
                type="text"
                placeholder={t.modules.fleet.newBus.brandPlaceholder}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.modelLabel}
              </label>
              <Input
                type="text"
                placeholder={t.modules.fleet.newBus.modelPlaceholder}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Catégorie & Disposition des sièges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) =>
                  handleCategoryChange(e.target.value as "VIP" | "CLIMATISE" | "STANDARD")
                }
                className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="VIP">{t.modules.fleet.categories.VIP}</option>
                <option value="CLIMATISE">{t.modules.fleet.categories.CLIMATISE}</option>
                <option value="STANDARD">{t.modules.fleet.categories.STANDARD}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.layoutLabel}
              </label>
              <select
                value={seatLayoutType}
                onChange={(e) => setSeatLayoutType(e.target.value as SeatLayoutType)}
                className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="2x1">{t.modules.fleet.newBus.layoutVIP}</option>
                <option value="2x2">{t.modules.fleet.newBus.layoutStandard}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.seatsLabel}
              </label>
              <Input
                type="number"
                min="10"
                max="80"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Agence d'affectation & Chauffeur titulaire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newBus.agencyLabel}
              </label>
              <select
                value={agencyId}
                onChange={(e) => setAgencyId(e.target.value)}
                className="flex h-10 w-full rounded-input border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-3 py-2 text-sm text-text-primary dark:text-slate-100 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              >
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.details.driverAssigned}
              </label>
              <Input
                type="text"
                placeholder="Ex: Kouamé Jean-Baptiste (Optionnel)"
                value={assignedDriverName}
                onChange={(e) => setAssignedDriverName(e.target.value)}
              />
            </div>
          </div>

          {/* Kilométrage, Année & Dates de visites */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newBus.mileageLabel}
              </label>
              <Input
                type="number"
                min="0"
                step="500"
                value={mileageKm}
                onChange={(e) => setMileageKm(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.modules.fleet.newBus.yearLabel}
              </label>
              <Input
                type="number"
                min="2010"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-text-muted dark:text-slate-400" />
                {t.modules.fleet.newBus.inspectionLabel}
              </label>
              <Input
                type="date"
                value={nextInspectionDate}
                onChange={(e) => setNextInspectionDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Équipements inclus */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary dark:text-accent" />
              {t.modules.fleet.newBus.amenitiesLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {amenityOptions.map((opt) => {
                const isSelected = amenities.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleAmenity(opt.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary-50/70 dark:bg-teal-950/40 text-primary dark:text-accent font-semibold"
                        : "border-border dark:border-slate-800 bg-surface dark:bg-slate-900 text-text-secondary dark:text-slate-400 hover:border-text-muted"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-border dark:border-slate-700 bg-surface dark:bg-slate-800"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-border dark:border-slate-800 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md">
              {t.modules.fleet.newBus.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
