import React from "react";

interface BioVinesProps {
  visible?: boolean;
  opacity?: number;
  density?: "low" | "medium" | "high";
}

/**
 * BioVines Component (Ramos de Coníferas & Geada da Taiga)
 * Estética puramente monocromática (preto, branco e tons de prata/gelo)
 * com agulhas de pinheiro, ramos boreais e cristais de neve pulsantes.
 */
export default function BioVines({
  visible = true,
  opacity = 22,
  density = "medium",
}: BioVinesProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none transition-opacity duration-700"
      aria-hidden="true"
      style={{ opacity: opacity / 100 }}
    >
      <style>{`
        @keyframes vineSwayLeft {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(1.2deg) translateY(3px); }
        }
        @keyframes vineSwayRight {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-1.4deg) translateY(2.5px); }
        }
        @keyframes frostPulseWhite {
          0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)); }
          50% { opacity: 0.95; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); }
        }
        @keyframes crystalGlowWhite {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.18); filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9)); }
        }
        .animate-vine-left {
          transform-origin: top left;
          animation: vineSwayLeft 7s ease-in-out infinite;
        }
        .animate-vine-right {
          transform-origin: top right;
          animation: vineSwayRight 8.5s ease-in-out infinite;
        }
        .animate-frost-pulse {
          animation: frostPulseWhite 3.5s ease-in-out infinite;
        }
        .animate-crystal-glow {
          animation: crystalGlowWhite 4s ease-in-out infinite;
        }
      `}</style>

      {/* TOP-LEFT VINE CLUSTER (Ramos da Taiga Boreal - Superior Esquerdo) */}
      <div className="absolute top-0 left-0 w-72 sm:w-96 md:w-[440px] h-72 sm:h-96 md:h-[440px] animate-vine-left opacity-90">
        <svg
          viewBox="0 0 440 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
        >
          {/* Main Stem */}
          <path
            d="M-20 -10 C60 40, 110 30, 170 80 C230 130, 220 200, 280 250 C320 285, 360 295, 390 340 C405 365, 410 400, 420 430"
            stroke="#27272a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Secondary Stem */}
          <path
            d="M-10 10 C50 60, 95 65, 145 110 C185 145, 190 185, 240 220 C270 240, 310 270, 335 315"
            stroke="#3f3f46"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Delicate Branch */}
          <path
            d="M170 80 C200 65, 240 50, 290 55 C330 60, 370 85, 410 120"
            stroke="#52525b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Frost Pulse Line */}
          <path
            d="M-20 -10 C60 40, 110 30, 170 80 C230 130, 220 200, 280 250"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            className="animate-frost-pulse"
          />

          {/* Leaves Cluster 1 - Folhas e Agulhas Boreais */}
          <g transform="translate(65, 40) rotate(25)">
            <path
              d="M0 0 C20 -12, 45 -12, 60 0 C45 12, 20 12, 0 0 Z"
              fill="#18181b"
              stroke="#a1a1aa"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="52" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          </g>

          <g transform="translate(115, 60) rotate(-15)">
            <path
              d="M0 0 C22 -14, 50 -14, 68 0 C50 14, 22 14, 0 0 Z"
              fill="#27272a"
              stroke="#ffffff"
              strokeWidth="1.4"
            />
            <line x1="0" y1="0" x2="60" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          </g>

          <g transform="translate(170, 80) rotate(60)">
            <path
              d="M0 0 C18 -10, 40 -10, 52 0 C40 10, 18 10, 0 0 Z"
              fill="#18181b"
              stroke="#d4d4d8"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="44" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          </g>

          <g transform="translate(225, 60) rotate(-10)">
            <path
              d="M0 0 C24 -15, 54 -15, 72 0 C54 15, 24 15, 0 0 Z"
              fill="#27272a"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="64" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          </g>

          <g transform="translate(280, 250) rotate(45)">
            <path
              d="M0 0 C20 -12, 44 -12, 58 0 C44 12, 20 12, 0 0 Z"
              fill="#18181b"
              stroke="#e4e4e7"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="50" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
          </g>

          {/* Ice Crystal Spores */}
          <circle cx="170" cy="80" r="5" fill="#ffffff" className="animate-crystal-glow" />
          <circle cx="170" cy="80" r="2.5" fill="#000000" />
          
          <circle cx="280" cy="248" r="6" fill="#e4e4e7" className="animate-crystal-glow" />
          <circle cx="280" cy="248" r="3" fill="#000000" />

          <circle cx="120" cy="180" r="4.5" fill="#ffffff" className="animate-frost-pulse" />
          <circle cx="335" cy="110" r="4" fill="#ffffff" className="animate-crystal-glow" />
          <circle cx="410" cy="125" r="3.5" fill="#d4d4d8" className="animate-frost-pulse" />
        </svg>
      </div>

      {/* TOP-RIGHT VINE CLUSTER (Ramos da Taiga Boreal - Superior Direito) */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 md:w-[440px] h-72 sm:h-96 md:h-[440px] animate-vine-right opacity-90">
        <svg
          viewBox="0 0 440 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
        >
          {/* Main Stem Right */}
          <path
            d="M460 -10 C380 40, 330 30, 270 80 C210 130, 220 200, 160 250 C120 285, 80 295, 50 340 C35 365, 30 400, 20 430"
            stroke="#27272a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Secondary Stem Right */}
          <path
            d="M450 10 C390 60, 345 65, 295 110 C255 145, 250 185, 200 220 C170 240, 130 270, 105 315"
            stroke="#3f3f46"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Frost Pulse Line Right */}
          <path
            d="M460 -10 C380 40, 330 30, 270 80 C210 130, 220 200, 160 250"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            className="animate-frost-pulse"
          />

          <g transform="translate(375, 40) rotate(-25)">
            <path
              d="M0 0 C-20 -12, -45 -12, -60 0 C-45 12, -20 12, 0 0 Z"
              fill="#18181b"
              stroke="#a1a1aa"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="-52" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          </g>

          <g transform="translate(325, 60) rotate(15)">
            <path
              d="M0 0 C-22 -14, -50 -14, -68 0 C-50 14, -22 14, 0 0 Z"
              fill="#27272a"
              stroke="#ffffff"
              strokeWidth="1.4"
            />
            <line x1="0" y1="0" x2="-60" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          </g>

          <g transform="translate(270, 80) rotate(-60)">
            <path
              d="M0 0 C-18 -10, -40 -10, -52 0 C-40 10, -18 10, 0 0 Z"
              fill="#18181b"
              stroke="#d4d4d8"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="-44" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
          </g>

          <g transform="translate(160, 250) rotate(-45)">
            <path
              d="M0 0 C-20 -12, -44 -12, -58 0 C-44 12, -20 12, 0 0 Z"
              fill="#18181b"
              stroke="#e4e4e7"
              strokeWidth="1.2"
            />
            <line x1="0" y1="0" x2="-50" y2="0" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
          </g>

          {/* Right crystals */}
          <circle cx="270" cy="80" r="5" fill="#ffffff" className="animate-crystal-glow" />
          <circle cx="270" cy="80" r="2.5" fill="#000000" />
          
          <circle cx="160" cy="248" r="6" fill="#e4e4e7" className="animate-crystal-glow" />
          <circle cx="160" cy="248" r="3" fill="#000000" />

          <circle cx="320" cy="180" r="4.5" fill="#ffffff" className="animate-frost-pulse" />
          <circle cx="105" cy="110" r="4" fill="#ffffff" className="animate-crystal-glow" />
        </svg>
      </div>

      {/* LATERAL HANGING TENDRILS */}
      {density !== "low" && (
        <>
          {/* Left Side Tendril Garland */}
          <div className="hidden lg:block absolute top-[35%] left-0 w-24 h-[420px] opacity-75">
            <svg viewBox="0 0 96 420" fill="none" className="w-full h-full">
              <path
                d="M-5 0 C25 60, 10 120, 30 180 C50 240, 20 300, 35 360 C42 390, 30 410, 25 420"
                stroke="#27272a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M-5 0 C25 60, 10 120, 30 180 C50 240, 20 300, 35 360"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="3 7"
                className="animate-frost-pulse"
              />
              <g transform="translate(18, 90) rotate(30)">
                <path d="M0 0 C15 -8, 35 -8, 50 0 C35 8, 15 8, 0 0 Z" fill="#18181b" stroke="#ffffff" strokeWidth="1" />
              </g>
              <g transform="translate(25, 170) rotate(45)">
                <path d="M0 0 C16 -10, 38 -10, 55 0 C38 10, 16 10, 0 0 Z" fill="#27272a" stroke="#d4d4d8" strokeWidth="1" />
              </g>
              <circle cx="30" cy="180" r="3.5" fill="#ffffff" className="animate-crystal-glow" />
              <circle cx="35" cy="360" r="3" fill="#e4e4e7" className="animate-frost-pulse" />
            </svg>
          </div>

          {/* Right Side Tendril Garland */}
          <div className="hidden lg:block absolute top-[35%] right-0 w-24 h-[420px] opacity-75">
            <svg viewBox="0 0 96 420" fill="none" className="w-full h-full">
              <path
                d="M101 0 C71 60, 86 120, 66 180 C46 240, 76 300, 61 360 C54 390, 66 410, 71 420"
                stroke="#27272a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M101 0 C71 60, 86 120, 66 180 C46 240, 76 300, 61 360"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="3 7"
                className="animate-frost-pulse"
              />
              <g transform="translate(78, 90) rotate(-30)">
                <path d="M0 0 C-15 -8, -35 -8, -50 0 C-35 8, -15 8, 0 0 Z" fill="#18181b" stroke="#ffffff" strokeWidth="1" />
              </g>
              <g transform="translate(71, 170) rotate(-45)">
                <path d="M0 0 C-16 -10, -38 -10, -55 0 C-38 10, -16 10, 0 0 Z" fill="#27272a" stroke="#d4d4d8" strokeWidth="1" />
              </g>
              <circle cx="66" cy="180" r="3.5" fill="#ffffff" className="animate-crystal-glow" />
              <circle cx="61" cy="360" r="3" fill="#e4e4e7" className="animate-frost-pulse" />
            </svg>
          </div>
        </>
      )}

      {/* BOTTOM SUBTLE VINES */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40 flex justify-between overflow-hidden">
        <svg viewBox="0 0 500 60" fill="none" className="w-80 h-full">
          <path d="M-10 60 C80 20, 160 40, 240 10 C320 -10, 400 30, 510 15" stroke="#27272a" strokeWidth="3" />
          <path d="M50 45 C70 30, 95 35, 110 50" stroke="#3f3f46" strokeWidth="1.5" />
          <circle cx="240" cy="10" r="2.5" fill="#ffffff" />
        </svg>
        <svg viewBox="0 0 500 60" fill="none" className="w-80 h-full scale-x-[-1]">
          <path d="M-10 60 C80 20, 160 40, 240 10 C320 -10, 400 30, 510 15" stroke="#27272a" strokeWidth="3" />
          <circle cx="240" cy="10" r="2.5" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
