import React from 'react';
import { TrackingData, TrackingSettings } from '../types/vtuber';
import { Crosshair, Sliders, Volume2, Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TrackingSettingsPanelProps {
  settings: TrackingSettings;
  onChange: (newSettings: TrackingSettings) => void;
  trackingData: TrackingData;
  onCalibrateNeutral: () => void;
  isCameraActive: boolean;
  onToggleCamera: () => void;
  isLandmarkerReady: boolean;
}

export const TrackingSettingsPanel: React.FC<TrackingSettingsPanelProps> = ({
  settings,
  onChange,
  trackingData,
  onCalibrateNeutral,
  isCameraActive,
  onToggleCamera,
  isLandmarkerReady,
}) => {
  const update = (partial: Partial<TrackingSettings>) => {
    onChange({ ...settings, ...partial });
  };

  const pitchDeg = Math.round((trackingData.pitch * 180) / Math.PI);
  const yawDeg = Math.round((trackingData.yaw * 180) / Math.PI);
  const rollDeg = Math.round((trackingData.roll * 180) / Math.PI);

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-8 bg-slate-950/70">
      {/* 1. Status em Tempo Real & Calibração */}
      <section className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Rastreamento Facial em Tempo Real
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    trackingData.hasFace ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                {trackingData.hasFace ? 'Rosto Travado' : 'Aguardando Rosto'}
              </span>
              <span>·</span>
              <span>
                {isLandmarkerReady ? 'MediaPipe 478 Pontos (GPU)' : 'Rastreador Óptico Rápido'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCalibrateNeutral}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              <Crosshair className="w-4 h-4" />
              <span>Calibrar Posição Neutra</span>
            </button>
            <button
              onClick={onToggleCamera}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Reiniciar Câmera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetria do Rosto */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Piscada E / D</div>
            <div className="text-sm font-mono font-bold text-pink-300 mt-0.5 tabular-nums">
              {trackingData.eyeBlinkLeft > 0.4 ? 'Piscando' : 'Aberto'} /{' '}
              {trackingData.eyeBlinkRight > 0.4 ? 'Piscando' : 'Aberto'}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Direção do Olhar</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5 tabular-nums">
              {Math.abs(trackingData.eyeGazeX) < 0.2
                ? 'Centro'
                : trackingData.eyeGazeX < 0
                ? 'Esquerda'
                : 'Direita'}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Sorriso & Boca "O"</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5 tabular-nums">
              {Math.round(trackingData.mouthSmile * 100)}% / {Math.round(trackingData.mouthPucker * 100)}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <div className="text-[11px] text-slate-400">Abertura da Boca</div>
            <div className="text-sm font-mono font-bold text-pink-300 mt-0.5 tabular-nums">
              {Math.round(trackingData.mouthOpen * 100)}%
            </div>
          </div>
        </div>
      </section>

      {/* 2. Volume & Reatividade do Microfone */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Microfone & Lip Sync Vocal
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          O áudio do microfone complementa o rastreador de câmera para uma sincronização labial robótica perfeita.
        </p>

        {/* Live Audio VU meter */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>NÍVEL DO MICROFONE</span>
            <span className="tabular-nums">{Math.round(trackingData.audioVolume * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-cyan-500 via-emerald-400 to-rose-500"
              style={{ width: `${Math.min(100, trackingData.audioVolume * 130)}%` }}
            />
          </div>
        </div>

        {/* Lip Sync Toggle */}
        <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Lip Sync Ativado por Microfone
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Abre a boca e pulsa o equalizador robótico com o volume da voz
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.useAudioLipSync}
            onChange={(e) => update({ useAudioLipSync: e.target.checked })}
            className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0"
          />
        </label>
      </section>

      {/* 3. Sliders de Sensibilidade e Suavização */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Ajuste Fino de Movimento
          </h2>
        </div>

        {/* Head Sensitivity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-200">Sensibilidade de Giro da Cabeça</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {settings.headSensitivity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={settings.headSensitivity}
            onChange={(e) => update({ headSensitivity: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Position Sensitivity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-200">Sensibilidade de Deslocamento X/Y</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {settings.positionSensitivity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={settings.positionSensitivity}
            onChange={(e) => update({ positionSensitivity: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Mouth Sensitivity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-200">Sensibilidade da Boca</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {settings.mouthSensitivity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="3.0"
            step="0.1"
            value={settings.mouthSensitivity}
            onChange={(e) => update({ mouthSensitivity: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Smoothing */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-200">Suavização Cinemática (Damping)</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {Math.round(settings.smoothingFactor * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Valores maiores removem tremores da câmera; valores menores respondem instantaneamente.
          </p>
          <input
            type="range"
            min="0.2"
            max="0.95"
            step="0.05"
            value={settings.smoothingFactor}
            onChange={(e) => update({ smoothingFactor: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Mirror Camera */}
        <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 cursor-pointer">
          <div>
            <div className="text-xs font-semibold text-slate-200">
              Espelhar Movimento da Câmera
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Move o avatar como em um espelho natural (recomendado)
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.mirrorCamera}
            onChange={(e) => update({ mirrorCamera: e.target.checked })}
            className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0"
          />
        </label>
      </section>
    </div>
  );
};
