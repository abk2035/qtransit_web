import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, DEMO_USERS } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { ApiError } from "@/lib/api-client";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("manager@qtransit.com");
  const [password, setPassword] = useState("manager123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { login, loginAsDemo, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t.auth.invalidCredentials);
      }
    }
  };

  const handleDemoLogin = async (roleKey: keyof typeof DEMO_USERS) => {
    setError(null);
    try {
      await loginAsDemo(roleKey);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(t.auth.invalidCredentials);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-white">
          {t.auth.loginTitle}
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-400">
          {t.auth.loginSubtitle}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-btn bg-status-danger-light dark:bg-rose-950/60 text-status-danger-text dark:text-rose-300 border border-status-danger-border dark:border-rose-900 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
            {t.auth.emailLabel}
          </label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPlaceholder}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
              {t.auth.passwordLabel}
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary dark:text-accent hover:underline"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.auth.passwordPlaceholder}
            icon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary dark:hover:text-slate-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
          />
          <label htmlFor="remember-me" className="ml-2 text-xs text-text-secondary dark:text-slate-400 select-none">
            {t.auth.rememberMe}
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full shadow-md mt-2"
        >
          <span>{isLoading ? t.auth.signingIn : t.auth.signInButton}</span>
          {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      {/* Demo Accounts Section (Instant 1-Click test) */}
      <div className="pt-5 border-t border-border dark:border-slate-800">
        <p className="text-xs font-semibold text-text-muted dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary dark:text-accent" />
          {t.auth.demoAccountsTitle}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("admin")}
            className="text-xs justify-start px-2.5 h-9"
          >
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-1.5" />
            <span className="truncate">{t.auth.demoAdmin}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("manager")}
            className="text-xs justify-start px-2.5 h-9"
          >
            <span className="h-2 w-2 rounded-full bg-teal-500 mr-1.5" />
            <span className="truncate">{t.auth.demoManager}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("cashier")}
            className="text-xs justify-start px-2.5 h-9"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5" />
            <span className="truncate">{t.auth.demoCashier}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("controller")}
            className="text-xs justify-start px-2.5 h-9"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />
            <span className="truncate">{t.auth.demoController}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
