import React from "react";
import { Settings, ShieldCheck, Globe, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export const SettingsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-slate-100 flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary dark:text-accent" /> {t.modules.settings.title}
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
          {t.modules.settings.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-slate-100 text-sm">{t.modules.settings.cardGeneral}</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              {t.modules.settings.cardGeneralDesc}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-slate-100 text-sm">{t.modules.settings.cardRoles}</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              {t.modules.settings.cardRolesDesc}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card-hover transition-shadow">
          <CardContent className="p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-slate-100 text-sm">{t.modules.settings.cardTickets}</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              {t.modules.settings.cardTicketsDesc}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
