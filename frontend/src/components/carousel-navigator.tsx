'use client';

import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type FC } from 'react';

export type ThemeConfig = {
  bg: string;
  button: string;
  dot: string;
  progress: string;
};

interface CarouselNavigatorProps {
  totalSlides?: number;
  autoDelay?: number;
  themes?: ThemeConfig[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const DEFAULT_TOTAL_SLIDES = 4;
const DEFAULT_AUTO_DELAY = 5000;

const DEFAULT_THEMES: ThemeConfig[] = [
  {
    bg: 'rgba(30, 27, 75, 0.75)',
    button: 'bg-indigo-600 hover:bg-indigo-500',
    dot: 'bg-indigo-950 border border-indigo-500/40',
    progress: 'bg-indigo-500/40',
  },
  {
    bg: 'rgba(59, 7, 100, 0.75)',
    button: 'bg-purple-600 hover:bg-purple-500',
    dot: 'bg-purple-950 border border-purple-500/40',
    progress: 'bg-purple-500/40',
  },
  {
    bg: 'rgba(6, 78, 59, 0.75)',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    dot: 'bg-emerald-950 border border-emerald-500/40',
    progress: 'bg-emerald-500/40',
  },
  {
    bg: 'rgba(69, 26, 3, 0.75)',
    button: 'bg-amber-600 hover:bg-amber-500',
    dot: 'bg-amber-950 border border-amber-500/40',
    progress: 'bg-amber-500/40',
  },
];

export const CarouselNavigator: FC<CarouselNavigatorProps> = ({
  totalSlides = DEFAULT_TOTAL_SLIDES,
  autoDelay = DEFAULT_AUTO_DELAY,
  themes = DEFAULT_THEMES,
  currentIndex,
  onIndexChange,
}) => {
  const theme = themes[currentIndex] || themes[0];

  const goPrev = () =>
    onIndexChange((currentIndex - 1 + totalSlides) % totalSlides);

  const goNext = () => onIndexChange((currentIndex + 1) % totalSlides);

  return (
    <motion.div
      animate={{
        backgroundColor: theme.bg.replace('bg-[', '').replace(']', ''),
      }}
      className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 border border-white/10 backdrop-blur-md shadow-lg transition-colors duration-300"
    >
      <ArrowButton
        onClick={goPrev}
        themeColor={theme.button}
        disabled={currentIndex === 0}
        ariaLabel="Previous tab"
      >
        <ChevronLeft size={18} strokeWidth={3} />
      </ArrowButton>

      <div className="flex items-center gap-2 px-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <Indicator
            key={i}
            isActive={i === currentIndex}
            theme={theme}
            autoDelay={autoDelay}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>

      <ArrowButton
        onClick={goNext}
        themeColor={theme.button}
        ariaLabel="Next tab"
      >
        <ChevronRight size={18} strokeWidth={3} />
      </ArrowButton>
    </motion.div>
  );
};

const ArrowButton = ({ children, onClick, themeColor, disabled, ariaLabel }: any) => {
  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-colors duration-300 ${
        disabled ? 'bg-gray-800 text-gray-500 opacity-50 cursor-not-allowed' : `${themeColor} cursor-pointer`
      }`}
    >
      {children}
    </motion.button>
  );
};

const Indicator = ({
  isActive,
  theme,
  autoDelay,
  onClick,
}: {
  isActive: boolean;
  theme: ThemeConfig;
  autoDelay: number;
  onClick: () => void;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ borderRadius: 24 }}
      className={`relative h-2.5 cursor-pointer focus:outline-none ${
        isActive ? `w-10 ${theme.progress}` : `w-2.5 ${theme.dot}`
      } transition-colors duration-300`}
    >
      {isActive && (
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoDelay / 1000, ease: 'linear' }}
          className="absolute inset-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        />
      )}
    </motion.button>
  );
};

