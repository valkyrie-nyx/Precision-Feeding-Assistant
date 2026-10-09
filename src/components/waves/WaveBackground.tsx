// src/components/waves/WaveBackground.tsx
import React from 'react';

export const WaveBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* BASE SKY-BLUE WATER GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fbfe] via-[#f0f6fc] to-[#eaf3fb] opacity-80" />

      {/* FAINT ORGANIC AMBIENT GLOWS */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#08B9E8]/10 blur-3xl" />
      <div className="absolute top-1/3 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#0789F9]/8 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#087A91]/8 blur-3xl" />

      {/* FAINT THIN DRIFTING WAVE LINES */}
      <svg
        className="absolute inset-0 w-[200%] h-full wave-drift-layer opacity-40 text-[#0789F9]"
        viewBox="0 0 2800 1200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0,220 C350,160 700,280 1050,220 C1400,160 1750,280 2100,220 C2450,160 2800,280 3150,220"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="8 6"
          opacity="0.35"
        />
        <path
          d="M0,480 C320,540 640,420 960,480 C1280,540 1600,420 1920,480 C2240,540 2560,420 2880,480"
          stroke="#08B9E8"
          strokeWidth="1"
          opacity="0.3"
        />
        <path
          d="M0,780 C400,720 800,840 1200,780 C1600,720 2000,840 2400,780 C2800,720 3200,840 3600,780"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M0,1020 C360,1080 720,960 1080,1020 C1440,1080 1800,960 2160,1020 C2520,1080 2880,960 3240,1020"
          stroke="#087A91"
          strokeWidth="1"
          strokeDasharray="12 8"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};
