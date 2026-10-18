"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Layers,
  Users,
  FileCode2,
  Presentation,
  ArrowUp,
} from "lucide-react";

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  mouseX: any;
  onClick?: () => void;
}

function DockItem({ icon, label, href, mouseX, onClick }: DockItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [42, 60, 42]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 18 });

  return (
    <div className="relative flex flex-col items-center">
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -top-9 px-2.5 py-1 bg-[#292720] text-[#fffdf8] font-mono text-[10px] font-bold tracking-wider uppercase rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
        >
          {label}
        </motion.div>
      )}

      <motion.a
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width, height: width }}
        className="flex items-center justify-center rounded-xl bg-[#fffdf8] border border-[#d8d0c1] text-[#292720] shadow-[0_4px_14px_rgba(61,51,37,0.12)] hover:border-[#80643d] hover:text-[#80643d] hover:shadow-[0_8px_20px_rgba(128,100,61,0.2)] transition-colors active:scale-95"
      >
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      </motion.a>
    </div>
  );
}

export function FloatingQuickDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      aria-label="Quick Actions Dock"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#f7f4ed]/90 backdrop-blur-md border border-[#d8d0c1] shadow-[0_18px_48px_rgba(61,51,37,0.18)]"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <DockItem
        href="#top"
        label="Top"
        icon={<ArrowUp className="w-4 h-4 text-[#726d62]" />}
        mouseX={mouseX}
      />
      <div className="w-px h-5 bg-[#d8d0c1]/80 mx-0.5" />
      <DockItem
        href="#product"
        label="Blueprint Studio"
        icon={<Sparkles className="w-4 h-4 text-[#80643d]" />}
        mouseX={mouseX}
      />
      <DockItem
        href="#workflow"
        label="How it works"
        icon={<Layers className="w-4 h-4 text-[#394b3f]" />}
        mouseX={mouseX}
      />
      <DockItem
        href="#agents"
        label="Agent Team"
        icon={<Users className="w-4 h-4 text-[#80643d]" />}
        mouseX={mouseX}
      />
      <DockItem
        href="#blueprint"
        label="The Blueprint"
        icon={<FileCode2 className="w-4 h-4 text-[#394b3f]" />}
        mouseX={mouseX}
      />
      <DockItem
        href="#talkscript"
        label="TalkScript & PPT"
        icon={<Presentation className="w-4 h-4 text-[#80643d]" />}
        mouseX={mouseX}
      />
    </nav>
  );
}

export default FloatingQuickDock;
