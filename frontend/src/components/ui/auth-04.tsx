"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Cpu, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface LoginFormProps {
  brandName?: string;
  brandTagline?: string;
  onGoogleLogin?: () => void;
  onLogin?: (email: string, password: string, remember: boolean) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  copyrightYear?: number;
  footerLinks?: { label: string; href: string }[];
}

const BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "testing.com",
  "abc.com",
  "xyz.com",
  "asdf.com",
  "qwerty.com",
  "qwer.com",
  "fake.com",
  "fakemail.com",
  "invalid.com",
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "gmil.com",
  "gmal.com",
  "gmial.com",
  "gamil.com",
  "gmail.co",
  "gmail.con",
  "gmail.org",
  "gmail.net",
  "yaho.com",
  "yahooo.com",
  "yahoo.co",
  "outlok.com",
  "hotmal.com",
  "iclod.com",
]);

const BLOCKED_LOCAL_PARTS = new Set([
  "test",
  "testing",
  "abc",
  "abcd",
  "asdf",
  "qwerty",
  "qwer",
  "user",
  "admin",
  "fake",
  "demo",
  "example",
  "sample",
  "none",
  "null",
  "undefined",
  "xyz",
  "aaa",
  "bbb",
  "ccc",
  "123",
  "1234",
  "12345",
  "123456",
]);

const StrictEmailRegex =
  /^[a-zA-Z0-9]+([._+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,10}$/;

export function isValidEmailClient(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  if (!value || !StrictEmailRegex.test(value)) return false;

  const [localPart, domainPart] = value.split("@");
  if (!localPart || !domainPart) return false;

  if (
    localPart.length < 3 ||
    !/[a-zA-Z]/.test(localPart) ||
    BLOCKED_LOCAL_PARTS.has(localPart)
  ) {
    return false;
  }

  if (BLOCKED_DOMAINS.has(domainPart)) return false;

  const domainLabels = domainPart.split(".");
  const domainName = domainLabels[0];
  const tld = domainLabels[domainLabels.length - 1];

  if (
    domainName.length < 2 ||
    /^\d+$/.test(domainName) ||
    tld.length < 2 ||
    ["con", "cmo", "comm", "orr", "nett"].includes(tld)
  ) {
    return false;
  }

  return true;
}

export default function LoginPage({
  brandName = "HackForge AI",
  brandTagline = "Autonomous Multi-Agent Hackathon Blueprinting & Architecture Engine",
  onGoogleLogin,
  onLogin,
  onForgotPassword,
  onCreateAccount,
  copyrightYear = 2026,
  footerLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Support", href: "#" },
  ],
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError && isValidEmailClient(val)) {
      setEmailError(null);
    }
  };

  const verifyEmailFull = async (candidateEmail: string): Promise<boolean> => {
    if (!isValidEmailClient(candidateEmail)) {
      setEmailError("enter valid mail id");
      return false;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: candidateEmail.trim() }),
      });
      const data = await res.json();
      if (!data.valid) {
        setEmailError(data.message || "enter valid mail id");
        return false;
      }
      setEmailError(null);
      return true;
    } catch {
      // Fallback to strict client check if network call fails
      const ok = isValidEmailClient(candidateEmail);
      if (!ok) setEmailError("enter valid mail id");
      return ok;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMsg(null);

    const isValid = await verifyEmailFull(email);
    if (!isValid) {
      return;
    }

    onLogin?.(email.trim().toLowerCase(), password || "••••••••", remember);
  };

  const handleGoogle = async () => {
    setStatusMsg(null);
    const isValid = await verifyEmailFull(email);
    if (!isValid) {
      return;
    }
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      onLogin?.(email.trim().toLowerCase(), "google-oauth", true);
    }
  };

  const handleForgot = async () => {
    setStatusMsg(null);
    const isValid = await verifyEmailFull(email);
    if (!isValid) {
      return;
    }
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      setStatusMsg(`Password reset instructions sent to ${email.trim().toLowerCase()}.`);
    }
  };

  const handleToggleMode = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      setIsSignUp((prev) => !prev);
      setEmailError(null);
      setStatusMsg(null);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl flex w-full min-h-[82vh] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/90 shadow-2xl flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Visual Cover Panel */}
        <div className="bg-white/50 relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-1/2 dark:bg-slate-950/50">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
            alt="Modern workspace"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-indigo-950/40" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              {brandName}
            </span>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              LangGraph 5-Node Architecture Pipeline
            </div>
            <h3 className="text-2xl font-bold text-white leading-snug">
              {brandTagline}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Market Research, MVP Specs & System Topology in under 60s
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Copy-paste Master Builder Prompts & PDF Judge Exports
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-md space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-slate-950 text-3xl font-bold tracking-tight dark:text-slate-50">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-slate-500 text-sm dark:text-slate-400">
                {isSignUp
                  ? "Start forging autonomous hackathon blueprints in seconds."
                  : "Sign in with a valid email address to continue."}
              </p>
            </div>

            {emailError && (
              <div
                role="alert"
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-sm font-semibold animate-pulse"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            {statusMsg && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {statusMsg}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              disabled={isVerifying}
              className="bg-slate-100 hover:bg-slate-200 w-full gap-2 border border-slate-200 dark:border-slate-700 font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 h-11"
              onClick={handleGoogle}
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-slate-500 text-xs font-medium uppercase tracking-widest dark:text-slate-400">
                or
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Work Email <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => {
                  if (email.trim() && !isValidEmailClient(email)) {
                    setEmailError("enter valid mail id");
                  }
                }}
                aria-invalid={!!emailError}
                className={`bg-slate-100 h-10 ring-0 dark:bg-slate-800/90 transition-colors ${
                  emailError
                    ? "border-rose-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500 dark:border-rose-500"
                    : "border-slate-200 dark:border-slate-700/80 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500"
                }`}
              />
              {emailError && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-indigo-600 dark:text-indigo-400 text-xs underline-offset-4 transition-all hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-100 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500 h-10 border-slate-200 dark:border-slate-700/80 pr-10 ring-0 dark:bg-slate-800/90"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-500 hover:text-slate-950 absolute top-1/2 right-3 -translate-y-1/2 transition-colors dark:text-slate-400 dark:hover:text-slate-50"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="remember"
                checked={remember}
                onCheckedChange={setRemember}
              />
              <Label
                htmlFor="remember"
                className="text-slate-500 cursor-pointer text-sm select-none dark:text-slate-400"
              >
                Keep me signed in for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isVerifying}
              className="h-11 w-full text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white shadow-lg shadow-indigo-600/25"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying Email Domain...
                </>
              ) : isSignUp ? (
                "Create Account & Continue"
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-slate-500 text-center text-sm dark:text-slate-400">
              {isSignUp ? "Already have an account? " : "New here? "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-indigo-600 dark:text-indigo-400 font-semibold underline-offset-4 transition-all hover:underline"
              >
                {isSignUp ? "Sign in" : "Create a free account"}
              </button>
            </p>
          </form>
        </div>
      </div>

      <footer className="border-slate-200 text-slate-500 flex flex-col items-center justify-between gap-2 border-t px-6 py-4 text-xs sm:flex-row dark:border-slate-800 dark:text-slate-400">
        <span>
          © {copyrightYear} {brandName}. All rights reserved.
        </span>
        <div className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-slate-950 transition-colors dark:hover:text-slate-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
