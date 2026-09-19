import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"EMAIL" | "OTP_NEW_PASSWORD" | "SUCCESS">("EMAIL");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { sendPasswordResetCode, confirmPasswordReset } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetCode(email);
      setStep("OTP_NEW_PASSWORD");
    } catch (err) {
      setError(t.auth.codeSendError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (newPassword.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(email, otpCode, newPassword);
      setStep("SUCCESS");
    } catch (err) {
      setError(t.auth.invalidCodeError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to login */}
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t.auth.backToLogin}</span>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary dark:text-white">
          {t.auth.forgotPasswordTitle}
        </h1>
        <p className="text-sm text-text-secondary dark:text-slate-400">
          {t.auth.forgotPasswordSubtitle}
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-btn bg-status-danger-light dark:bg-rose-950/60 text-status-danger-text dark:text-rose-300 border border-status-danger-border dark:border-rose-900">
          {error}
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === "EMAIL" && (
        <form onSubmit={handleSendCode} className="space-y-4">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full shadow-md mt-2"
          >
            <span>{isLoading ? t.auth.sendingCode : t.auth.sendCodeButton}</span>
            {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </form>
      )}

      {/* STEP 2: Enter OTP & New Password */}
      {step === "OTP_NEW_PASSWORD" && (
        <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
          <div className="p-3 bg-primary-50 dark:bg-teal-950/50 rounded-btn text-xs text-primary-900 dark:text-teal-300 border border-primary-200 dark:border-teal-800">
            {t.auth.codeSentDesc} <strong>{email}</strong>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary dark:text-slate-200">
              {t.auth.otpLabel}
            </label>
            <Input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Ex: 849201"
              icon={<KeyRound className="h-4 w-4" />}
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full shadow-md mt-2"
          >
            <span>{t.auth.resetPasswordButton}</span>
          </Button>
        </form>
      )}

      {/* STEP 3: Success Confirmation */}
      {step === "SUCCESS" && (
        <div className="space-y-6 text-center animate-in zoom-in-95">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-status-success-light dark:bg-emerald-950/60 text-status-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-text-primary dark:text-white">{t.auth.resetSuccessTitle}</h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              {t.auth.resetSuccess}
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full"
          >
            {t.auth.signInButton}
          </Button>
        </div>
      )}
    </div>
  );
};
