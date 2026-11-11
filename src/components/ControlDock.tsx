import React, { useState } from 'react';
import {
  AvatarConfig,
  AvatarShape,
  EmotionState,
  NeonColor,
  StudioBackground,
} from '../types/vtuber';
import {
  ChevronDown,
  ChevronUp,
  Circle,
  Square,
  Play,
  Pause,
  Camera,
  Crosshair,
  Sparkles,
  Layers,
  Palette,
} from 'lucide-react';

interface ControlDockProps {
  avatarConfig: AvatarConfig;
  onAvatarConfigChange: (config: AvatarConfig) => void;
  background: StudioBackground;
  onBackgroundChange: (bg: StudioBackground) => void;
  isRecording: boolean;
  isPaused: boolean;
  recordingDurationMs: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onCalibrateNeutral: () => void;
  onCaptureSnapshot: () => void;
  currentEmotion: EmotionState;
  onEmotionChange: (emotion: EmotionState) => void;
}

const QUICK_SHAPES: { id: AvatarShape; label: string; icon: string }[] = [
  { id: 'sphere', label: 'Bola', icon: '⚪' },
  { id: 'droplet', label: 'Gota', icon: '💧' },
  { id: 'cube', label: 'Cubo', icon: '⬛' },
  { id: 'triangle', label: 'Triângulo', icon: '🔺' },
  { id: 'flower', label: 'Flor', icon: '🌸' },
  { id: 'star', label: 'Estrela', icon: '⭐' },
  { id: 'heart', label: 'Coração', icon: '💖' },
  { id: 'mushroom', label: 'Cogumelo', icon: '🍄' },
  { id: 'capsule', label: 'Cápsula', icon: '💊' },
  { id: 'cloud', label: 'Nuvem', icon: '☁️' },
  { id: 'diamond', label: 'Diamante', icon: '💎' },
  { id: 'bear', label: 'Urso', icon: '🧸' },
  { id: 'cat', label: 'Gatinho', icon: '🐱' },
  { id: 'ufo', label: 'OVNI', icon: '🛸' },
];

const BACKGROUNDS: { id: StudioBackground; label: string }[] = [
  { id: 'cyber_studio', label: 'Cyber Studio' },
  { id: 'neon_grid', label: 'Neon Grid' },
  { id: 'chroma_green', label: 'Chroma Verde' },
  { id: 'chroma_blue', label: 'Chroma Azul' },
  { id: 'minimal_stage', label: 'Palco Minimal' },
  { id: 'deep_space', label: 'Espaço Cósmico' },
];

const QUICK_NEONS: NeonColor[] = [
  '#ff70a6',
  '#70d6ff',
  '#ffd670',
  '#c77dff',
  '#00f0ff',
  '#ffffff',
];

