import React, { useState } from 'react';
import { Download, X, Play, RefreshCw, CheckCircle, Film, Sparkles } from 'lucide-react';
import { RecordedVideo } from '../types/vtuber';
import { VideoRecorderService } from '../services/videoRecorder';

interface VideoPlaybackModalProps {
  video: RecordedVideo | null;
  onClose: () => void;
  onRecordAgain: () => void;
}

export const VideoPlaybackModal: React.FC<VideoPlaybackModalProps> = ({
  video,
  onClose,
  onRecordAgain,
}) => {
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!video) return null;

  const durationSec = (video.durationMs / 1000).toFixed(1);
  const sizeMB = (video.sizeBytes / (1024 * 1024)).toFixed(2);

  const handleDownload = () => {
    VideoRecorderService.saveToDevice(video);
    setHasDownloaded(true);
    setTimeout(() => setHasDownloaded(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gravação Concluída com Sucesso!</h3>
              <p className="text-xs text-slate-400">
                Pré-visualize seu vídeo VTuber e salve diretamente no seu dispositivo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Preview */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-inner flex items-center justify-center">
            <video
              src={video.url}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block">Duração</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 tabular-nums">
                {durationSec}s
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Tamanho</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 tabular-nums">
                {sizeMB} MB
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Formato</span>
              <span className="font-mono font-bold text-cyan-400 mt-0.5">
                {video.name.endsWith('.mp4') ? 'MP4 Vídeo' : 'WebM 60FPS'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Áudio Microfone</span>
              <span className="font-mono font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>Gravado</span>
                <span>🎙️</span>
              </span>
            </div>
          </div>

          {/* Big Action: Save Video to Device */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl active:scale-[0.99] ${
                hasDownloaded
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/60'
              }`}
            >
              {hasDownloaded ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Vídeo Salvo no Dispositivo! (Baixando...)</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>SALVAR VÍDEO NO DISPOSITIVO</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Arquivo: <code className="text-slate-300 font-mono">{video.name}</code></span>
              <span>Pronto para redes sociais, YouTube ou OBS</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Fechar Janela
          </button>

          <button
            onClick={() => {
              onClose();
              onRecordAgain();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Gravar Outro Vídeo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
