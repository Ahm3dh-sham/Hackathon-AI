"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiArrowRight } from "react-icons/hi2";

export default function Announcement3() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleJoinClick = () => {
    const target =
      document.getElementById("forge-studio") ||
      document.getElementById("brief-input");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLTextAreaElement) target.focus();
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="border-[#394b3f] bg-[#394b3f] relative flex w-full items-center justify-center border-b px-4 py-1.5 font-mono tracking-tight">
        <div className="flex-col items-center space-y-1 text-xs sm:flex sm:flex-row sm:gap-3 sm:space-y-0">
          <div className="text-[#fffdf8] flex items-center gap-3">
            Hackathon registrations are now open — build fast, ship faster, and
            win big
          </div>
          <div className="group flex items-center gap-3">
            <div className="hidden size-1 rounded-full bg-[#fffdf8] sm:block" />

            <Button
              onClick={handleJoinClick}
              className="h-7 px-3 text-xs rounded-none bg-[#fffdf8] text-[#292720] hover:bg-[#eee9df]"
            >
              Join now
              <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="text-[#fffdf8] hover:text-[#fffdf8]/70 absolute right-2 h-7 w-7 rounded-lg hover:bg-transparent"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