export const ControlDock: React.FC<ControlDockProps> = ({
  avatarConfig,
  onAvatarConfigChange,
  background,
  onBackgroundChange,
  isRecording,
  isPaused,
  recordingDurationMs,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onCalibrateNeutral,
  onCaptureSnapshot,
  currentEmotion,
  onEmotionChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDockTab, setActiveDockTab] = useState<'record' | 'shapes' | 'background' | 'emotes'>('record');

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[840px] flex flex-col items-center pointer-events-auto">
      {/* Collapse / Cinema Mode Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-1.5 px-3 py-1 mb-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white text-[11px] font-medium backdrop-blur-md shadow-md transition-all hover:bg-slate-800"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mostrar Controles</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ocultar (Modo Cinema)</span>
          </>
        )}
      </button>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="w-full rounded-2xl bg-slate-950/90 border border-slate-800/80 p-3 shadow-2xl backdrop-blur-xl space-y-3 transition-all">
          {/* Top Bar inside dock: Mode Tabs & Quick Actions */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            {/* Tab buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveDockTab('record')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDockTab === 'record'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Gravação
              </button>
              <button
                onClick={() => setActiveDockTab('shapes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDockTab === 'shapes'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Formas Rápidas
              </button>
              <button
                onClick={() => setActiveDockTab('background')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDockTab === 'background'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Cenário
              </button>
              <button
                onClick={() => setActiveDockTab('emotes')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeDockTab === 'emotes'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Expressões
              </button>
            </div>

            {/* Quick Framing & Calibration */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
                <button
                  onClick={() =>
                    onAvatarConfigChange({
                      ...avatarConfig,
                      cameraViewMode: 'full_body',
                      cameraZoom: 0.9,
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    (avatarConfig.cameraViewMode || 'full_body') === 'full_body'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Enquadrar Corpo Inteiro"
                >
                  🧍 Corpo Inteiro
                </button>
                <button
                  onClick={() =>
                    onAvatarConfigChange({
                      ...avatarConfig,
                      cameraViewMode: 'portrait',
                      cameraZoom: 1.15,
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                    avatarConfig.cameraViewMode === 'portrait'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Enquadrar Busto / Rosto"
                >
                  👤 Busto
                </button>
              </div>

              {/* Zoom - / + */}
              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <button
                  onClick={() =>
                    onAvatarConfigChange({
                      ...avatarConfig,
                      cameraZoom: Math.max(0.6, (avatarConfig.cameraZoom || 0.9) - 0.15),
                    })
                  }
                  className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold border border-slate-800 text-xs"
                  title="Afastar Câmera"
                >
                  -
                </button>
                <button
                  onClick={() =>
                    onAvatarConfigChange({
                      ...avatarConfig,
                      cameraZoom: Math.min(1.6, (avatarConfig.cameraZoom || 0.9) + 0.15),
                    })
                  }
                  className="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold border border-slate-800 text-xs"
                  title="Aproximar Câmera"
                >
                  +
                </button>
              </div>

              <button
                onClick={onCalibrateNeutral}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white text-xs border border-slate-800 hover:border-slate-700 transition-colors"
                title="Recentralizar Rosto"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Calibrar</span>
              </button>
              <button
                onClick={onCaptureSnapshot}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white text-xs border border-slate-800 hover:border-slate-700 transition-colors"
                title="Capturar Foto HD"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Foto</span>
              </button>
            </div>
          </div>

          {/* Sub-Panel Contents */}
          <div className="min-h-[52px] flex items-center justify-between">
            {activeDockTab === 'record' && (
              <div className="w-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={onStartRecording}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/60 transition-transform active:scale-95"
                    >
                      <Circle className="w-3.5 h-3.5 fill-current" />
                      <span>INICIAR GRAVAÇÃO</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onStopRecording}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>PARAR E SALVAR</span>
                      </button>

                      {isPaused ? (
                        <button
                          onClick={onResumeRecording}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                          title="Continuar Gravação"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Continuar</span>
                        </button>
                      ) : (
                        <button
                          onClick={onPauseRecording}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                          title="Pausar Gravação"
                        >
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pausar</span>
                        </button>
                      )}
                    </div>
                  )}

                  {isRecording && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-mono font-bold text-white tabular-nums">
                        {formatDuration(recordingDurationMs)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 hidden md:block">
                  {isRecording
                    ? 'Vídeo e áudio sincronizados gravando a 60 FPS'
                    : 'Grave vídeo com o avatar seguindo seu rosto em tempo real'}
                </div>
              </div>
            )}

            {activeDockTab === 'shapes' && (
              <div className="w-full flex items-center justify-between gap-4 overflow-x-auto py-1">
                <div className="flex items-center gap-2">
                  {QUICK_SHAPES.map((qs) => {
                    const isSelected = avatarConfig.shape === qs.id;
                    return (
                      <button
                        key={qs.id}
                        onClick={() =>
                          onAvatarConfigChange({ ...avatarConfig, shape: qs.id })
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span>{qs.icon}</span>
                        <span>{qs.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Neon Dots */}
                <div className="flex items-center gap-1.5 shrink-0 pl-3 border-l border-slate-800">
                  {QUICK_NEONS.map((nc) => (
                    <button
                      key={nc}
                      onClick={() =>
                        onAvatarConfigChange({ ...avatarConfig, neonColor: nc })
                      }
                      className={`w-5 h-5 rounded-full transition-transform ${
                        avatarConfig.neonColor === nc ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: nc }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeDockTab === 'background' && (
              <div className="w-full flex items-center gap-2 overflow-x-auto py-1">
                {BACKGROUNDS.map((bg) => {
                  const isSelected = background === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => onBackgroundChange(bg.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {bg.label}
                    </button>
                  );
                })}
              </div>
            )}

            {activeDockTab === 'emotes' && (
              <div className="w-full flex items-center gap-2 overflow-x-auto py-1">
                {[
                  { id: 'neutral', label: 'Neutro', icon: '😐' },
                  { id: 'happy', label: 'Feliz', icon: '😄' },
                  { id: 'excited', label: 'Empolgado', icon: '🤩' },
                  { id: 'love', label: 'Amor', icon: '🥰' },
                  { id: 'blush', label: 'Corado', icon: '😊' },
                  { id: 'wink', label: 'Piscar', icon: '😉' },
                  { id: 'smug', label: 'Travesso', icon: '😼' },
                  { id: 'thinking', label: 'Pensativo', icon: '🤔' },
                  { id: 'surprised', label: 'Surpreso', icon: '😲' },
                  { id: 'cool', label: 'Cool', icon: '😎' },
                  { id: 'sleepy', label: 'Sono', icon: '😴' },
                  { id: 'crying_tears', label: 'Chorando', icon: '😭' },
                  { id: 'dizzy', label: 'Tonto', icon: '😵‍💫' },
                  { id: 'shocked', label: 'Chocado', icon: '😱' },
                  { id: 'angry', label: 'Bravo', icon: '😠' },
                ].map((emo) => {
                  const isSelected = currentEmotion === emo.id;
                  return (
                    <button
                      key={emo.id}
                      onClick={() => onEmotionChange(emo.id as EmotionState)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span>{emo.icon}</span>
                      <span>{emo.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
