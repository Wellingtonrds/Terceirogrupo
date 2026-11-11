import React from "react";

interface SnowflakeLogoProps {
  className?: string;
  size?: number;
}

/**
 * SnowflakeLogo Component (Assistente de Taiga)
 * Floco de neve geométrico e cristalino de alta precisão em tons preto e branco.
 */
export const SnowflakeLogo: React.FC<SnowflakeLogoProps> = ({ className = "w-7 h-7", size }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      width={size}
      height={size}
      aria-label="Logo Floco de Neve da Taiga"
    >
      {/* 6-fold symmetric crystal snowflake */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main 6 axes */}
        <line x1="24" y1="4" x2="24" y2="44" />
        <line x1="6.68" y1="14" x2="41.32" y2="34" />
        <line x1="6.68" y1="34" x2="41.32" y2="14" />

        {/* Vertical axis crystal branches */}
        {/* Top */}
        <path d="M20 10 L24 14 L28 10" />
        <path d="M19 16 L24 20 L29 16" />
        {/* Bottom */}
        <path d="M20 38 L24 34 L28 38" />
        <path d="M19 32 L24 28 L29 32" />

        {/* Diagonal axis 1 (top-left to bottom-right) */}
        {/* Top-left */}
        <path d="M10.5 10.5 L15.34 19 L10 19" />
        <path d="M16 12 L19.5 21 L14.5 22.5" />
        {/* Bottom-right */}
        <path d="M37.5 37.5 L32.66 29 L38 29" />
        <path d="M32 36 L28.5 27 L33.5 25.5" />

        {/* Diagonal axis 2 (bottom-left to top-right) */}
        {/* Bottom-left */}
        <path d="M10.5 37.5 L15.34 29 L10 29" />
        <path d="M16 36 L19.5 27 L14.5 25.5" />
        {/* Top-right */}
        <path d="M37.5 10.5 L32.66 19 L38 19" />
        <path d="M32 12 L28.5 21 L33.5 22.5" />

        {/* Central hexagon core */}
        <polygon
          points="24,19 28.33,21.5 28.33,26.5 24,29 19.67,26.5 19.67,21.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </g>
    </svg>
  );
};

// Also export as BranchLogo for backwards-compatibility with existing imports
export const BranchLogo = SnowflakeLogo;
export default SnowflakeLogo;
