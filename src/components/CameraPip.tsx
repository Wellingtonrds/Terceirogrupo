import React, { useState } from 'react';
import { Camera, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { TrackingData } from '../types/vtuber';

interface CameraPipProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  trackingData: TrackingData;
  isLandmarkerReady: boolean;
}

export const CameraPip: React.FC<CameraPipProps> = ({
  videoRef,
  isCameraActive,
  trackingData,
  isLandmarkerReady,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isCameraActive) return null;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-18 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white text-xs backdrop-blur-md shadow-lg"
      >
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>Ver Câmera PiP</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed top-18 right-6 z-20 transition-all rounded-2xl bg-slate-950/90 border border-slate-800/80 p-2 shadow-2xl backdrop-blur-md overflow-hidden ${
        isMinimized ? 'w-44' : 'w-56'
      }`}
    >
      {/* Top Header of PiP */}
      <div className="flex items-center justify-between pb-1.5 px-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              trackingData.hasFace ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="font-semibold text-slate-300">
            {trackingData.hasFace ? 'Rosto OK' : 'Buscando...'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title="Ocultar Câmera"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Video Stream Element */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />

        {/* HUD Face Tracking Reticle */}
        {trackingData.hasFace && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-cyan-400/40 animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400/70" />
            </div>
          </div>
        )}
      </div>

      <div className="pt-1.5 px-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>{isLandmarkerReady ? 'AI-TRACK' : 'OPTIC-TRACK'}</span>
        <span>{Math.round(trackingData.audioVolume * 100)}% MIC</span>
      </div>
    </div>
  );
};
