import React from 'react';
import { Download, Trash2, Film, Play, Clock, HardDrive } from 'lucide-react';
import { RecordedVideo } from '../types/vtuber';
import { VideoRecorderService } from '../services/videoRecorder';

interface SavedRecordingsListProps {
  recordings: RecordedVideo[];
  onSelectVideo: (video: RecordedVideo) => void;
  onDeleteVideo: (index: number) => void;
}

export const SavedRecordingsList: React.FC<SavedRecordingsListProps> = ({
  recordings,
  onSelectVideo,
  onDeleteVideo,
}) => {
  if (recordings.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/70">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <Film className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Nenhuma gravação recente</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Grave seu avatar seguindo seus movimentos no estúdio. Todos os vídeos gravados aparecerão aqui para reprodução e download direto no seu dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-6 bg-slate-950/70">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Vídeos Gravados ({recordings.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique para reproduzir ou baixe novamente qualquer vídeo para seu computador ou celular.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recordings.map((rec, index) => {
          const durationSec = (rec.durationMs / 1000).toFixed(1);
          const sizeMB = (rec.sizeBytes / (1024 * 1024)).toFixed(2);

          return (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div
                onClick={() => onSelectVideo(rec)}
                className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 cursor-pointer group"
              >
                <video src={rec.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-white truncate">{rec.name}</div>
                <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{durationSec}s</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-cyan-400" />
                    <span>{sizeMB} MB</span>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">🎙️ Áudio</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => VideoRecorderService.saveToDevice(rec)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Salvar no Dispositivo</span>
                </button>
                <button
                  onClick={() => onDeleteVideo(index)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 transition-colors"
                  title="Excluir da Lista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
