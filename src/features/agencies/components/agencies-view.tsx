import React from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export const AgenciesView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-slate-100 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary dark:text-accent" /> {t.modules.agencies.title}
          </h1>
          <p className="text-sm text-text-secondary dark:text-slate-400 mt-1">
            {t.modules.agencies.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" /> {t.modules.agencies.createAgency}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primary dark:text-slate-100">{t.modules.agencies.title}</h3>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {t.modules.agencies.desc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
