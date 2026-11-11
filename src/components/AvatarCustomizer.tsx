import React from 'react';
import {
  AvatarConfig,
  AvatarShape,
  EmotionState,
  EyeStyle,
  MouthStyle,
  NeonColor,
  RobotMaterial,
  AccessoryType,
} from '../types/vtuber';
import { Sparkles, Smile, Eye, Shield, Sliders, Check, Heart } from 'lucide-react';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (newConfig: AvatarConfig) => void;
  currentEmotion: EmotionState;
  onEmotionChange: (emotion: EmotionState) => void;
}

const SHAPES: { id: AvatarShape; label: string; desc: string; icon: string }[] = [
  { id: 'sphere', label: 'Bolinha Fofa', desc: 'Esfera rechonchuda com patinhas robóticas e bochechas', icon: '⚪' },
  { id: 'droplet', label: 'Gota Fofinha', desc: 'Gota d’água bebê com anel flutuante e ponta brilhante', icon: '💧' },
  { id: 'cube', label: 'Cubo Tamagotchi', desc: 'PC retrô fofinho com cantos arredondados e antena estelar', icon: '⬛' },
  { id: 'triangle', label: 'Triângulo Onigiri', desc: 'Prisma suave estilo bolinho de arroz com nós luminosos', icon: '🔺' },
  { id: 'flower', label: 'Flor Margarida', desc: 'Margarida robótica com 8 pétalas que batem como asinhas', icon: '🌸' },
  { id: 'star', label: 'Estrela Mecha', desc: 'Estrela de 5 pontas com vértices de néon e propulsor', icon: '⭐' },
  { id: 'heart', label: 'Coração Cyber', desc: 'Coração mecânico carismático com bico antigravitacional', icon: '💖' },
  { id: 'mushroom', label: 'Cogumelo Bot', desc: 'Mini-shroom com sensores de bolinhas LED e pezinhos', icon: '🍄' },
  { id: 'capsule', label: 'Cápsula Droid', desc: 'Droide pílula estilo Eve/Minion com visor panorâmico', icon: '💊' },
  { id: 'cloud', label: 'Nuvem Cyber', desc: 'Nuvem fofinha metálica com chuva de propulsores de energia', icon: '☁️' },
  { id: 'diamond', label: 'Diamante Mecha', desc: 'Gema cristalina facetada com cristais orbitais flutuantes', icon: '💎' },
  { id: 'bear', label: 'Ursinho Mecha', desc: 'Urso robô fofinho com orelhinhas redondas, focinho e patinhas', icon: '🧸' },
  { id: 'cat', label: 'Gatinho Mecha', desc: 'Gatinho cibernético com bigodinhos, orelhas e cauda articulada', icon: '🐱' },
  { id: 'ufo', label: 'Mini Disco Voador', desc: 'OVNI mecha fofo com cúpula de vidro, luzes e raio trator', icon: '🛸' },
];

const MATERIALS: { id: RobotMaterial; label: string; desc: string; previewColor: string }[] = [
  { id: 'candy_pink', label: 'Rosa Sakura', desc: 'Glossy pastel doce com verniz brilhante', previewColor: '#ffb6db' },
  { id: 'mint_cream', label: 'Menta Chibi', desc: 'Verde menta suave com toque cerâmico', previewColor: '#a7f3d0' },
  { id: 'pearl_white', label: 'Branco Pérola', desc: 'Cerâmica ultra-brilhante estilo Baymax/Eve', previewColor: '#ffffff' },
  { id: 'titanium', label: 'Titânio Escovado', desc: 'Metal nobre escovado com reflexos suaves', previewColor: '#8892a0' },
  { id: 'carbon', label: 'Fibra de Carbono', desc: 'Trama de compósito com alto contraste', previewColor: '#1e2229' },
  { id: 'chrome', label: 'Cromo Espelhado', desc: 'Metal líquido polido reflexivo', previewColor: '#e2e8f0' },
  { id: 'mecha_white', label: 'Mecha White', desc: 'Blindagem branca anime com decalques', previewColor: '#f1f5f9' },
  { id: 'stealth_onyx', label: 'Stealth Onyx', desc: 'Chassi preto com circuitos de néon', previewColor: '#090b0e' },
  { id: 'copper', label: 'Cobre / Bronze', desc: 'Liga metálica quente acobreada', previewColor: '#dd7e3b' },
];

