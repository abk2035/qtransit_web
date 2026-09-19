import React, { useState } from "react";
import { X, User, Lock, Building2, ShieldCheck, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"PROFILE" | "PASSWORD">("PROFILE");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await updateProfile({ firstName, lastName, phone });
      setSuccessMessage(t.auth.profileUpdated);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSuccessMessage(t.auth.passwordUpdated);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la modification du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = t.roles[user.role] || user.role;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-dialog border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary dark:text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-text-secondary dark:text-slate-400">
                {user.email}
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

        {/* Status Messages */}
        {successMessage && (
          <div className="mt-4 p-3 text-xs flex items-center gap-2 rounded-btn bg-status-success-light dark:bg-emerald-950/60 text-status-success-text dark:text-emerald-300 border border-status-success-border dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 text-xs rounded-btn bg-status-danger-light dark:bg-rose-950/60 text-status-danger-text dark:text-rose-300 border border-status-danger-border dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border dark:border-slate-800 mt-4">
          <button
            onClick={() => setActiveTab("PROFILE")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "PROFILE"
                ? "border-primary text-primary dark:text-accent dark:border-accent"
                : "border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary"
            }`}
          >
            <User className="h-4 w-4" />
            <span>{t.auth.profileModalTitle}</span>
          </button>
          <button
            onClick={() => setActiveTab("PASSWORD")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "PASSWORD"
                ? "border-primary text-primary dark:text-accent dark:border-accent"
                : "border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>{t.auth.changePasswordTab}</span>
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === "PROFILE" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                  {t.auth.firstNameLabel}
                </label>
                <Input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                  {t.auth.lastNameLabel}
                </label>
                <Input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.auth.phoneLabel}
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            {/* Read-only system metadata */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-btn border border-border/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-text-muted dark:text-slate-400 block">{t.auth.roleLabel}</span>
                <span className="font-semibold text-primary dark:text-accent flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> {roleLabel}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-text-muted dark:text-slate-400 block">{t.auth.agencyLabel}</span>
                <span className="font-semibold text-text-primary dark:text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                  <Building2 className="h-3.5 w-3.5" /> {user.agencyName || "Toutes les agences"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                {t.auth.saveProfile}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === "PASSWORD" && (
          <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.auth.currentPasswordLabel}
              </label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.auth.newPasswordLabel}
              </label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
                {t.auth.confirmNewPasswordLabel}
              </label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
                {t.auth.resetPasswordButton}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
