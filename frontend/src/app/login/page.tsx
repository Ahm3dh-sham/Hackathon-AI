"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginPage, { isValidEmailClient } from "@/components/ui/auth-04";

export default function AuthRoutePage() {
  const router = useRouter();

  const handleLogin = (email: string) => {
    if (!isValidEmailClient(email)) return;
    if (typeof window !== "undefined") {
      localStorage.removeItem("hackforge_user");
      sessionStorage.setItem("hackforge_verified_email", email.trim().toLowerCase());
      window.dispatchEvent(new Event("hackforge-auth-change"));
    }
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto py-2">
      <LoginPage
        brandName="HackForge AI"
        onLogin={(email) => handleLogin(email)}
      />
    </div>
  );
}
