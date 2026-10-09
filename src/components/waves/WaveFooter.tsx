// src/components/waves/WaveFooter.tsx
import React from 'react';

export const WaveFooter: React.FC = () => {
  return (
    <footer
      aria-hidden="true"
      className="relative w-full overflow-hidden mt-8 select-none pointer-events-none"
      style={{ height: '70px' }}
    >
      {/* LAYER 1: DEEP AQUATIC TEAL BASE WAVE (back layer) */}
      <div className="absolute inset-x-0 bottom-0 h-16 w-[200%] wave-drift-layer-slow opacity-30 text-[#087A91]">
        <svg
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="currentColor"
        >
          <path d="M0,40 C300,10 600,70 900,40 C1200,10 1500,70 1800,40 C2100,10 2400,70 2400,120 L0,120 Z" />
        </svg>
      </div>

      {/* LAYER 2: OCEAN BLUE MID WAVE */}
      <div className="absolute inset-x-0 bottom-0 h-14 w-[200%] wave-drift-layer-reverse opacity-50 text-[#0789F9]">
        <svg
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="currentColor"
        >
          <path d="M0,60 C350,90 700,30 1050,60 C1400,90 1750,30 2100,60 C2450,90 2800,30 2800,120 L0,120 Z" />
        </svg>
      </div>

      {/* LAYER 3: BRIGHT CYAN FOREGROUND WAVE */}
      <div className="absolute inset-x-0 bottom-0 h-10 w-[200%] wave-drift-layer opacity-40 text-[#08B9E8]">
        <svg
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="currentColor"
        >
          <path d="M0,50 C400,20 800,80 1200,50 C1600,20 2000,80 2400,50 L2400,120 L0,120 Z" />
        </svg>
      </div>

      {/* LARGE FISH SILHOUETTES AT BOTTOM-LEFT */}
      <div className="absolute bottom-2 left-6 sm:left-12 flex items-end gap-3 z-10 opacity-40 text-[#087A91]">
        {/* Large fish silhouette */}
        <svg
          className="w-12 h-7 transform -scale-x-100"
          viewBox="0 0 36 20"
          fill="currentColor"
        >
          <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z M26,8 C27.1,8 28,7.1 28,6 C26.9,6 26,6.9 26,8 Z" />
        </svg>
        {/* Medium fish silhouette */}
        <svg
          className="w-8 h-5 transform -scale-x-100 translate-y-1"
          viewBox="0 0 36 20"
          fill="currentColor"
        >
          <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z M26,8 C27.1,8 28,7.1 28,6 C26.9,6 26,6.9 26,8 Z" />
        </svg>
        {/* Small fish silhouette */}
        <svg
          className="w-5 h-3.5 transform -scale-x-100 -translate-y-2 opacity-70"
          viewBox="0 0 36 20"
          fill="currentColor"
        >
          <path d="M34,10 C28,5 18,3 9,7 C5,3 2,1 0,2 C1,5 2,8 1,11 C2,14 1,17 0,20 C2,21 5,19 9,15 C18,19 28,17 34,12 C36,11 36,9 34,10 Z M26,8 C27.1,8 28,7.1 28,6 C26.9,6 26,6.9 26,8 Z" />
        </svg>
      </div>
    </footer>
  );
};
