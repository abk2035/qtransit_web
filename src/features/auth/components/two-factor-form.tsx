import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export const TwoFactorForm: React.FC = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { verifyTwoFactor } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const isValid = await verifyTwoFactor(code);
      if (isValid) {
        navigate("/", { replace: true });
      } else {
        setError(t.auth.twoFactorInvalidCode);
      }
    } catch (err) {
      setError(t.auth.twoFactorGeneralError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t.auth.backToLogin}</span>
      </Link>

      <div className="space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary-50 dark:bg-teal-950/60 text-primary dark:text-accent mb-2">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-white">
          {t.auth.twoFactorTitle}
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-400">
          {t.auth.twoFactorSubtitle}
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-btn bg-status-danger-light dark:bg-rose-950/60 text-status-danger-text dark:text-rose-300 border border-status-danger-border dark:border-rose-900">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
            {t.auth.otpLabel}
          </label>
          <Input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center text-xl font-mono tracking-widest h-12"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full shadow-md mt-2"
        >
          <span>{isLoading ? t.auth.verifying : t.auth.verifyButton}</span>
          {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>
    </div>
  );
};
