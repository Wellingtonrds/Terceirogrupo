import React from 'react';
import { Video, Camera, Sliders, FolderDown } from 'lucide-react';

interface StudioHeaderProps {
  activeTab: 'studio' | 'customize' | 'settings' | 'recordings';
  onTabChange: (tab: 'studio' | 'customize' | 'settings' | 'recordings') => void;
  isCameraActive: boolean;
  onToggleCamera: () => void;
  isRecording: boolean;
  recordingDurationMs: number;
  onOpenRecordingModal?: () => void;
  savedVideosCount: number;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  onTabChange,
  isCameraActive,
  onToggleCamera,
  isRecording,
  recordingDurationMs,
  onOpenRecordingModal,
  savedVideosCount,
}) => {
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Single Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20">
          M
        </div>
        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          MechaMorph VTuber
        </span>
      </div>

      {/* Zone 2: 4 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => onTabChange('studio')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'studio' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Estúdio
        </button>
        <button
          onClick={() => onTabChange('customize')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'customize' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Customizar Avatar
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'settings' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Rastreamento & Áudio
        </button>
        <button
          onClick={() => onTabChange('recordings')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
            activeTab === 'recordings' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <span>Gravações</span>
          {savedVideosCount > 0 && (
            <span className="text-xs px-1.5 py-0.2 bg-slate-800 text-cyan-300 rounded font-mono">
              {savedVideosCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {isRecording ? (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-rose-950/80 border border-rose-700/60 rounded-lg text-rose-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>GRAVANDO</span>
            <span className="font-bold text-white tabular-nums">{formatTime(recordingDurationMs)}</span>
          </div>
        ) : (
          <button
            onClick={onToggleCamera}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm ${
              isCameraActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCameraActive ? 'Câmera & Mic Ativos' : 'Ligar Câmera & Mic'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
