import React, { useState } from "react";
import { Bus, ShieldCheck, Zap, Sun, Moon, Languages, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isDark, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background dark:bg-slate-950 font-sans transition-colors duration-200">
      {/* Left Column: Visual Brand Identity & Metrics */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-sidebar text-white flex-col justify-between p-12 overflow-hidden border-r border-sidebar-border">
        {/* Decorative Grid & Glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14B8A6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-btn bg-primary text-white shadow-lg">
            <Bus className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              QTransit <span className="text-[11px] font-semibold bg-accent/25 text-accent px-2 py-0.5 rounded">ERP SaaS</span>
            </span>
            <span className="text-xs text-slate-400">{t.auth.layout.platformSubtitle}</span>
          </div>
        </div>

        {/* Middle: Value Prop & Key Metrics */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-accent text-xs font-medium">
              <Zap className="h-3.5 w-3.5" /> {t.auth.layout.versionBadge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t.auth.layout.heroTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.auth.layout.heroSubtitle}
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-2xl font-bold text-white">99.9%</span>
              <p className="text-xs text-slate-400 mt-0.5">{t.auth.layout.statUptime}</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-accent">100%</span>
              <p className="text-xs text-slate-400 mt-0.5">{t.auth.layout.statQr}</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Multi</span>
              <p className="text-xs text-slate-400 mt-0.5">{t.auth.layout.statAgencies}</p>
            </div>
          </div>
        </div>

        {/* Bottom: Security Notice */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-400" />
            <span>{t.auth.layout.securityBadge}</span>
          </div>
          <span>© {new Date().getFullYear()} QTransit</span>
        </div>
      </div>

      {/* Right Column: Auth Container with Top Controls */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Toolbar (Theme & Language switches) */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
          {/* Mobile Logo Display */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-primary text-white">
              <Bus className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-text-primary dark:text-white">QTransit</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 h-9 px-3 rounded-btn border border-border dark:border-slate-700 bg-surface dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-semibold text-text-primary dark:text-slate-200 transition-colors shadow-sm"
                title={t.topbar.language}
              >
                <Languages className="h-4 w-4 text-primary dark:text-accent" />
                <span>{locale === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}</span>
                <ChevronDown className="h-3 w-3 text-text-secondary dark:text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-card border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-dropdown py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("fr");
                      setIsLangMenuOpen(false);
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
                    type="button"
                    onClick={() => {
                      setLocale("en");
                      setIsLangMenuOpen(false);
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

            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-9 w-9 text-text-secondary dark:text-slate-300 hover:text-text-primary dark:hover:text-white"
              title={isDark ? t.topbar.theme.light : t.topbar.theme.dark}
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="my-auto w-full max-w-md mx-auto py-8">
          {children}
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-xs text-text-muted dark:text-slate-500">
          {t.auth.layout.needHelp}{" "}
          <a href="#" className="font-semibold text-primary dark:text-accent hover:underline">
            {t.auth.layout.supportLink}
          </a>
        </div>
      </div>
    </div>
  );
};
