"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HiArrowRight } from "react-icons/hi2";

export default function Announcement3() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleJoinClick = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      textarea.focus();
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="border-primary bg-primary/90 relative flex w-full items-center justify-center border-t border-b px-4 py-1.5 font-mono tracking-tight">
        <div className="flex-col items-center space-y-1 text-sm sm:flex sm:flex-row sm:gap-3 sm:space-y-0">
          <div className="text-primary-foreground text-md flex items-center gap-3">
            Hackathon registrations are now open — build fast, ship faster, and
            win big
          </div>
          <div className="group flex items-center gap-3">
            <div className="hidden size-1 rounded-full bg-white sm:block" />

            <Button
              onClick={handleJoinClick}
              className="rounded-none bg-white text-black hover:bg-white/95 dark:bg-white dark:text-black dark:hover:bg-white/95"
            >
              Join now
              <HiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="text-primary-foreground hover:text-primary-foreground/70 absolute right-2 rounded-lg hover:bg-transparent dark:hover:bg-transparent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