const NEON_COLORS: { color: NeonColor; label: string }[] = [
  { color: '#ff70a6', label: 'Rosa Sakura' },
  { color: '#70d6ff', label: 'Azul Céu / Menta' },
  { color: '#ffd670', label: 'Amarelo Doce' },
  { color: '#c77dff', label: 'Lavanda Sonho' },
  { color: '#00f0ff', label: 'Ciano Quântico' },
  { color: '#ff007f', label: 'Rosa Choque' },
  { color: '#39ff14', label: 'Verde Néon' },
  { color: '#ffffff', label: 'Branco Puro' },
];

const EYE_STYLES: { id: EyeStyle; label: string; desc: string }[] = [
  { id: 'kawaii_sparkle', label: 'Brilho Kawaii', desc: 'Olhos grandes com estrelas brilhantes e cílios mecha' },
  { id: 'anime_led', label: 'Anime Mecha', desc: 'Pupila viva com brilho duplo que segue seu olhar' },
  { id: 'heart_eyes', label: 'Olhos de Coração', desc: 'Corações cor-de-rosa pulsantes super fofos' },
  { id: 'cute_arcs', label: 'Arcos Chibi', desc: 'Cápsulas arredondadas minimalistas e expressivas' },
  { id: 'visor', label: 'Visor Contínuo', desc: 'Barra horizontal moderna e luminosa' },
  { id: 'pixel_dots', label: 'Matriz de Pixels', desc: 'LEDs retrô estilo console portátil' },
  { id: 'goggles', label: 'Lentes Ópticas', desc: 'Lentes circulares com retículo de mira' },
];

const MOUTH_STYLES: { id: MouthStyle; label: string; desc: string }[] = [
  { id: 'chibi_cat', label: 'Boquinha :3 (Gatinho)', desc: 'Boca anime de gato fofa que abre e sorri com você' },
  { id: 'chibi_smile', label: 'Sorriso Suave', desc: 'Arco delicado que reflete suas expressões em tempo real' },
  { id: 'neon_arc', label: 'Arco Dinâmico', desc: 'Linha néon viva que expande com a fala' },
  { id: 'waveform', label: 'Equalizador de Voz', desc: 'Barras sonoras que dançam no ritmo da sua voz' },
  { id: 'mechanical_aperture', label: 'Íris Mecânica', desc: 'Abertura de câmera mecânica com diafragma' },
];

const ACCESSORIES: { id: AccessoryType; label: string; desc: string }[] = [
  { id: 'none', label: 'Nenhum', desc: 'Silhueta pura e limpa' },
  { id: 'bunny_ears', label: 'Orelhinhas de Coelho', desc: 'Orelhas compridas mecha que balançam com a cabeça' },
  { id: 'cat_ears', label: 'Orelhas Mecha Neko', desc: 'Orelhas de gatinho com brilho rosa interno' },
  { id: 'angel_wings', label: 'Asinhas de Anjo', desc: 'Asinhas mecânicas nas costas que batem suavemente' },
  { id: 'heart_antenna', label: 'Antena de Coração', desc: 'Coraçãozinho com mola que se move no topo' },
  { id: 'star_halo', label: 'Halo de Estrelas', desc: 'Aro flutuante com mini estrelas de energia' },
  { id: 'headphones', label: 'Headset Gatinho', desc: 'Fones de ouvido com orelhas luminosas' },
  { id: 'satellites', label: 'Drones Satélites', desc: 'Pequenas sondas carismáticas que orbitam o avatar' },
];

