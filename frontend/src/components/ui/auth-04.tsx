"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Cpu, Sparkles, CheckCircle2 } from "lucide-react";

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
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = email.trim() || "builder@hackforge.ai";
    onLogin?.(targetEmail, password || "••••••••", remember);
  };

  const handleGoogle = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      onLogin?.("google-user@hackforge.ai", "google-oauth", true);
    }
  };

  const handleForgot = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      setStatusMsg(
        `Password reset instructions sent to ${email.trim() || "your work email"}.`
      );
    }
  };

  const handleToggleMode = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      setIsSignUp((prev) => !prev);
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
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="space-y-1">
              <h2 className="text-slate-950 text-3xl font-bold tracking-tight dark:text-slate-50">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-slate-500 text-sm dark:text-slate-400">
                {isSignUp
                  ? "Start forging autonomous hackathon blueprints in seconds."
                  : "Sign in to pick up right where you left off."}
              </p>
            </div>

            {statusMsg && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                {statusMsg}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
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
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-100 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500 h-10 border-slate-200 dark:border-slate-700/80 ring-0 dark:bg-slate-800/90"
              />
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
              className="h-11 w-full text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white shadow-lg shadow-indigo-600/25"
            >
              {isSignUp ? "Create Account & Continue" : "Sign In"}
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
