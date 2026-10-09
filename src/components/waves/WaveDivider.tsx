// src/components/waves/WaveDivider.tsx
import React from 'react';

interface WaveDividerProps {
  className?: string;
  fillColor?: string;
  flip?: boolean;
  height?: number;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  className = '',
  fillColor = '#0789F9',
  flip = false,
  height = 40,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        flip ? 'rotate-180' : ''
      } ${className}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