const EMOTIONS: { id: EmotionState; label: string; icon: string }[] = [
  { id: 'neutral', label: 'Neutro', icon: '😐' },
  { id: 'happy', label: 'Feliz', icon: '😄' },
  { id: 'excited', label: 'Empolgado', icon: '🤩' },
  { id: 'love', label: 'Apaixonado', icon: '🥰' },
  { id: 'blush', label: 'Corado', icon: '😊' },
  { id: 'wink', label: 'Piscar', icon: '😉' },
  { id: 'smug', label: 'Travesso', icon: '😼' },
  { id: 'thinking', label: 'Pensativo', icon: '🤔' },
  { id: 'surprised', label: 'Surpreso', icon: '😲' },
  { id: 'cool', label: 'Cool', icon: '😎' },
  { id: 'sleepy', label: 'Com Sono', icon: '😴' },
  { id: 'crying_tears', label: 'Chorando', icon: '😭' },
  { id: 'dizzy', label: 'Tonto', icon: '😵‍💫' },
  { id: 'shocked', label: 'Chocado', icon: '😱' },
  { id: 'angry', label: 'Bravo', icon: '😠' },
];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  config,
  onChange,
  currentEmotion,
  onEmotionChange,
}) => {
  const update = (partial: Partial<AvatarConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-8 bg-slate-950/70">
      {/* 1. Escolha da Forma Principal */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Forma do Avatar
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Escolha o corpo do avatar. Todos os modelos reagem aos seus olhos, boca e inclinação da cabeça!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {SHAPES.map((s) => {
            const isSelected = config.shape === s.id;
            return (
              <button
                key={s.id}
                onClick={() => update({ shape: s.id })}
                className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-pink-400 shadow-lg shadow-pink-950/50 ring-1 ring-pink-400'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100 truncate">{s.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-pink-400 shrink-0 ml-1" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Textura & Acabamento Robótico */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Textura & Acabamento Fofinho
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MATERIALS.map((m) => {
            const isSelected = config.material === m.id;
            return (
              <button
                key={m.id}
                onClick={() => update({ material: m.id })}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-pink-400 shadow-md ring-1 ring-pink-400'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg border border-slate-700/80 shrink-0 shadow-inner"
                  style={{ backgroundColor: m.previewColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">{m.label}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Cor do Néon / Visor */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.neonColor }} />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Cor do LED & Brilho do Visor
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{config.neonColor}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {NEON_COLORS.map((nc) => {
            const isSelected = config.neonColor === nc.color;
            return (
              <button
                key={nc.color}
                onClick={() => update({ neonColor: nc.color })}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-slate-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{
                    backgroundColor: nc.color,
                    boxShadow: isSelected ? `0 0 12px ${nc.color}` : 'none',
                  }}
                />
                <span className="text-xs font-medium text-slate-300">{nc.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Estilo dos Olhos e Boca Robótica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Olhos */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Design dos Olhos (Segue seu Olhar)
            </h2>
          </div>
          <div className="space-y-2">
            {EYE_STYLES.map((es) => {
              const isSelected = config.eyeStyle === es.id;
              return (
                <button
                  key={es.id}
                  onClick={() => update({ eyeStyle: es.id })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-pink-400 ring-1 ring-pink-400'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{es.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{es.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-pink-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Boca */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Boca (Segue sua Fala & Sorriso)
            </h2>
          </div>
          <div className="space-y-2">
            {MOUTH_STYLES.map((ms) => {
              const isSelected = config.mouthStyle === ms.id;
              return (
                <button
                  key={ms.id}
                  onClick={() => update({ mouthStyle: ms.id })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-pink-400 ring-1 ring-pink-400'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{ms.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{ms.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-pink-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5. Acessórios e Gadgets */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
            Acessórios & Fofuras
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACCESSORIES.map((acc) => {
            const isSelected = config.accessory === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => update({ accessory: acc.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-pink-400 ring-1 ring-pink-400'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200 truncate">{acc.label}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{acc.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. Disparadores Rápidos de Emoção (Emotes) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Expressões Rápidas (Emotes)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Clique para forçar uma pose fofinha</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((emo) => {
            const isSelected = currentEmotion === emo.id;
            return (
              <button
                key={emo.id}
                onClick={() => onEmotionChange(emo.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-pink-950/80 border-pink-400 text-pink-300 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{emo.icon}</span>
                <span>{emo.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Enquadramento da Câmera (Corpo Inteiro vs Busto) */}
      <section className="space-y-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🧍</span>
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Enquadramento do Avatar
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {config.cameraViewMode === 'portrait' ? 'Modo Busto' : 'Corpo Inteiro'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => update({ cameraViewMode: 'full_body', cameraZoom: 0.9 })}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              (config.cameraViewMode || 'full_body') === 'full_body'
                ? 'bg-slate-900 border-pink-400 ring-1 ring-pink-400 shadow-md'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>🧍</span>
              <span>Corpo Inteiro</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Visualiza o avatar completo, incluindo asinhas, propulsores, patinhas e sombra.
            </p>
          </button>

          <button
            onClick={() => update({ cameraViewMode: 'portrait', cameraZoom: 1.15 })}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              config.cameraViewMode === 'portrait'
                ? 'bg-slate-900 border-pink-400 ring-1 ring-pink-400 shadow-md'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>👤</span>
              <span>Busto / Rosto</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Enquadramento mais aproximado focado nos olhos e na boca do avatar.
            </p>
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Distância / Zoom da Câmera</span>
            <span className="font-mono text-cyan-400 tabular-nums">
              {Math.round((config.cameraZoom || 0.9) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.6"
            step="0.05"
            value={config.cameraZoom || 0.9}
            onChange={(e) => update({ cameraZoom: parseFloat(e.target.value) })}
            className="w-full accent-pink-400 cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};
