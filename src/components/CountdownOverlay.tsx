import React, { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete, onCancel }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 900);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="text-8xl font-black text-cyan-400 font-mono animate-bounce drop-shadow-[0_0_35px_rgba(0,240,255,0.8)]">
          {count > 0 ? count : 'GO!'}
        </div>
        <p className="text-sm font-semibold text-slate-300 mt-4 tracking-wider uppercase">
          Preparando Gravação... Olhe para a câmera
        </p>
        <button
          onClick={onCancel}
          className="mt-6 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-slate-400 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
