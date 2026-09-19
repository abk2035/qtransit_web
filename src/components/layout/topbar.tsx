import React, { useState } from "react";
import {
  Search,
  Bell,
  Building2,
  Calendar,
  Plus,
  ChevronDown,
  Sun,
  Moon,
  Languages,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { useLanguage, Locale } from "@/context/language-context";
import { useAuth, DEMO_USERS } from "@/context/auth-context";
import { UserProfileModal } from "@/features/auth/components/user-profile-modal";

interface TopbarProps {
  isCollapsed: boolean;
}

const mockAgencies = [
  { id: "ag-1", name: "Gare Centrale — Abidjan", city: "Abidjan" },
  { id: "ag-2", name: "Gare Nord — Bouaké", city: "Bouaké" },
  { id: "ag-3", name: "Gare Ouest — San-Pédro", city: "San-Pédro" },
  { id: "ag-4", name: "Gare Régionale — Yamoussoukro", city: "Yamoussoukro" },
];

export const Topbar: React.FC<TopbarProps> = ({ isCollapsed }) => {
  const [selectedAgency, setSelectedAgency] = useState(mockAgencies[0]);
  const [isAgencyDropdownOpen, setIsAgencyDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { isDark, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { user, logout, loginAsDemo } = useAuth();

  const todayFormatted = formatDate(new Date(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "QT";
  const roleLabel = user ? t.roles[user.role] || user.role : "";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-18 w-full items-center justify-between border-b border-border dark:border-slate-800 bg-surface dark:bg-slate-900 px-6 shadow-sm transition-colors duration-200">
        {/* Left: Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Input
            type="search"
            placeholder={t.topbar.searchPlaceholder}
            icon={<Search className="h-4 w-4" />}
            className="h-10 bg-slate-50/70 dark:bg-slate-800/50 border-border dark:border-slate-700 focus-visible:bg-surface dark:focus-visible:bg-slate-900 text-sm"
          />
        </div>

        {/* Right: Actions, Agency Selector, Theme & Lang, Date, Notifs, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Date Indicator */}
          <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-text-secondary dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-btn border border-border/80 dark:border-slate-700">
            <Calendar className="h-3.5 w-3.5 text-primary dark:text-accent" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          {/* Agency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAgencyDropdownOpen(!isAgencyDropdownOpen);
                setIsLangDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-2 h-10 px-3 rounded-btn border border-border dark:border-slate-700 bg-surface dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-text-primary dark:text-slate-200 transition-colors"
            >
              <Building2 className="h-4 w-4 text-primary dark:text-accent" />
              <span className="hidden sm:inline-block max-w-[150px] truncate">{selectedAgency.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary dark:text-slate-400" />
            </button>

            {isAgencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-card border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-dropdown py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                  {t.topbar.switchAgency}
                </div>
                {mockAgencies.map((agency) => (
                  <button
                    key={agency.id}
                    onClick={() => {
                      setSelectedAgency(agency);
                      setIsAgencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      agency.id === selectedAgency.id
                        ? "bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent font-semibold"
                        : "text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{agency.name}</span>
                    {agency.id === selectedAgency.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsAgencyDropdownOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 h-10 px-2.5 rounded-btn border border-border dark:border-slate-700 bg-surface dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-text-primary dark:text-slate-200 transition-colors"
              title={t.topbar.language}
            >
              <Languages className="h-4 w-4 text-text-secondary dark:text-slate-400" />
              <span className="uppercase">{locale}</span>
              <ChevronDown className="h-3 w-3 text-text-secondary dark:text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-card border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-dropdown py-1.5 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setLocale("fr");
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    locale === "fr"
                      ? "bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent font-semibold"
                      : "text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>🇫🇷 Français</span>
                  {locale === "fr" && <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-accent" />}
                </button>
                <button
                  onClick={() => {
                    setLocale("en");
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    locale === "en"
                      ? "bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent font-semibold"
                      : "text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {locale === "en" && <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-accent" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white"
            title={isDark ? t.topbar.theme.light : t.topbar.theme.dark}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </Button>

          {/* Notifications Button */}
          <div className="relative">
            <Button variant="outline" size="icon" className="relative h-10 w-10 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </Button>
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsAgencyDropdownOpen(false);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 h-10 pl-2 pr-2.5 rounded-btn border border-border dark:border-slate-700 bg-surface dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-700 text-white text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-text-secondary dark:text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-card border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-border dark:border-slate-800">
                    <p className="text-xs font-bold text-text-primary dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-text-muted dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-primary dark:text-accent bg-primary-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded">
                      {roleLabel}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-text-secondary" />
                      <span>{t.nav.profile}</span>
                    </button>
                  </div>

                  {/* Switch Demo Role Menu Item */}
                  <div className="border-t border-border dark:border-slate-800 pt-1 pb-1">
                    <div className="px-3 py-1 text-[10px] font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider">
                      Basculer rôle démo
                    </div>
                    <button
                      onClick={() => {
                        loginAsDemo("admin");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      👑 {t.auth.demoAdmin}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemo("manager");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      🏢 {t.auth.demoManager}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemo("cashier");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      🎫 {t.auth.demoCashier}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemo("controller");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      🔍 {t.auth.demoController}
                    </button>
                  </div>

                  <div className="border-t border-border dark:border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 text-status-danger hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary CTA (Vente Rapide) */}
          <Button variant="primary" size="md" className="hidden sm:flex shadow-sm">
            <Plus className="h-4 w-4" />
            <span>{t.topbar.newSale}</span>
          </Button>
        </div>
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
