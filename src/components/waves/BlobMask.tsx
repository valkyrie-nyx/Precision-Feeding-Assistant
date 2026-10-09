// src/components/waves/BlobMask.tsx
import React, { useId } from 'react';

interface BlobMaskProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const BlobMask: React.FC<BlobMaskProps> = ({
  src,
  alt,
  className = '',
  width = 280,
  height = 280,
}) => {
  const clipId = useId().replace(/:/g, '_');

  // Organic asymmetrical blob Bézier paths
  const imageBlobPath =
    'M215.5,168.5 C197.8,214.3 145.4,242.7 94.6,231.2 C43.8,219.7 -5.4,168.3 1.1,118.2 C7.6,68.1 69.8,19.3 123.4,8.5 C177,-2.3 222.2,25 233.1,75.5 C244,126 233.2,122.7 215.5,168.5 Z';

  const offsetOutlinePath =
    'M223,174 C204,222 149,252 96,240 C43,228 -8,174 -1,121 C6,68 71,16 127,5 C183,-6 230,23 241,76 C252,129 242,126 223,174 Z';

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width, height }}
      aria-label={alt}
    >
      <svg
        viewBox="0 0 250 250"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`clip-${clipId}`}>
            <path d={imageBlobPath} />
          </clipPath>
        </defs>

        {/* THIN OFFSET OUTLINE BLOB BEHIND THE PHOTO */}
        <path
          d={offsetOutlinePath}
          fill="none"
          stroke="#08B9E8"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          className="opacity-70 transform -translate-x-1 translate-y-1.5"
        />

        {/* SECOND FAINT GLOW / OUTLINE BLOB */}
        <path
          d={offsetOutlinePath}
          fill="rgba(7, 137, 249, 0.08)"
          stroke="#0789F9"
          strokeWidth="1.5"
          className="opacity-60 transform translate-x-2 -translate-y-1"
        />

        {/* IMAGE CLIPPED BY ORGANIC BLOB */}
        <g clipPath={`url(#clip-${clipId})`}>
          <image
            href={src}
            x="0"
            y="0"
            width="250"
            height="250"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>

        {/* INNER SHADOW & TINT ACCENT ON BLOB RIM */}
        <path
          d={imageBlobPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};
