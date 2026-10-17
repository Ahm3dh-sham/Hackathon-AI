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

// Editorial Old-Money Warm Linen, Aged Brass & Heritage Green Themes
const DEFAULT_THEMES: ThemeConfig[] = [
  {
    bg: '#eee9df',
    button: 'bg-[#80643d] hover:bg-[#68512f]',
    dot: 'bg-[#d8d0c1] border border-[#b9a784]',
    progress: 'bg-[#c9b99d]',
  },
  {
    bg: '#e8ede3',
    button: 'bg-[#526a56] hover:bg-[#394b3f]',
    dot: 'bg-[#c7d2c0] border border-[#9cab95]',
    progress: 'bg-[#9cab95]',
  },
  {
    bg: '#e9e4d9',
    button: 'bg-[#394b3f] hover:bg-[#4c604f]',
    dot: 'bg-[#d2cabb] border border-[#a39b8b]',
    progress: 'bg-[#80643d]/40',
  },
  {
    bg: '#f1ecdf',
    button: 'bg-[#68512f] hover:bg-[#80643d]',
    dot: 'bg-[#d7ccb8] border border-[#b9a784]',
    progress: 'bg-[#b9a784]',
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
      className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 border border-[#d8d0c1] shadow-sm transition-colors duration-300"
    >
      <ArrowButton
        onClick={goPrev}
        themeColor={theme.button}
        disabled={currentIndex === 0}
        ariaLabel="Previous tab"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
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
        <ChevronRight size={16} strokeWidth={2.5} />
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
      whileTap={disabled ? undefined : { scale: 0.92 }}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-[#fffdf8] shadow-sm transition-colors duration-300 ${
        disabled
          ? 'bg-[#dcd4c8] text-[#8b8478] opacity-60 cursor-not-allowed'
          : `${themeColor} cursor-pointer`
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
          className="absolute inset-0 rounded-full bg-[#394b3f] shadow-[0_0_6px_rgba(57,75,63,0.4)]"
        />
      )}
    </motion.button>
  );
};
