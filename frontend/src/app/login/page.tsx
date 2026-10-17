"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/ui/auth-04";

export default function AuthRoutePage() {
  const router = useRouter();

  const handleLogin = (email: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hackforge_user", email || "builder@hackforge.ai");
      window.dispatchEvent(new Event("hackforge-auth-change"));
    }
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto py-2">
      <LoginPage
        brandName="HackForge AI"
        onLogin={(email) => handleLogin(email)}
        onGoogleLogin={() => handleLogin("google-builder@hackforge.ai")}
      />
    </div>
  );
}
