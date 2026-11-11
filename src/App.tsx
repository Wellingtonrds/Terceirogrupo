import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Send, 
  Tv, 
  Upload, 
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Settings,
  MessageSquare,
  HelpCircle,
  Video,
  Cloud,
  Database,
  Folder,
  FolderOpen,
  Chrome,
  LogOut,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Play,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Smartphone,
  Tablet,
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  Radio,
  CheckCircle2,
  RefreshCw,
  Sliders
} from "lucide-react";
import { Trigger } from "./types";
import BioVines from "./components/BioVines";
import EcoDrones from "./components/EcoDrones";
import { BranchLogo } from "./components/BranchLogo";

interface CustomQuestion {
  id: string;
  phrase: string;
  videoUrl: string;
  videoName: string;
}

export type VideoQualityPreference = "hd1080" | "hd720" | "large" | "medium" | "auto";

// Helper to extract YouTube Video ID from any format (standard, short, embed, shorts)
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return Boolean(getYouTubeVideoId(url));
}

// Vídeos e Gatilhos Fixos do Assistente de Taiga gravados diretamente no código
export const DEFAULT_INTRO_URL = "https://youtu.be/LurY80QqKsw";
export const DEFAULT_INTRO_NAME = "Bioma da Taiga";

export const DEFAULT_QUESTIONS: CustomQuestion[] = [
  { 
    id: "trigger_animais_taiga", 
    phrase: "Me fale dos animais de Taiga", 
    videoUrl: "https://youtu.be/VD0OG7O8Tik", 
    videoName: "Animais de Taiga" 
  },
  { 
    id: "trigger_preservar_taiga", 
    phrase: "Como preservar a Taiga?", 
    videoUrl: "https://youtu.be/RKgBAKq_olM", 
    videoName: "Como Preservar a Taiga" 
  },
  { 
    id: "trigger_ameacas_taiga", 
    phrase: "Ameaças da Taiga", 
    videoUrl: "https://youtu.be/FF8MgZxuXRY", 
    videoName: "Ameaças da Taiga" 
  },
  { 
    id: "trigger_futuro_taiga", 
    phrase: "Taiga no futuro", 
    videoUrl: "https://youtu.be/n2HsvkQ8YzQ", 
    videoName: "Taiga no Futuro" 
  },
  { 
    id: "trigger_bioma_taiga", 
    phrase: "Bioma da Taiga", 
    videoUrl: "https://youtu.be/LurY80QqKsw", 
    videoName: "Bioma da Taiga" 
  }
];

export default function App() {
  // Navigation: state to change between the interactive screen "chat" and "settings"
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat");

  // Dynamic Questions List State - Gravado diretamente no código para persistência fixa em qualquer dispositivo
  const [questions, setQuestions] = useState<CustomQuestion[]>(() => {
    try {
      const CURRENT_VERSION = "v_taiga_fixed_bw_2026_v3";
      const savedVersion = localStorage.getItem("eco_questions_version");
      
      // Se a versão for a atual e houver dados salvos, carrega
      if (savedVersion === CURRENT_VERSION) {
        const saved = localStorage.getItem("eco_custom_questions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } else {
        // Inicializa ou atualiza imediatamente para os gatilhos fixos gravados no código
        localStorage.setItem("eco_questions_version", CURRENT_VERSION);
        localStorage.setItem("eco_custom_questions", JSON.stringify(DEFAULT_QUESTIONS));
        return DEFAULT_QUESTIONS;
      }
    } catch (e) {
      console.error("Failed to load eco_custom_questions:", e);
    }

    return DEFAULT_QUESTIONS;
  });

  // URLs for video playback (YouTube link, web URL, or local file)
  const [introUrl, setIntroUrl] = useState<string>(() => {
    try {
      const CURRENT_VERSION = "v_taiga_fixed_bw_2026_v3";
      const savedVersion = localStorage.getItem("eco_questions_version");
      if (savedVersion !== CURRENT_VERSION) {
        localStorage.setItem("eco_intro_url", DEFAULT_INTRO_URL);
        return DEFAULT_INTRO_URL;
      }
      const saved = localStorage.getItem("eco_intro_url");
      if (saved && saved.includes("LurY80QqKsw")) return saved;
      localStorage.setItem("eco_intro_url", DEFAULT_INTRO_URL);
    } catch (_) {}
    return DEFAULT_INTRO_URL;
  });
  const [introName, setIntroName] = useState(() => {
    try {
      const CURRENT_VERSION = "v_taiga_fixed_bw_2026_v3";
      const savedVersion = localStorage.getItem("eco_questions_version");
      if (savedVersion !== CURRENT_VERSION) {
        localStorage.setItem("eco_intro_name", DEFAULT_INTRO_NAME);
        return DEFAULT_INTRO_NAME;
      }
      const saved = localStorage.getItem("eco_intro_name");
      if (saved) return saved;
      localStorage.setItem("eco_intro_name", DEFAULT_INTRO_NAME);
    } catch (_) {}
    return DEFAULT_INTRO_NAME;
  });

  // Eager sync hook to ensure the official presentation video (https://youtu.be/LurY80QqKsw) is active on launch
  useEffect(() => {
    const CURRENT_VERSION = "v_taiga_fixed_bw_2026_v3";
    const savedVersion = localStorage.getItem("eco_questions_version");
    const savedIntro = localStorage.getItem("eco_intro_url");
    if (savedVersion !== CURRENT_VERSION || !savedIntro || !savedIntro.includes("LurY80QqKsw") || !introUrl || !introUrl.includes("LurY80QqKsw")) {
      setIntroUrl(DEFAULT_INTRO_URL);
      setIntroName(DEFAULT_INTRO_NAME);
      try {
        localStorage.setItem("eco_questions_version", CURRENT_VERSION);
        localStorage.setItem("eco_intro_url", DEFAULT_INTRO_URL);
        localStorage.setItem("eco_intro_name", DEFAULT_INTRO_NAME);
        localStorage.setItem("eco_custom_questions", JSON.stringify(DEFAULT_QUESTIONS));
      } catch (_) {}
    }
  }, [introUrl]);

  // Active slot corresponds to either "intro" or any question id
  const [activeVideoSlot, setActiveVideoSlot] = useState<string>("intro");
  const [ytReloadKey, setYtReloadKey] = useState<number>(0);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Chat conversation state
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSpeechDetected, setLastSpeechDetected] = useState<string>("");
  const [realtimeSpeech, setRealtimeSpeech] = useState<string>("");
  const [speechError, setSpeechError] = useState("");
  const [aiResponseText, setAiResponseText] = useState<string>(
    "Canal pronto. Clique no microfone ou digite abaixo para falar um dos comandos configurados."
  );

  // Playback settings
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlayError, setVideoPlayError] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [showReplayPrompt, setShowReplayPrompt] = useState(false);
  const [viewedSlots, setViewedSlots] = useState<string[]>([]);
  const [videoFinished, setVideoFinished] = useState<boolean>(false);
  // Video starts when the user clicks "Iniciar Apresentação"
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Advanced Microphone & Audio States (for 100% Mobile & Desktop Compatibility)
  const [isRecordingMedia, setIsRecordingMedia] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied" | "prompt" | "unsupported">("unknown");
  const [showMicModal, setShowMicModal] = useState<boolean>(false);
  const [preferredSpeechEngine, setPreferredSpeechEngine] = useState<"auto" | "gemini" | "native">(() => {
    const saved = localStorage.getItem("eco_speech_engine");
    if (saved === "gemini" || saved === "native" || saved === "auto") return saved;
    return "auto";
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<any>(null);
  const autoStopTimeoutRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Mobile, Tablet & Fullscreen States
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 && window.innerWidth <= 1024;
    }
    return false;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [mobileFullscreenAuto, setMobileFullscreenAuto] = useState<boolean>(() => {
    const saved = localStorage.getItem("eco_mobile_fullscreen_auto");
    return saved !== null ? saved === "true" : true;
  });

  const [videoFit, setVideoFit] = useState<"contain" | "cover">(() => {
    const saved = localStorage.getItem("eco_video_fit");
    if (saved === "contain" || saved === "cover") return saved;
    // Padrão: Preencher a tela (especialmente no mobile conforme solicitado)
    return "cover";
  });

  // Quality Configuration States (1080p, 720p, 480p, 360p, auto)
  const [preferredVideoQuality, setPreferredVideoQuality] = useState<VideoQualityPreference>(() => {
    const saved = localStorage.getItem("eco_video_quality");
    if (saved === "hd1080" || saved === "hd720" || saved === "large" || saved === "medium" || saved === "auto") {
      return saved as VideoQualityPreference;
    }
    return "hd1080";
  });

  const preferredVideoQualityRef = useRef<VideoQualityPreference>(preferredVideoQuality);

  useEffect(() => {
    preferredVideoQualityRef.current = preferredVideoQuality;
    localStorage.setItem("eco_video_quality", preferredVideoQuality);
  }, [preferredVideoQuality]);

  // Extension Module: Force 1080p Only Lock Extension ("Extensão 1080p Only")
  const [force1080pOnly, setForce1080pOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem("eco_force_1080p_only");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("eco_force_1080p_only", String(force1080pOnly));
    if (force1080pOnly) {
      setPreferredVideoQuality("hd1080");
    }
  }, [force1080pOnly]);

  // Active Extension Watcher: Intercepts playback and locks resolution to 1080p continuously
  useEffect(() => {
    if (!force1080pOnly || !hasStarted || videoFinished) return;
    const interval = setInterval(() => {
      enforceYtQuality("hd1080");
    }, 1200);
    return () => clearInterval(interval);
  }, [force1080pOnly, hasStarted, videoFinished, activeVideoSlot]);

  useEffect(() => {
    localStorage.setItem("eco_video_fit", videoFit);
  }, [videoFit]);

  useEffect(() => {
    localStorage.setItem("eco_mobile_fullscreen_auto", String(mobileFullscreenAuto));
  }, [mobileFullscreenAuto]);

  useEffect(() => {
    localStorage.setItem("eco_speech_engine", preferredSpeechEngine);
  }, [preferredSpeechEngine]);

  // Check initial microphone permission status if supported by the browser
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.permissions && (navigator.permissions as any).query) {
      try {
        navigator.permissions.query({ name: "microphone" as PermissionName })
          .then((status) => {
            setMicPermission(status.state as any);
            status.onchange = () => {
              setMicPermission(status.state as any);
            };
          })
          .catch(() => {
            setMicPermission("unknown");
          });
      } catch (_) {
        setMicPermission("unknown");
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, [isFullscreen]);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastTapRef = useRef<number>(0);

  // Automatic Fullscreen Management:
  // "Quando o vídeo começar a ferramenta por si só deve colocar o vídeo em tela cheia e depois que terminar voltar para mostrar os gatilhos que podem ser usados, mas sempre depois de uma pergunta o vídeo deve começar em tela cheia"
  const enterFullscreenAuto = async () => {
    setIsFullscreen(true);
    try {
      const container = videoContainerRef.current;
      if (container && !document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen().catch(() => {});
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen().catch(() => {});
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen().catch(() => {});
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen().catch(() => {});
        } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      }
    } catch (err) {
      console.info("Using CSS fixed viewport fullscreen fallback:", err);
    }
  };

  const exitFullscreenAuto = async () => {
    setIsFullscreen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen().catch(() => {});
      }
    } catch (err) {
      console.info("Exit full screen note:", err);
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await enterFullscreenAuto();
    } else {
      await exitFullscreenAuto();
    }
  };

  // Full HD 1080p Canvas Engine:
  // YouTube defaults to 240p when the iframe DOM canvas is rendered at smaller sizes (< 640px).
  // By maintaining an internal 1920x1080 viewport scaled down with CSS transform,
  // YouTube detects a native Full HD 1080p canvas and directly serves the 1080p stream from frame 0.
  const [ytStageScale, setYtStageScale] = useState<number>(1);

  useEffect(() => {
    const updateScale = () => {
      const el = videoContainerRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        const scaleX = w / 1920;
        const scaleY = h / 1080;
        const s = videoFit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
        setYtStageScale(s > 0 ? s : 1);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && videoContainerRef.current) {
      ro = new ResizeObserver(updateScale);
      ro.observe(videoContainerRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
      if (ro) ro.disconnect();
    };
  }, [videoFit, isFullscreen, hasStarted]);

  // Track triggers that have already been played during this session, removing them from available view ("apagando os que já foram utilizados")
  const [usedTriggerIds, setUsedTriggerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("eco_used_trigger_ids");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("eco_used_trigger_ids", JSON.stringify(usedTriggerIds));
    } catch (_) {}
  }, [usedTriggerIds]);

  const restoreUsedTriggers = () => {
    setUsedTriggerIds([]);
    try {
      localStorage.removeItem("eco_used_trigger_ids");
    } catch (_) {}
    setAiResponseText("Ciclo de gatilhos restaurado. Todos os comandos estão disponíveis novamente.");
  };

  // Track playback start time to prevent premature video ended events
  const playStartRef = useRef<number>(Date.now());

  // Helper to enforce user configured resolution automatically on YouTube player (1080p, 720p, etc.)
  const enforceYtQuality = (qualityOverride?: VideoQualityPreference) => {
    const q = qualityOverride || preferredVideoQualityRef.current || preferredVideoQuality;
    const targetQ = q === "auto" ? "hd1080" : q;

    // Send postMessage commands directly to YouTube iframe
    if (ytIframeRef.current?.contentWindow) {
      try {
        const win = ytIframeRef.current.contentWindow;
        // YouTube API: listening handshake so player broadcasts playback state events
        win.postMessage('{"event":"listening","id":1,"channel":"widget"}', '*');
        
        // Command 1: setPlaybackQuality
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setPlaybackQuality",
          args: [targetQ]
        }), '*');

        // Command 2: setPlaybackQualityRange (forces minimum to 1080p)
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setPlaybackQualityRange",
          args: [targetQ, "highres"]
        }), '*');

        // Command 3: setSuggestedQuality
        win.postMessage(JSON.stringify({
          event: "command",
          func: "setSuggestedQuality",
          args: [targetQ]
        }), '*');
      } catch (_) {}
    }
  };

  const enforceYtMaxQuality = enforceYtQuality;

  // Repeatedly pulse the quality command during video start, playback, and buffering so YouTube locks into 1080p resolution automatically
  const triggerQualityAutoPulse = (qualityOverride?: VideoQualityPreference) => {
    enforceYtQuality(qualityOverride);
    const intervals = [50, 150, 300, 600, 1000, 1800, 2800, 4000];
    intervals.forEach(delay => {
      setTimeout(() => {
        enforceYtQuality(qualityOverride);
      }, delay);
    });
  };

  const trigger1080pAutoPulse = triggerQualityAutoPulse;

  // Centralized Video Slot Trigger: Starts any video (question or intro) in FULL SCREEN, resets state, and auto-plays
  const triggerVideoSlot = (slotId: string, announceText?: string) => {
    playStartRef.current = Date.now();
    setHasStarted(true);
    setVideoFinished(false);
    setActiveVideoSlot(slotId);
    setYtReloadKey(prev => prev + 1);
    if (announceText) {
      setAiResponseText(announceText);
    }

    // Mark question trigger as used so it is removed from available triggers
    if (slotId !== "intro") {
      setUsedTriggerIds(prev => prev.includes(slotId) ? prev : [...prev, slotId]);
    }

    // Automatically enter full screen whenever video starts or after a question
    enterFullscreenAuto();

    // Automatically enforce 1080p resolution on start
    trigger1080pAutoPulse();

    setTimeout(() => {
      const currentUrl = slotId === "intro" ? introUrl : (questions.find(q => q.id === slotId)?.videoUrl || "");
      if (!isYouTubeUrl(currentUrl) && videoRef.current) {
        videoRef.current.currentTime = 0;
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.catch(err => console.warn("Video auto-play catch:", err));
        }
      }
    }, 70);
  };

  const handleVideoTouch = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      toggleFullscreen();
    }
    lastTapRef.current = now;
  };

  const [hidePanels, setHidePanels] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Background Image State (Amazon Rainforest Wildlife)
  const [showBgImage, setShowBgImage] = useState<boolean>(() => {
    const saved = localStorage.getItem("eco_show_bg_image");
    return saved !== null ? saved === "true" : true;
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const saved = localStorage.getItem("eco_bg_opacity");
    return saved !== null ? Number(saved) : 35;
  });

  useEffect(() => {
    localStorage.setItem("eco_show_bg_image", String(showBgImage));
  }, [showBgImage]);

  useEffect(() => {
    localStorage.setItem("eco_bg_opacity", String(bgOpacity));
  }, [bgOpacity]);

  // Trepadeiras & Drones de Monitoramento Eco-Design
  const [showVines, setShowVines] = useState<boolean>(() => {
    const saved = localStorage.getItem("eco_show_vines");
    return saved !== null ? saved === "true" : true;
  });
  const [showDrones, setShowDrones] = useState<boolean>(() => {
    const saved = localStorage.getItem("eco_show_drones");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("eco_show_vines", String(showVines));
  }, [showVines]);

  useEffect(() => {
    localStorage.setItem("eco_show_drones", String(showDrones));
  }, [showDrones]);

  // Web Speech API references
  const recognitionRef = useRef<any>(null);

  // Helper helper to clean and evaluate similarity between recognized text and target phrases
  const getFuzzyMatchScore = (input: string, targetPhrase: string): number => {
    if (!input || !targetPhrase) return 0;
    
    const cleanString = (s: string) => {
      return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9\s]/g, "") // remove punctuation
        .trim();
    };

    const inputClean = cleanString(input);
    const targetClean = cleanString(targetPhrase);

    if (!inputClean || !targetClean) return 0;

    // Exact match
    if (inputClean === targetClean) return 1.0;

    // Substring contains
    if (inputClean.includes(targetClean) || targetClean.includes(inputClean)) {
      return 0.95;
    }

    // Split words to see the intersection of keywords (plurals and verb stems)
    const inputWords = inputClean.split(/\s+/).filter(w => w.length > 1);
    const targetWords = targetClean.split(/\s+/).filter(w => w.length > 2);

    if (targetWords.length === 0) return 0;

    let matchCount = 0;
    for (const tWord of targetWords) {
      const matched = inputWords.some(iWord => {
        if (iWord === tWord) return true;
        // Check partial word prefixes to match e.g. "mostra" and "mostrar", "chuva" and "chuvas", etc.
        const minLen = Math.min(tWord.length, iWord.length);
        if (minLen >= 4) {
          const prefixT = tWord.substring(0, 4);
          const prefixI = iWord.substring(0, 4);
          if (prefixT === prefixI) return true;
        }
        return false;
      });
      if (matched) matchCount++;
    }

    return matchCount / targetWords.length;
  };

  // Sync state metadata to localStorage
  useEffect(() => {
    if (introUrl && !introUrl.startsWith("blob:")) {
      localStorage.setItem("eco_intro_url", introUrl);
    }
    localStorage.setItem("eco_intro_name", introName);
    
    const configToSave = questions.map(q => ({
      id: q.id,
      phrase: q.phrase,
      videoUrl: q.videoUrl && !q.videoUrl.startsWith("blob:") ? q.videoUrl : "",
      videoName: q.videoName
    }));
    localStorage.setItem("eco_custom_questions", JSON.stringify(configToSave));
  }, [questions, introUrl, introName]);

  // Handle ended event for both YouTube and direct HTML5 videos
  const handleVideoEnded = () => {
    setVideoFinished(true);
    setShowReplayPrompt(true);
    setViewedSlots((prev) => {
      if (prev.includes(activeVideoSlot)) return prev;
      return [...prev, activeVideoSlot];
    });
  };

  const handleReplayVideo = () => {
    playStartRef.current = Date.now();
    setVideoFinished(false);
    enterFullscreenAuto();
    const currentUrl = getActiveVideoUrl();
    const ytId = getYouTubeVideoId(currentUrl);
    if (ytId) {
      setYtReloadKey(prev => prev + 1);
      trigger1080pAutoPulse();
      if (ytIframeRef.current?.contentWindow) {
        try {
          ytIframeRef.current.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
          ytIframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          enforceYtMaxQuality();
        } catch (_) {}
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn("Failed to play: ", err));
      }
    }
  };

  // Listen to YouTube postMessage events for auto-ended state detection and 1080p quality enforcement
  useEffect(() => {
    const handleYtMessage = (event: MessageEvent) => {
      try {
        let payload: any = event.data;
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch (_) {
            return;
          }
        }
        if (payload) {
          // When YouTube player reports ready, listening, or transitions to playing (1) or buffering (3)
          if (
            payload.event === "onReady" ||
            payload.event === "initialDelivery" ||
            payload.event === "listening" ||
            payload.info === 1 ||
            payload.info === 3 ||
            (payload.info && (payload.info.playerState === 1 || payload.info.playerState === 3))
          ) {
            enforceYtMaxQuality();
          }

          // YouTube API onStateChange: 0 is ENDED (Video finished)
          // Guard: Only allow ended state after at least 3.5 seconds of playback to prevent false triggers during video initialization
          const elapsed = Date.now() - playStartRef.current;
          if (elapsed > 3500) {
            const isEnded = 
              (payload.event === "onStateChange" && (payload.info === 0 || payload.data === 0)) ||
              (payload.info && payload.info.playerState === 0) ||
              (payload.data && payload.data.playerState === 0) ||
              (payload.info && typeof payload.info.currentTime === "number" && typeof payload.info.duration === "number" && payload.info.duration > 3 && payload.info.currentTime >= payload.info.duration - 0.75);

            if (isEnded) {
              handleVideoEnded();
            }
          }
        }
      } catch (_) {}
    };

    window.addEventListener("message", handleYtMessage);
    return () => window.removeEventListener("message", handleYtMessage);
  }, [activeVideoSlot]);

  // Sync mute to YouTube iframe via postMessage
  useEffect(() => {
    if (ytIframeRef.current?.contentWindow) {
      try {
        const cmd = videoMuted ? "mute" : "unMute";
        ytIframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${cmd}","args":""}`, '*');
        enforceYtMaxQuality();
      } catch (_) {}
    }
  }, [videoMuted, ytReloadKey]);

  // Keyboard shortcut: Escape key allows concluding/skipping video early (ideal for testing & presentations)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && hasStarted && !videoFinished) {
        handleVideoEnded();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted, videoFinished]);

  // Dynamic audio and speech recognition lifecycle is managed on-demand via toggleListening

  // Play and reload helper triggered on video changes
  const activeVideoUrl = (() => {
    if (activeVideoSlot === "intro") {
      return introUrl;
    }
    const match = questions.find(q => q.id === activeVideoSlot);
    if (match) {
      return match.videoUrl;
    }
    return "";
  })();

  useEffect(() => {
    playStartRef.current = Date.now();
    setShowReplayPrompt(false);
    setVideoFinished(false);
    const currentUrl = activeVideoUrl;
    const isYt = isYouTubeUrl(currentUrl);

    if (isYt) {
      setVideoPlayError("");
      setYtReloadKey(prev => prev + 1);
    } else if (videoRef.current) {
      const v = videoRef.current;
      setVideoPlayError("");
      try {
        v.load();
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Automatic play delayed/prevented:", err);
          });
        }
      } catch (err) {
        console.error("Video load error:", err);
      }
    }
  }, [activeVideoSlot, activeVideoUrl]);

  // Handle URL input for any trigger slot (YouTube, direct MP4, etc.)
  const handleUrlChange = (slotId: string, url: string) => {
    const trimmed = url.trim();
    const isYt = isYouTubeUrl(trimmed);
    const ytId = getYouTubeVideoId(trimmed);
    const autoName = isYt ? `YouTube [${ytId}]` : (trimmed ? "Vídeo Web" : "");

    if (slotId === "intro") {
      setIntroUrl(trimmed);
      if (trimmed) {
        setIntroName(autoName || "Apresentação Inicial");
      }
      setActiveVideoSlot("intro");
    } else {
      setQuestions(prev => prev.map(q => {
        if (q.id === slotId) {
          return {
            ...q,
            videoUrl: trimmed,
            videoName: trimmed ? (autoName || q.videoName || "Vídeo Configurado") : ""
          };
        }
        return q;
      }));
      setActiveVideoSlot(slotId);
    }
  };

  // Handle local video files selection
  const handleFileChange = (slotId: string, file: File) => {
    const url = URL.createObjectURL(file);
    if (slotId === "intro") {
      setIntroUrl(url);
      setIntroName(file.name);
      setActiveVideoSlot("intro");
    } else {
      setQuestions(prev => prev.map(q => {
        if (q.id === slotId) {
          return { ...q, videoUrl: url, videoName: file.name };
        }
        return q;
      }));
      setActiveVideoSlot(slotId);
    }
  };

  // Add questions helper with default YouTube video
  const addQuestion = () => {
    const newId = `trigger_${Date.now()}`;
    setQuestions(prev => [
      ...prev,
      {
        id: newId,
        phrase: `nova pergunta sobre a Taiga ${prev.length + 1}`,
        videoUrl: DEFAULT_INTRO_URL,
        videoName: "Vídeo Taiga"
      }
    ]);
  };

  // Remove question helper
  const removeQuestion = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Excluir Gatilho",
      message: "Deseja mesmo excluir este gatilho de ativação por voz? Essa ação não pode ser desfeita.",
      onConfirm: () => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        if (activeVideoSlot === id) {
          setActiveVideoSlot("intro");
        }
      }
    });
  };

  const updateQuestionPhrase = (id: string, phrase: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, phrase };
      }
      return q;
    }));
  };

  const getActiveVideoUrl = () => {
    return activeVideoUrl;
  };

  const getActiveVideoTitle = () => {
    if (activeVideoSlot === "intro") return `APRESENTAÇÃO INICIAL: ${introName || "Vídeo"}`;
    const match = questions.find(q => q.id === activeVideoSlot);
    if (match) {
      return `PROJEÇÃO: ${match.phrase.toUpperCase()} (${match.videoName || "Vídeo"})`;
    }
    return "APRESENTAÇÃO INICIAL";
  };

  const isIntroSpecialVideo = activeVideoSlot === "intro" && (
    introName === "WhatsApp Video 2026-06-12 at 08.35.25.mp4" ||
    introName === "WhatsApp Video 2026-06-12 at 08.35.25" ||
    introName?.includes("WhatsApp Video 2026-06-12 at 08.35.25.mp4") ||
    getActiveVideoTitle() === "APRESENTAÇÃO INICIAL: WhatsApp Video 2026-06-12 at 08.35.25.mp4"
  );

  const playableSlots = [
    ...(introUrl ? ["intro"] : []),
    ...questions.filter(q => q.videoUrl).map(q => q.id)
  ];

  const allVideosPlayed = playableSlots.length > 0 && playableSlots.every(slot => viewedSlots.includes(slot));

  const resetAllTriggers = () => {
    setConfirmModal({
      isOpen: true,
      title: "Redefinir Tudo",
      message: "Deseja restaurar todos os vídeos e gatilhos para os links padrão gravados diretamente no código?",
      onConfirm: () => {
        setIntroUrl(DEFAULT_INTRO_URL);
        setIntroName(DEFAULT_INTRO_NAME);
        setQuestions(DEFAULT_QUESTIONS);
        setActiveVideoSlot("intro");
        setLastSpeechDetected("");
        setRealtimeSpeech("");
        setUsedTriggerIds([]);
        setViewedSlots([]);
        try {
          localStorage.setItem("eco_custom_questions", JSON.stringify(DEFAULT_QUESTIONS));
          localStorage.setItem("eco_intro_url", DEFAULT_INTRO_URL);
          localStorage.setItem("eco_intro_name", DEFAULT_INTRO_NAME);
          localStorage.removeItem("eco_used_trigger_ids");
        } catch (_) {}
        setAiResponseText("Ajustes redefinidos para os gatilhos e links padrão gravados no código.");
      }
    });
  };

  const resetToCodeDefaults = () => {
    setIntroUrl(DEFAULT_INTRO_URL);
    setIntroName(DEFAULT_INTRO_NAME);
    setQuestions(DEFAULT_QUESTIONS);
    setActiveVideoSlot("intro");
    setUsedTriggerIds([]);
    setViewedSlots([]);
    try {
      localStorage.setItem("eco_custom_questions", JSON.stringify(DEFAULT_QUESTIONS));
      localStorage.setItem("eco_intro_url", DEFAULT_INTRO_URL);
      localStorage.setItem("eco_intro_name", DEFAULT_INTRO_NAME);
      localStorage.removeItem("eco_used_trigger_ids");
    } catch (_) {}
    setAiResponseText("Gatilhos gravados no código restaurados com sucesso em alta definição 1080p.");
  };

  // Main voice commander parser & matcher to trigger projection shifts
  const handleIncomingCommand = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const lowerText = trimmed.toLowerCase();

    // Hands-free voice commands requested by the user
    if (
      lowerText.includes("rever") || 
      lowerText.includes("reassistir") || 
      lowerText.includes("reproduzir novamente") || 
      lowerText.includes("ver de novo") ||
      lowerText.includes("rever video") ||
      lowerText.includes("rever vídeo")
    ) {
      handleReplayVideo();
      setAiResponseText("Vídeo reiniciado via comando de voz.");
      setIsAnalyzing(false);
      return;
    }

    if (
      lowerText.includes("iniciar do zero") || 
      lowerText.includes("iniciar do xzero") || 
      lowerText.includes("reiniciar") || 
      lowerText.includes("do zero") || 
      lowerText.includes("do xzero") || 
      lowerText.includes("iniciar do o0") || 
      lowerText.includes("do o0") ||
      lowerText.includes("começar do zero")
    ) {
      setViewedSlots([]);
      setUsedTriggerIds([]);
      try { localStorage.removeItem("eco_used_trigger_ids"); } catch (_) {}
      triggerVideoSlot("intro", "Visita reiniciada do zero. Todos os gatilhos foram reativados.");
      setIsAnalyzing(false);
      return;
    }

    if (
      lowerText.includes("restaurar gatilhos") || 
      lowerText.includes("reiniciar gatilhos") || 
      lowerText.includes("reativar gatilhos") || 
      lowerText.includes("zerar gatilhos") ||
      lowerText.includes("limpar gatilhos")
    ) {
      restoreUsedTriggers();
      setIsAnalyzing(false);
      return;
    }

    setLastSpeechDetected(trimmed);
    setInputText("");
    setIsAnalyzing(true);
    setSpeechError("");

    const virtualTriggers: Trigger[] = [
      { id: "intro", phrase: "introdução", videoUrl: introUrl, description: "Introdução ou início" },
      ...questions.map(q => ({
        id: q.id,
        phrase: q.phrase,
        videoUrl: q.videoUrl,
        description: `Pergunta: ${q.phrase}`
      }))
    ];

    try {
      // Calculate direct alignment scores with our optimized fuzzy word matcher across all triggers configured in settings
      const poolToTest = questions;
      const scores = poolToTest.map(q => ({
        id: q.id,
        phrase: q.phrase,
        score: getFuzzyMatchScore(trimmed, q.phrase)
      }));

      // Common phrases for intro/home/reset
      const introPhrases = ["introducao", "introdução", "inicio", "iniciar", "voltar", "comeco", "começo", "começar", "apresentação"];
      const scoreIntro = Math.max(...introPhrases.map(p => getFuzzyMatchScore(trimmed, p)));

      // Find the highest score among questions
      const bestMatch = scores.reduce((best, curr) => curr.score > best.score ? curr : best, { id: "", phrase: "", score: 0 });

      console.log(`[Scores] Best Match: "${bestMatch.phrase}" (${bestMatch.score}) | Intro: ${scoreIntro}`);

      // We privilege clear fuzzy score matches over contacting a server (keeps app instantaneous if confident)
      if (bestMatch.score >= 0.5 && bestMatch.score >= scoreIntro) {
        triggerVideoSlot(bestMatch.id, `[Sintonia] Pergunta correspondida! Transmitindo Vídeo em tela cheia: "${bestMatch.phrase}"`);
        setIsAnalyzing(false);
        return;
      } else if (scoreIntro >= 0.5 && scoreIntro >= bestMatch.score) {
        triggerVideoSlot("intro", "[Sintonia] Voltando à apresentação inicial em tela cheia.");
        setIsAnalyzing(false);
        return;
      }

      // Query server for smart fallback matching if fuzzy metrics are ambiguous
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          triggers: virtualTriggers
        })
      });

      if (!response.ok) {
        throw new Error("Erro de resposta do servidor de análise.");
      }

      const result = await response.json();
      const matchedId = result.matchedTriggerId;
      
      if (matchedId === "intro") {
        triggerVideoSlot("intro", result.response || "Comando de retorno correspondido. Sintonizando introdução inicial em tela cheia.");
      } else if (matchedId) {
        const matchedQuestion = questions.find(q => q.id === matchedId);
        if (matchedQuestion) {
          triggerVideoSlot(matchedId, result.response || `Entendi! Sintonizando o Vídeo em tela cheia: "${matchedQuestion.phrase}"`);
        } else {
          setAiResponseText(`Comando não identificado. Por favor, fale um comando configurado.`);
        }
      } else {
        const phrasesList = questions.map(q => `"${q.phrase}"`).join(" ou ");
        setAiResponseText(`Comando não identificado. Por favor, fale um comando configurado: ${phrasesList}.`);
      }

    } catch (err) {
      // Local strict offline fallback matcher
      const scores = questions.map(q => ({
        id: q.id,
        phrase: q.phrase,
        score: getFuzzyMatchScore(trimmed, q.phrase)
      }));
      const bestMatch = scores.reduce((best, curr) => curr.score > best.score ? curr : best, { id: "", phrase: "", score: 0 });

      if (bestMatch.score > 0.35) {
        triggerVideoSlot(bestMatch.id, `[Sintonizado] Transmitindo em tela cheia: "${bestMatch.phrase}"`);
      } else {
        const phrasesList = questions.map(q => `"${q.phrase}"`).join(" ou ");
        setAiResponseText(`Não foi possível compreender "${trimmed}". Diga exatamente ${phrasesList}.`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Request microphone permission explicitly (triggers browser dialog on mobile iOS/Android)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError("Navegador não possui suporte para acesso ao microfone.");
        setMicPermission("unsupported");
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      setMicPermission("granted");
      setSpeechError("");
      // Release tracks immediately
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      console.warn("Microphone permission error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Microfone bloqueado pelo navegador. Toque em 'Habilitar Microfone' para liberar.");
        setShowMicModal(true);
      } else {
        setSpeechError(`Erro no microfone: ${err.message || err.name}`);
      }
      return false;
    }
  };

  const cleanupAudioRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (_) {}
      audioStreamRef.current = null;
    }
    setAudioLevel(0);
    setIsRecordingMedia(false);
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Error stopping MediaRecorder:", err);
        cleanupAudioRecording();
        setIsListening(false);
      }
    } else {
      cleanupAudioRecording();
      setIsListening(false);
    }
  };

  const startMediaRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError("Captura de microfone indisponível neste navegador.");
        return;
      }

      setSpeechError("");
      setRealtimeSpeech("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      audioStreamRef.current = stream;
      setMicPermission("granted");
      setIsListening(true);
      setIsRecordingMedia(true);
      setRecordingDuration(0);

      // Real-time audio analyzer for visual sound feedback on mobile
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          const ctx = new AudioCtxClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.5;
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          audioContextRef.current = ctx;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const tickLevel = () => {
            if (!audioStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const level = Math.min(100, Math.round((avg / 120) * 100));
            setAudioLevel(level);
            animationFrameRef.current = requestAnimationFrame(tickLevel);
          };
          tickLevel();
        }
      } catch (e) {
        console.warn("Audio meter setup skipped:", e);
      }

      // Check supported MIME type across mobile devices
      const candidateMimes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
        "audio/ogg;codecs=opus"
      ];
      let selectedMime = "";
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
        for (const m of candidateMimes) {
          if (MediaRecorder.isTypeSupported(m)) {
            selectedMime = m;
            break;
          }
        }
      }

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const recordedMime = recorder.mimeType || selectedMime || "audio/webm";
        const chunks = [...audioChunksRef.current];
        cleanupAudioRecording();
        setIsListening(false);

        if (chunks.length === 0) {
          setSpeechError("Nenhum áudio detectado.");
          return;
        }

        const audioBlob = new Blob(chunks, { type: recordedMime });
        if (audioBlob.size < 400) {
          setSpeechError("Áudio muito curto. Fale um comando como 'Me fale da tecnologia' ou 'Fale dos animais'.");
          return;
        }

        setIsAnalyzing(true);
        setIsTranscribing(true);
        setSpeechError("");

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Data = reader.result as string;
              const res = await fetch("/api/transcribe-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  audioData: base64Data,
                  mimeType: recordedMime
                })
              });

              if (!res.ok) {
                throw new Error(`Servidor retornou status ${res.status}`);
              }

              const data = await res.json();
              setIsTranscribing(false);
              setIsAnalyzing(false);

              if (data.transcript && data.transcript.trim()) {
                const text = data.transcript.trim();
                setLastSpeechDetected(text);
                setRealtimeSpeech("");
                handleIncomingCommand(text);
              } else {
                setSpeechError("Nenhuma fala detectada no áudio gravado. Tente falar mais próximo ao celular.");
              }
            } catch (err: any) {
              console.error("Transcribe API error:", err);
              setIsTranscribing(false);
              setIsAnalyzing(false);
              setSpeechError("Não foi possível transcrever o áudio gravado.");
            }
          };
        } catch (err: any) {
          setIsTranscribing(false);
          setIsAnalyzing(false);
          setSpeechError("Erro ao processar áudio.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);

      // Increment recording duration every second
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Auto stop after 7 seconds if user doesn't tap again
      autoStopTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 7000);

    } catch (err: any) {
      console.warn("MediaRecorder start error:", err);
      cleanupAudioRecording();
      setIsListening(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Acesso ao microfone negado no celular.");
        setShowMicModal(true);
      } else {
        setSpeechError(`Erro ao abrir microfone: ${err.message || err.name}`);
      }
    }
  };

  // Native Web Speech API driver with clean per-session instantiation
  const startListeningNative = (SpeechRecognitionClass: any) => {
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.lang = "pt-BR";
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        setIsRecordingMedia(false);
        setSpeechError("");
        setRealtimeSpeech("");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          setRealtimeSpeech(interimTranscript);
        }

        if (finalTranscript) {
          setLastSpeechDetected(finalTranscript);
          setRealtimeSpeech("");
          setIsListening(false);
          handleIncomingCommand(finalTranscript);
        }
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        setRealtimeSpeech("");
        console.warn("Native SpeechRecognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setMicPermission("denied");
          setSpeechError("Reconhecimento nativo bloqueado. Comutando para gravação de áudio...");
          // Fallback to MediaRecorder on mobile
          startMediaRecording();
        } else if (event.error === "no-speech") {
          setSpeechError("Nenhuma fala detectada. Toque e fale claramente.");
        } else if (event.error === "network") {
          setSpeechError("Rede indisponível no reconhecimento nativo. Comutando para gravação de áudio...");
          startMediaRecording();
        } else {
          setSpeechError(`Aviso do microfone: ${event.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      console.warn("Native SpeechRecognition start failed, falling back to MediaRecorder:", err);
      startMediaRecording();
    }
  };

  // Unified voice listening toggle
  const toggleListening = async () => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isListening || isRecordingMedia) {
      if (isRecordingMedia) {
        stopMediaRecording();
      } else if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    setSpeechError("");
    setRealtimeSpeech("");

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // On mobile devices (iOS/Android), MediaRecorder + Gemini is the 100% reliable path:
    // It triggers the native browser microphone permission dialog instantly on tap without Web Speech drops or silent crashes.
    if (isMobile || preferredSpeechEngine === "gemini" || !SpeechRecognitionClass) {
      await startMediaRecording();
      return;
    }

    // On desktop, verify microphone permission and start native streaming Web Speech
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        setMicPermission("granted");
      }
      startListeningNative(SpeechRecognitionClass);
    } catch (err: any) {
      console.warn("Web Speech pre-check error, falling back to MediaRecorder:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicPermission("denied");
        setSpeechError("Permissão de microfone negada. Toque no cadeado do navegador para permitir o microfone.");
        setShowMicModal(true);
      } else {
        await startMediaRecording();
      }
    }
  };

  return (
    <div id="ecobot-root" className="min-h-screen bg-black text-zinc-100 font-sans flex flex-col selection:bg-white selection:text-black relative overflow-x-hidden">
      
      {/* Background Image: Animais e Paisagens da Taiga Boreal (Semi-transparente) */}
      {showBgImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-500" 
          aria-hidden="true"
          style={{ opacity: bgOpacity / 100 }}
        >
          <img
            src="/assets/images/amazon_wildlife.jpg"
            alt="Animais da Floresta Amazônica"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.02] filter contrast-110 saturate-125"
          />
          {/* Subtle gradient vignette to preserve contrast and HUD readability */}
          <div className="absolute inset-0 bg-radial from-black/20 via-[#09090b]/55 to-[#09090b]/90 pointer-events-none" />
        </div>
      )}

      {/* Bio-Mechanical Climbing Vines (Trepadeiras - Camada Suave de Fundo) */}
      <BioVines visible={showVines && !isFullscreen} opacity={22} />

      {/* Autonomous Eco-Monitoring Drones (Drones de Patrulha e Sonda) */}
      <EcoDrones
        visible={showDrones && !isFullscreen}
        onDroneInspect={(name, telemetry) => {
          setAiResponseText(`[${name}] ${telemetry}`);
        }}
      />

      {/* Waveform keyframe for active recording state */}
      <style>{`
        @keyframes customGrow {
          0%, 100% { height: 6px; }
          50% { height: 24px; }
        }
        .v-wave-1 { animation: customGrow 0.5s infinite ease-in-out; }
        .v-wave-2 { animation: customGrow 0.7s infinite ease-in-out 0.12s; }
        .v-wave-3 { animation: customGrow 0.4s infinite ease-in-out 0.24s; }
        .v-wave-4 { animation: customGrow 0.6s infinite ease-in-out 0.36s; }
        .text-glow-white {
          text-shadow: 0 0 14px rgba(255, 255, 255, 0.75);
        }
      `}</style>

      {/* Simplified, neat Navigation Row - Ocultado durante o vídeo para visualização limpa */}
      {!hidePanels && !isFullscreen && (!hasStarted || videoFinished) && (
        <header id="taiga-nav" className="bg-black/95 backdrop-blur-md border-b border-zinc-800 py-3.5 px-3 sm:px-6 sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
            
            {/* Left side: Brand title and status */}
            <div className="flex items-center gap-2 sm:gap-3 select-none shrink-0">
              <BranchLogo className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
              <div className="flex flex-col">
                <span className="font-display font-black text-base sm:text-xl tracking-wider text-white text-glow-white uppercase leading-none whitespace-nowrap">
                  Assistente de Taiga
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-none whitespace-nowrap">
                    Bioma Boreal • 1080p HD
                  </span>
                  {isTablet ? (
                    <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 px-1.5 py-0.2 rounded-full whitespace-nowrap leading-none">
                      <Tablet className="w-2.5 h-2.5" /> Tablet
                    </span>
                  ) : isMobile ? (
                    <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 px-1.5 py-0.2 rounded-full whitespace-nowrap leading-none">
                      <Smartphone className="w-2.5 h-2.5" /> Celular
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right Action buttons: Falar por Voz, Ajustes */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap overflow-x-auto no-scrollbar py-0.5">
              {activeTab === "chat" && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 border-2 cursor-pointer whitespace-nowrap leading-none shrink-0 ${
                    isListening || isRecordingMedia
                      ? "bg-red-500 text-white border-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                      : "bg-white hover:bg-zinc-200 text-black border-black font-black hover:scale-[1.02] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)]"
                  }`}
                  title={isListening || isRecordingMedia ? "Desativar microfone" : "Ativar microfone por voz"}
                >
                  {isListening || isRecordingMedia ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{isRecordingMedia ? `Ouvindo (${recordingDuration}s)` : "Ouvindo..."}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">Falar Comando</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "chat" ? "settings" : "chat")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-200 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-white/50 cursor-pointer whitespace-nowrap leading-none shrink-0 ${
                  activeTab === "settings" ? "text-white border-white bg-zinc-800" : ""
                }`}
                title={activeTab === "chat" ? "Ir para Configurações" : "Ir para o Player"}
              >
                {activeTab === "chat" ? (
                  <>
                    <Settings className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Gatilhos & Ajustes</span>
                  </>
                ) : (
                  <>
                    <Tv className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Apresentação</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Main Area */}
      <main className={`flex-1 w-full max-w-7xl mx-auto ${isFullscreen || (hasStarted && !videoFinished) ? "p-0 sm:p-2 max-w-none" : "px-2 sm:px-6 py-2 sm:py-6"} flex flex-col justify-center items-center transition-all duration-300 relative z-10`}>
        
        {/* VIEW 1: APRESENTAÇÃO DE VÍDEO (Exibe exclusivamente a tela de apresentação e controles superiores) */}
        {activeTab === "chat" && (
          <div className="animate-fade-in max-w-5xl md:max-w-6xl mx-auto w-full flex flex-col items-center justify-center transition-all duration-300">
            <div className={`w-full relative ${isFullscreen ? "pt-0" : (hasStarted && !videoFinished) ? "pt-0" : "pt-1 sm:pt-2"}`}>
                
                {/* Main Video Box: 16:9 aspect-video for edge-to-edge fitted display without letterboxing */}
                <div 
                  ref={videoContainerRef}
                  onTouchEnd={handleVideoTouch}
                  className={
                    isFullscreen || (hasStarted && !videoFinished)
                      ? "fixed inset-0 z-50 w-screen h-[100dvh] bg-black m-0 p-0 overflow-hidden flex flex-col justify-center items-center"
                      : "bg-zinc-950 border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl relative w-full aspect-video max-h-[82dvh] sm:max-h-[660px] md:max-h-[720px] min-h-[240px] sm:min-h-[380px] md:min-h-[460px] flex flex-col justify-center items-center group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                  }
                >
                  {/* Inner overflow-hidden container to round off borders correctly */}
                  <div className={`absolute inset-0 ${isFullscreen || (hasStarted && !videoFinished) ? "rounded-none" : "rounded-[14px] sm:rounded-[22px]"} overflow-hidden flex flex-col justify-center items-center`}>
                    
                    {/* Botão de acesso rápido para exibir os gatilhos a qualquer momento durante a reprodução */}
                    {hasStarted && !videoFinished && (
                      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleVideoEnded}
                          className="bg-black/85 hover:bg-white text-zinc-200 hover:text-black border border-white/40 hover:border-black backdrop-blur-md px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition-all cursor-pointer shadow-lg flex items-center gap-1.5 whitespace-nowrap leading-none active:scale-95 group"
                          title="Concluir vídeo e exibir a tela de gatilhos disponíveis"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white group-hover:text-black shrink-0" />
                          <span className="whitespace-nowrap leading-none">Ver Gatilhos</span>
                        </button>
                      </div>
                    )}

                    {/* Floating Layout Toggles Overlay (Ocultado enquanto o vídeo toca, retorna ao terminar) */}
                    {(!hasStarted || videoFinished) && (
                      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-zinc-800 shadow-xl max-w-[calc(100%-1.25rem)] overflow-x-auto no-scrollbar">
                        {/* Fullscreen Button */}
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className={`bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0 ${
                            isFullscreen ? "bg-white text-black border-black font-extrabold" : ""
                          }`}
                          title={isFullscreen ? "Sair da Tela Inteira" : "Encaixar em Tela Inteira (Preencher Celular)"}
                        >
                          {isFullscreen ? <Minimize className="w-3.5 h-3.5 shrink-0" /> : <Maximize className="w-3.5 h-3.5 shrink-0" />}
                          <span className="hidden sm:inline whitespace-nowrap leading-none">{isFullscreen ? "Sair" : "Tela Cheia"}</span>
                        </button>

                        {/* Video Fit Button */}
                        <button
                          type="button"
                          onClick={() => setVideoFit(prev => prev === "contain" ? "cover" : "contain")}
                          className={`bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0 ${
                            videoFit === "cover" ? "border-white/60 bg-white/15" : ""
                          }`}
                          title={videoFit === "contain" ? "Preencher Tela Inteira (Ajuste Total)" : "Enquadramento Original Proporcional"}
                        >
                          <Tv className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden md:inline whitespace-nowrap leading-none">{videoFit === "cover" ? "Preenchido" : "Ajustado"}</span>
                        </button>

                        {/* Video Quality Quick Toggle / Indicator: 1080p */}
                        <button
                          type="button"
                          onClick={() => {
                            const cycle: VideoQualityPreference[] = ["hd1080", "hd720", "large", "medium", "auto"];
                            const nextIdx = (cycle.indexOf(preferredVideoQuality) + 1) % cycle.length;
                            const nextQuality = cycle[nextIdx];
                            setPreferredVideoQuality(nextQuality);
                            triggerQualityAutoPulse(nextQuality);
                            setYtReloadKey(prev => prev + 1);
                          }}
                          className="bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0"
                          title={`Qualidade Inicial Atual: ${
                            preferredVideoQuality === "hd1080" ? "1080p (Full HD)" :
                            preferredVideoQuality === "hd720" ? "720p (HD)" :
                            preferredVideoQuality === "large" ? "480p (SD)" :
                            preferredVideoQuality === "medium" ? "360p" : "Automático"
                          }. Clique para alternar resolução.`}
                        >
                          <Sliders className="w-3 h-3 shrink-0 text-white" />
                          <span className="whitespace-nowrap leading-none font-bold">
                            {preferredVideoQuality === "hd1080" ? "1080p FHD" :
                             preferredVideoQuality === "hd720" ? "720p HD" :
                             preferredVideoQuality === "large" ? "480p" :
                             preferredVideoQuality === "medium" ? "360p" : "Auto"}
                          </span>
                        </button>

                        {/* Audio Button */}
                        <button
                          type="button"
                          onClick={() => setVideoMuted(prev => !prev)}
                          className="bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap leading-none shrink-0"
                          title={videoMuted ? "Ativar Áudio" : "Silenciar Áudio"}
                        >
                          {videoMuted ? <VolumeX className="w-3.5 h-3.5 shrink-0 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 shrink-0 text-white" />}
                        </button>

                        {!isFullscreen && (
                          <button
                            type="button"
                            onClick={() => setHidePanels(prev => !prev)}
                            className={`bg-black/95 hover:bg-white hover:text-black hover:border-black border border-zinc-800 text-white text-[9px] font-mono font-bold uppercase px-2 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm whitespace-nowrap leading-none shrink-0 ${hidePanels ? "bg-white text-black border-black" : ""}`}
                            title={hidePanels ? "Mostrar Painel, Chat e Opções de Controle" : "Ocultar Informações para Focar no Vídeo"}
                          >
                            {hidePanels ? <Eye className="w-3 h-3 shrink-0" /> : <EyeOff className="w-3 h-3 shrink-0" />}
                            <span className="hidden lg:inline whitespace-nowrap leading-none">{hidePanels ? "Ver Painel" : "Ocultar"}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Top Left Status Badge in Fullscreen */}
                    {isFullscreen && videoFinished && (
                      <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-300 shadow-md whitespace-nowrap leading-none">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                        <span className="font-bold text-white uppercase whitespace-nowrap leading-none">{activeVideoSlot === "intro" ? "Apresentação (Intro)" : `Canal ${questions.findIndex(q => q.id === activeVideoSlot) + 1}`}</span>
                        <span className="text-[8px] bg-white/20 text-white px-1.5 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none border border-white/30">
                          1080p FHD
                        </span>
                        {isMobile && (
                          <span className="text-[8px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none">
                            Mobile
                          </span>
                        )}
                      </div>
                    )}

                    {!hasStarted ? (
                      <div className="absolute inset-0 bg-[#050508] flex flex-col items-center justify-center p-6 sm:p-8 text-center z-40 animate-fade-in text-zinc-300">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] opacity-90 pointer-events-none" />
                        
                        <div className="relative mb-6">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-950 border-2 border-white flex items-center justify-center text-white shadow-[0_0_35px_rgba(255,255,255,0.25)] animate-pulse">
                            <BranchLogo className="w-12 h-12 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                          </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            Assistente de Taiga Ativo
                          </div>
                          <h4 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider leading-tight">
                            Bioma da Taiga
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed">
                            {introName ? `Apresentação: "${introName}"` : `Vídeo em alta resolução 1080p com reconhecimento de voz da floresta boreal.`}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            Clique em Iniciar para começar a exibição em tela cheia com áudio ativo. Use os botões fixos de gatilhos ou fale um dos comandos a qualquer momento.
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoMuted(false);
                              triggerVideoSlot("intro");
                              triggerQualityAutoPulse("hd1080");
                            }}
                            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-zinc-200 text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:translate-y-[2px] transition-all cursor-pointer flex items-center gap-2.5 group whitespace-nowrap leading-none shrink-0"
                          >
                            <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform shrink-0" />
                            <span className="whitespace-nowrap leading-none">Iniciar Apresentação</span>
                          </button>

                          <button
                            type="button"
                            onClick={toggleListening}
                            className={`px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl border-3 border-zinc-700 font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap leading-none shrink-0 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-[2px] ${
                              isListening || isRecordingMedia
                                ? "bg-red-500 text-white border-white animate-pulse"
                                : "bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black border-zinc-600 hover:border-black"
                            }`}
                            title="Ativar microfone para acionar um gatilho por voz"
                          >
                            <Mic className="w-5 h-5 shrink-0" />
                            <span className="whitespace-nowrap leading-none">
                              {isListening || isRecordingMedia ? "Ouvindo Voz..." : "Falar no Microfone"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : getActiveVideoUrl() ? (
                      <div className="absolute inset-0 bg-black flex items-center justify-center">
                        {isYouTubeUrl(getActiveVideoUrl()) ? (
                          <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
                            {/* 1920x1080 Full HD Virtual Canvas */}
                            <div 
                              style={{
                                width: "1920px",
                                height: "1080px",
                                transform: `scale(${ytStageScale})`,
                                transformOrigin: "center center",
                                flexShrink: 0
                              }}
                              className={`relative flex items-center justify-center ${videoFinished ? "blur-[2.5px]" : ""} transition-all duration-300`}
                            >
                              <iframe
                                ref={ytIframeRef}
                                id="taiga-yt-iframe"
                                width="1920"
                                height="1080"
                                key={`${activeVideoSlot}-${getYouTubeVideoId(getActiveVideoUrl())}-${ytReloadKey}`}
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(getActiveVideoUrl())}?autoplay=1&mute=${videoMuted ? 1 : 0}&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=1&vq=hd1080&hd=1`}
                                title={getActiveVideoTitle()}
                                onLoad={() => {
                                  triggerQualityAutoPulse("hd1080");
                                }}
                                className="w-[1920px] h-[1080px] border-0 select-none pointer-events-auto"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{
                                  imageRendering: "-webkit-optimize-contrast"
                                }}
                              />
                            </div>

                            {/* Extensão 1080p Only Lock Badge & Status (Ocultado durante a reprodução) */}
                            {force1080pOnly && isYouTubeUrl(getActiveVideoUrl()) && (!hasStarted || videoFinished) && (
                              <div className="absolute top-2.5 left-2.5 z-30 hidden sm:flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] select-none">
                                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                                <span className="text-[10px] font-mono font-black text-white uppercase whitespace-nowrap leading-none">
                                   Extensão 1080p Ativa
                                </span>
                                <span className="text-[8px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap leading-none flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>Travado em 1080</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerQualityAutoPulse("hd1080");
                                    setAiResponseText("Extensão: Resolução 1080p Full HD re-forçada com sucesso no reprodutor.");
                                  }}
                                  className="text-zinc-400 hover:text-white p-0.5 cursor-pointer ml-0.5"
                                  title="Reaplicar comando de 1080p da extensão"
                                >
                                  <RefreshCw className="w-2.5 h-2.5 hover:rotate-180 transition-transform text-white" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <video
                            key={activeVideoSlot}
                            ref={videoRef}
                            src={getActiveVideoUrl()}
                            className={`w-full h-full ${videoFit === "contain" ? "object-contain" : "object-cover"} ${videoFinished ? "blur-[2.5px]" : ""} transition-all duration-500`}
                            autoPlay
                            muted={videoMuted}
                            playsInline
                            webkit-playsinline="true"
                            onEnded={handleVideoEnded}
                            onError={() => {
                              setVideoPlayError("Não foi possível reproduzir este vídeo.");
                            }}
                          />
                        )}

                        {/* TELA DE GATILHOS DISPONÍVEIS EXIBIDA AO FINALIZAR O VÍDEO */}
                        {videoFinished && (
                          <div className="fixed inset-0 z-50 bg-[#050508]/98 backdrop-blur-xl flex flex-col justify-between items-center p-3 sm:p-6 md:p-8 select-none overflow-y-auto animate-fade-in text-zinc-100">
                            
                            {/* Top Bar inside Fullscreen Triggers View */}
                            <div className="w-full max-w-5xl flex items-center justify-between gap-3 border-b border-zinc-800 pb-3 shrink-0">
                              <div className="flex items-center gap-2.5">
                                <BranchLogo className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                                <div className="flex flex-col">
                                  <span className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wider leading-none">
                                    Assistente de Taiga
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-none">
                                      Vídeo Concluído • Gatilhos Disponíveis
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("settings");
                                    setVideoFinished(false);
                                    exitFullscreenAuto();
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-700 hover:border-black text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                                  title="Abrir configurações para editar ou adicionar gatilhos"
                                >
                                  <Settings className="w-3.5 h-3.5 shrink-0" />
                                  <span className="hidden sm:inline">Configurações</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={toggleFullscreen}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 ${
                                    isFullscreen
                                      ? "bg-white text-black border-white"
                                      : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300"
                                  }`}
                                  title={isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia"}
                                >
                                  {isFullscreen ? <Minimize className="w-3.5 h-3.5 shrink-0" /> : <Maximize className="w-3.5 h-3.5 shrink-0" />}
                                  <span className="hidden sm:inline">{isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}</span>
                                </button>
                              </div>
                            </div>

                            {/* Center Container: Main Content */}
                            <div className="w-full max-w-5xl my-auto py-3 sm:py-4 flex flex-col items-center">
                              
                              {/* Header & Call-to-Action */}
                              <div className="flex flex-col items-center text-center gap-2 mb-4 sm:mb-5">
                                <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
                                  <Sparkles className="w-4 h-4 shrink-0" />
                                  <span>Gatilhos Fixos da Taiga ({questions.length + 1} Vídeos)</span>
                                </div>

                                <h2 className="font-display font-black text-lg sm:text-2xl md:text-3xl uppercase tracking-wider text-white mt-1 leading-tight">
                                  O que você gostaria de explorar agora?
                                </h2>

                                <p className="text-xs sm:text-sm font-mono text-zinc-300 max-w-xl leading-relaxed">
                                  Diga uma das frases configuradas no microfone ou toque diretamente no gatilho para assistir em tela cheia:
                                </p>

                                {/* Big Central Microphone Button */}
                                <div className="mt-2 flex flex-col items-center gap-2 w-full max-w-md">
                                  <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`w-full py-3 sm:py-3.5 px-6 rounded-2xl border-3 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:translate-y-0.5 ${
                                      isListening || isRecordingMedia
                                        ? "bg-red-500 text-white animate-pulse"
                                        : isAnalyzing
                                        ? "bg-amber-400 text-black animate-bounce"
                                        : "bg-white hover:bg-zinc-200 text-black"
                                    }`}
                                  >
                                    {isListening || isRecordingMedia ? (
                                      <>
                                        <MicOff className="w-5 h-5 shrink-0" />
                                        <span>Ouvindo... Diga a frase agora ({recordingDuration}s)</span>
                                      </>
                                    ) : isAnalyzing ? (
                                      <>
                                        <RefreshCw className="w-5 h-5 animate-spin shrink-0" />
                                        <span>Sintonizando comando de voz...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Mic className="w-5 h-5 shrink-0" />
                                        <span>Falar Frase no Microfone</span>
                                      </>
                                    )}
                                  </button>

                                  {(realtimeSpeech || lastSpeechDetected) && (
                                    <div className="text-[11px] font-mono text-white bg-black/80 px-3 py-1 rounded-lg border border-white/30 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                      <span className="truncate">{realtimeSpeech ? `Detectando: "${realtimeSpeech}"` : `Último comando: "${lastSpeechDetected}"`}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Grid of All Configured Triggers from Settings */}
                              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-1">
                                {questions.map((q, idx) => {
                                  const isViewed = viewedSlots.includes(q.id);
                                  return (
                                    <button
                                      key={q.id}
                                      type="button"
                                      onClick={() => triggerVideoSlot(q.id)}
                                      disabled={!q.videoUrl}
                                      className={`w-full relative p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border-2 flex items-center justify-between gap-3 select-none group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] ${
                                        isViewed
                                          ? "bg-zinc-950/85 hover:bg-zinc-900 border-zinc-800 hover:border-white"
                                          : "bg-zinc-900/90 hover:bg-black border-zinc-700 hover:border-white"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-black shrink-0 transition-colors shadow-sm">
                                          <BranchLogo className="w-5 h-5 shrink-0" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                              Canal #{idx + 1}
                                            </span>
                                            {isViewed ? (
                                              <span className="text-[8px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.2 rounded uppercase">
                                                ✓ Já visto
                                              </span>
                                            ) : (
                                              <span className="text-[8px] font-mono font-bold bg-white/15 text-white border border-white/30 px-1.5 py-0.2 rounded uppercase">
                                                Disponível
                                              </span>
                                            )}
                                          </div>
                                          <div className="font-display font-black text-sm sm:text-base text-white group-hover:text-white uppercase tracking-wider truncate leading-tight">
                                            "{q.phrase}"
                                          </div>
                                          <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                                            {q.videoName || "Vídeo 1080p HD"}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="shrink-0 flex items-center">
                                        <span className="text-[10px] font-mono font-black uppercase px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white text-black border-2 border-black flex items-center gap-1.5 group-hover:bg-zinc-200 transition-colors whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                                          <Play className="w-3.5 h-3.5 fill-black shrink-0" />
                                          <span className="whitespace-nowrap">Assistir</span>
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                            </div>

                            {/* Bottom Bar: Replay, Intro, Settings, Reset */}
                            <div className="w-full max-w-5xl flex flex-wrap items-center justify-center sm:justify-between gap-2 pt-3 border-t border-zinc-800 shrink-0">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleReplayVideo}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-2 border-black hover:border-white text-white font-mono text-[10px] font-bold uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span>Rever Vídeo Atual</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerVideoSlot("intro")}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-2 border-black hover:border-white text-white font-mono text-[10px] font-bold uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  <BranchLogo className="w-3.5 h-3.5 text-white shrink-0" />
                                  <span>Bioma da Taiga</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewedSlots([]);
                                    setUsedTriggerIds([]);
                                    try { localStorage.removeItem("eco_used_trigger_ids"); } catch (_) {}
                                    setAiResponseText("Gatilhos reiniciados. Todos os comandos da Taiga estão disponíveis.");
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-white text-zinc-400 hover:text-white font-mono text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                                  <span>Zerar Ciclo</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("settings");
                                    setVideoFinished(false);
                                    exitFullscreenAuto();
                                  }}
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-zinc-200 text-black border-2 border-black font-mono text-[10px] font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  <Settings className="w-3.5 h-3.5 shrink-0" />
                                  <span>Gerenciar Gatilhos</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* Video Controls bar inside iframe overlay */}
                        {!isIntroSpecialVideo && (
                          <div className="absolute bottom-3 left-3 z-10 bg-black/90 border border-white/30 text-white text-[10px] font-mono px-2.5 py-1 rounded flex items-center gap-2 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="font-extrabold text-white">1080p HD AUTOMÁTICO</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-zinc-300 font-mono text-[9px]">{isYouTubeUrl(getActiveVideoUrl()) ? "Qualidade 1080p Ativa" : "Mídia 1080p"}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center max-w-sm flex flex-col items-center gap-4 bg-white/5 backdrop-blur-md text-zinc-300">
                        <div className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.25)] animate-pulse">
                          <Video className="w-7 h-7 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-white uppercase tracking-wider">Nenhum Vídeo Carregado nesta Rota</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Vá no menu de <span className="text-white font-bold cursor-pointer underline" onClick={() => setActiveTab("settings")}>Configurações</span> para gerenciar os links do YouTube.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Sub-system Alerts inside screen */}
                    {videoPlayError && (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-5 text-center z-10 border-2 border-red-500">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-1" />
                        <span className="text-[10px] font-mono font-bold text-red-600 block">FALHA DE CARREGAMENTO</span>
                        <p className="text-[11px] text-zinc-600 max-w-xs mt-1 leading-normal font-sans">
                          {videoPlayError}
                        </p>
                        <button
                          onClick={() => setVideoPlayError("")}
                          className="mt-3 px-3 py-1 bg-black text-white hover:bg-zinc-800 text-[10px] font-mono font-bold rounded-lg transition-all border border-black cursor-pointer"
                        >
                          IGNORAR
                        </button>
                      </div>
                    )}
                    
                    {/* Quality & Resolution Indicator on Bottom Left (Ocultado durante o vídeo) */}
                    {(!hasStarted || videoFinished) && (
                      <div className="absolute bottom-3 left-3 z-10 hidden xs:flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/30 text-[9px] font-mono shadow-sm pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white font-extrabold uppercase">1080p HD AUTO</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-300 font-bold uppercase truncate max-w-[130px] sm:max-w-[200px]">
                          {isYouTubeUrl(getActiveVideoUrl()) ? "Ajuste 1080p Automático" : getActiveVideoTitle()}
                        </span>
                      </div>
                    )}

                    {/* Active Route Slot Indicators on the bottom right corner (Ocultado durante o vídeo) */}
                    {(!hasStarted || videoFinished) && (
                      <div className="absolute bottom-3 right-3 z-10 flex flex-wrap gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-lg border border-zinc-800 text-[10px] font-mono shadow-sm max-w-[180px]">
                        <button
                          onClick={() => triggerVideoSlot("intro")}
                          disabled={!introUrl}
                          className={`px-2 py-0.5 rounded font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${activeVideoSlot === "intro" ? "bg-white text-black border border-black font-black" : "text-zinc-400 hover:text-white"}`}
                          title="Ir para o vídeo de apresentação do Bioma da Taiga"
                        >
                          Bioma
                        </button>
                        {questions.map((q, idx) => {
                          const isUsed = usedTriggerIds.includes(q.id);
                          return (
                            <button
                              key={q.id}
                              onClick={() => triggerVideoSlot(q.id)}
                              disabled={!q.videoUrl}
                              className={`px-2 py-0.5 rounded font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                                activeVideoSlot === q.id 
                                  ? "bg-white text-black border border-black font-black" 
                                  : isUsed
                                  ? "text-zinc-600 line-through hover:text-zinc-400"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                              title={isUsed ? `Canal ${idx + 1} (Já utilizado nesta sessão)` : `Canal da Pergunta ${idx + 1}`}
                            >
                              G{idx + 1}{isUsed ? "✓" : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Floating Voice & Quick Control Dock when in Fullscreen (Apenas ao terminar o vídeo) */}
                    {isFullscreen && videoFinished && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.9)] max-w-[95vw]">
                        <button
                          onClick={toggleListening}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] font-black uppercase border transition-all cursor-pointer ${
                            isListening
                              ? "bg-red-500 text-white border-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse"
                              : "bg-white text-black border-black hover:bg-zinc-200 active:scale-95"
                          }`}
                        >
                          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          <span>{isListening ? "Ouvindo..." : "Falar"}</span>
                        </button>
                        
                        <div className="h-4 w-px bg-zinc-800" />

                        <button
                          onClick={handleReplayVideo}
                          className="text-zinc-400 hover:text-white p-1.5 rounded transition-colors"
                          title="Rever Vídeo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setVideoFit(prev => prev === "cover" ? "contain" : "cover")}
                          className="text-zinc-400 hover:text-white text-[9px] font-mono px-2 py-1 rounded border border-zinc-800"
                          title="Alternar Encaixe de Vídeo"
                        >
                          {videoFit === "cover" ? "Preenchido" : "Original"}
                        </button>

                        <div className="h-4 w-px bg-zinc-800" />

                        <button
                          onClick={toggleFullscreen}
                          className="flex items-center gap-1 text-zinc-300 hover:text-white text-[9px] font-mono font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800"
                          title="Sair da Tela Inteira"
                        >
                          <Minimize className="w-3 h-3 text-white" />
                          <span>Sair</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>

                {/* PAINEL DE GATILHOS FIXOS DA TAIGA (Sempre visível diretamente no código) */}
                <div className="w-full mt-4 sm:mt-6 bg-zinc-950/95 border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                        <BranchLogo className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-sm sm:text-base uppercase tracking-wider text-white flex items-center gap-2">
                          <span>Gatilhos Fixos da Taiga</span>
                          <span className="text-[9px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded uppercase">
                            5 Vídeos Gravados
                          </span>
                        </h3>
                        <p className="text-[11px] font-mono text-zinc-400">
                          Clique em qualquer gatilho abaixo ou fale a frase correspondente para reproduzir o vídeo em tela cheia.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 border ${
                          isListening || isRecordingMedia
                            ? "bg-red-500 text-white border-white animate-pulse"
                            : "bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black border-zinc-700 hover:border-black"
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{isListening || isRecordingMedia ? "Ouvindo Voz..." : "Falar Comando"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid of the 5 Fixed Triggers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* 1. Bioma da Taiga (Apresentação Principal) */}
                    <button
                      type="button"
                      onClick={() => triggerVideoSlot("intro")}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 group ${
                        activeVideoSlot === "intro" && hasStarted && !videoFinished
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          : "bg-zinc-900/90 hover:bg-zinc-850 text-zinc-200 border-zinc-800 hover:border-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          activeVideoSlot === "intro" && hasStarted && !videoFinished
                            ? "bg-black text-white"
                            : "bg-black text-white group-hover:bg-white group-hover:text-black transition-colors"
                        }`}>
                          <BranchLogo className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                            Vídeo de Apresentação
                          </div>
                          <div className="font-display font-black text-xs sm:text-sm uppercase tracking-wide truncate">
                            Bioma da Taiga
                          </div>
                        </div>
                      </div>
                      <Play className={`w-4 h-4 shrink-0 ${
                        activeVideoSlot === "intro" && hasStarted && !videoFinished ? "fill-black" : "fill-white"
                      }`} />
                    </button>

                    {/* 2 to 5. The 4 Question Triggers */}
                    {questions.map((q, idx) => {
                      const isActive = activeVideoSlot === q.id && hasStarted && !videoFinished;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => triggerVideoSlot(q.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 group ${
                            isActive
                              ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                              : "bg-zinc-900/90 hover:bg-zinc-850 text-zinc-200 border-zinc-800 hover:border-white"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-black text-white"
                                : "bg-black text-white group-hover:bg-white group-hover:text-black transition-colors"
                            }`}>
                              <BranchLogo className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                Gatilho #{idx + 1}
                              </div>
                              <div className="font-display font-black text-xs sm:text-sm uppercase tracking-wide truncate">
                                {q.phrase}
                              </div>
                            </div>
                          </div>
                          <Play className={`w-4 h-4 shrink-0 ${isActive ? "fill-black" : "fill-white"}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Status or Assistant response line */}
                  {aiResponseText && (
                    <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                      <span className="truncate">{aiResponseText}</span>
                    </div>
                  )}
                </div>

            </div>
          </div>
        )}

        {/* VIEW 2: AJUSTES DA CENTRAL (Optimized, Simplified and Professional Settings Tab) */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-zinc-950 border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col gap-6 text-zinc-100">
              
              {/* Header section with clean typography & solid controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-white text-black border border-black px-2 py-0.5 rounded uppercase">
                      Painel do Operador
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                      Taiga Boreal v3.0
                    </span>
                  </div>
                  <h2 className="text-sm font-display font-black text-white uppercase tracking-wider mt-1.5 flex items-center gap-2">
                    <BranchLogo className="w-5 h-5 text-white inline-block" />
                    <span>Configuração de Canais e Voz • Assistente de Taiga</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Gerencie a transmissão e associe comandos falados aos canais de vídeo da Taiga.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={resetAllTriggers}
                    className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold px-3 py-2 rounded-lg border border-zinc-800 transition-all cursor-pointer shadow-sm font-mono uppercase"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Redefinir</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("chat")}
                    className="flex items-center gap-1.5 bg-white text-black hover:bg-zinc-200 text-[10px] font-black px-4 py-2 rounded-lg transition-all cursor-pointer uppercase font-mono tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]"
                  >
                    <span>Concluído</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 12-Column Grid Layout for Settings Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: System & Intro Flow (Col Span: 4) */}
                <div className="lg:col-span-4 space-y-5">
                  
                  {/* Card 1: Intro Video config */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-white" />
                          Vídeo de Apresentação (Intro)
                        </span>
                        {introUrl && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border ${
                            isYouTubeUrl(introUrl)
                              ? "bg-red-600/20 text-red-400 border-red-500/30"
                              : "bg-white/10 text-white border-white/30"
                          }`}>
                            {isYouTubeUrl(introUrl) ? "YOUTUBE" : "ATIVO"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Vídeo padrão reproduzido na inicialização ou ao recomeçar a visita guiada: Bioma da Taiga (fixo no código).
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {/* URL Input */}
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold flex items-center justify-between">
                          <span>URL do Vídeo (YouTube / Web):</span>
                          {isYouTubeUrl(introUrl) && (
                            <span className="text-[8px] text-red-400 font-bold">YouTube detectado</span>
                          )}
                        </label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=... ou link .mp4"
                          value={introUrl}
                          onChange={(e) => handleUrlChange("intro", e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-white rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-100 placeholder-zinc-600 font-mono focus:outline-none"
                        />
                      </div>

                      {/* File upload or restore default URL buttons */}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 border border-dashed border-zinc-800 hover:border-white/50 bg-zinc-950/80 rounded-lg p-2 text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 min-h-[38px]">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileChange("intro", file);
                            }}
                            className="hidden"
                          />
                          <Upload className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-zinc-400 font-mono text-[9px] truncate">
                            {introName && !introUrl?.startsWith("http") ? introName : "Arquivo local"}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleUrlChange("intro", DEFAULT_INTRO_URL)}
                          className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white text-[9px] font-mono font-bold transition-all shrink-0 cursor-pointer"
                          title="Restaurar vídeo oficial da apresentação: Bioma da Taiga (https://youtu.be/LurY80QqKsw)"
                        >
                          Padrão Taiga
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (introUrl) {
                            triggerVideoSlot("intro");
                            setActiveTab("chat");
                          }
                        }}
                        disabled={!introUrl}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer font-bold font-mono text-[9px] uppercase shadow-sm"
                      >
                        Visualizar Intro em Tela Cheia
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Plano de Fundo - Paisagem da Taiga */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-white" />
                          Fundo Paisagem da Taiga
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border ${
                          showBgImage 
                            ? "bg-white/10 text-white border-white/30" 
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          {showBgImage ? "ATIVO" : "INATIVO"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Papel de parede com o bioma da Taiga boreal, florestas de coníferas e fauna ártica.
                      </p>
                    </div>

                    {/* Preview Image with overlay effect */}
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 h-28 group">
                      <img 
                        src="/assets/images/amazon_wildlife.jpg" 
                        alt="Miniatura Paisagem da Taiga"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2 justify-between">
                        <span className="text-[9px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                          Bioma da Taiga
                        </span>
                        <span className="text-[9px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {bgOpacity}% Opacidade
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-3 pt-1">
                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowBgImage(prev => !prev)}
                        className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono font-bold text-[10px] uppercase transition-all cursor-pointer border ${
                          showBgImage
                            ? "bg-white text-black border-white hover:bg-zinc-200"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{showBgImage ? "Ocultar Fundo" : "Ativar Fundo"}</span>
                      </button>

                      {/* Opacity Range Slider */}
                      {showBgImage && (
                        <div className="space-y-1.5 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-400">Transparência / Opacidade:</span>
                            <span className="text-white font-bold">{bgOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="85"
                            step="5"
                            value={bgOpacity}
                            onChange={(e) => setBgOpacity(Number(e.target.value))}
                            className="w-full accent-white cursor-pointer"
                          />
                          <div className="flex justify-between text-[8px] font-mono text-zinc-600">
                            <span>Mais Transparente (10%)</span>
                            <span>Recomendado (35%)</span>
                            <span>Mais Vívido (85%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Otimização Mobile & Tela Inteira */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-white" />
                          Modo Mobile & Tela Inteira
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold font-mono border ${
                          videoFit === "cover"
                            ? "bg-white/10 text-white border-white/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          {videoFit === "cover" ? "PREENCHER TELA" : "ORIGINAL"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Ajuste para celulares: os vídeos se encaixam preenchendo a tela inteira sem bordas pretas.
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* Encaixe de Vídeo */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold block">
                          Formato de Exibição:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setVideoFit("cover")}
                            className={`px-2.5 py-2 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer border flex flex-col items-center gap-1 text-center ${
                              videoFit === "cover"
                                ? "bg-white text-black border-white shadow-sm"
                                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                            }`}
                          >
                            <Maximize className="w-3.5 h-3.5" />
                            <span>Preencher Tela</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setVideoFit("contain")}
                            className={`px-2.5 py-2 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer border flex flex-col items-center gap-1 text-center ${
                              videoFit === "contain"
                                ? "bg-white text-black border-white shadow-sm"
                                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                            }`}
                          >
                            <Tv className="w-3.5 h-3.5" />
                            <span>Original</span>
                          </button>
                        </div>
                      </div>

                      {/* Auto Fullscreen on Start Toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-300 block">
                            Tela Cheia ao Iniciar no Mobile
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 block">
                            Abre o reprodutor em tela cheia automaticamente no celular
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMobileFullscreenAuto(prev => !prev)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border border-zinc-800 shrink-0 ${
                            mobileFullscreenAuto ? "bg-white" : "bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-black block absolute top-0.5 transition-transform ${
                              mobileFullscreenAuto ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Test Fullscreen */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("chat");
                          setTimeout(() => {
                            toggleFullscreen();
                          }, 100);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 rounded-lg font-mono font-bold text-[9px] uppercase transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Maximize className="w-3.5 h-3.5 text-white" />
                        <span>Visualizar em Tela Cheia</span>
                      </button>
                    </div>
                  </div>

                  {/* Card: Ajuste de Qualidade Inicial do Vídeo (1080p, 720p, 480p, etc.) */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-white" />
                          Qualidade Inicial do Vídeo
                        </span>
                        <span className="text-[8px] px-2 py-0.5 rounded font-extrabold font-mono border bg-white/10 text-white border-white/20 uppercase">
                          {preferredVideoQuality === "hd1080" ? "1080p FHD" :
                           preferredVideoQuality === "hd720" ? "720p HD" :
                           preferredVideoQuality === "large" ? "480p SD" :
                           preferredVideoQuality === "medium" ? "360p" : "AUTOMÁTICO"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal mt-2 font-mono">
                        Escolha em qual resolução os vídeos devem começar automaticamente ao reproduzir os gatilhos ou apresentação (1080p, 720p, etc.).
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-zinc-400 uppercase font-mono font-bold block">
                          Resolução Padrão de Início:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { id: "hd1080", label: "1080p", badge: "Full HD", desc: "Máxima Nitidez" },
                            { id: "hd720", label: "720p", badge: "HD", desc: "Equilibrado" },
                            { id: "large", label: "480p", badge: "SD", desc: "Mais Leve" },
                            { id: "medium", label: "360p", badge: "Econômico", desc: "Pouca Banda" },
                            { id: "auto", label: "Auto", badge: "Dinâmico", desc: "Adaptativo" },
                          ].map((item) => {
                            const isSelected = preferredVideoQuality === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setPreferredVideoQuality(item.id as VideoQualityPreference);
                                  triggerQualityAutoPulse(item.id as VideoQualityPreference);
                                  setYtReloadKey(prev => prev + 1);
                                }}
                                className={`px-2.5 py-2 rounded-xl font-mono flex flex-col items-start gap-1 transition-all cursor-pointer border text-left whitespace-nowrap ${
                                  isSelected
                                    ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                                    : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full gap-1">
                                  <span className="text-[12px] font-black leading-none whitespace-nowrap">{item.label}</span>
                                  <span className={`text-[7.5px] px-1 py-0.5 rounded font-extrabold uppercase whitespace-nowrap leading-none ${isSelected ? "bg-black text-white" : "bg-zinc-900 text-zinc-500"}`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <span className={`text-[8px] whitespace-nowrap leading-none ${isSelected ? "text-zinc-800" : "text-zinc-500"}`}>
                                  {item.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-900 text-[9px] font-mono text-zinc-400 space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="font-bold text-white text-[9.5px]">
                            {preferredVideoQuality === "hd1080" && "1080p (Full HD): Máxima qualidade visual de alta definição."}
                            {preferredVideoQuality === "hd720" && "720p (HD): Alta definição com menor consumo de dados."}
                            {preferredVideoQuality === "large" && "480p (SD): Reprodução suave, indicada para conexões intermediárias."}
                            {preferredVideoQuality === "medium" && "360p: Carregamento instantâneo para conexões 3G/4G oscilantes."}
                            {preferredVideoQuality === "auto" && "Automático: O YouTube ajusta a resolução de acordo com a banda da rede."}
                          </span>
                        </div>
                        <p className="text-[8px] text-zinc-500 leading-tight">
                          O Assistente de Taiga enviará os comandos de taxa e resolução inicial para que o reprodutor trave na qualidade selecionada desde o primeiro segundo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card: Extensão Trava 1080p Only (Injetor & Interceptador de Resolução) */}
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                        <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-white" />
                          Extensão: Trava 1080p Exclusiva
                        </span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black font-mono border uppercase tracking-wider flex items-center gap-1 ${
                          force1080pOnly
                            ? "bg-white text-black border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}>
                          <Lock className="w-2.5 h-2.5" />
                          {force1080pOnly ? "EXTENSÃO ATIVA" : "EXTENSÃO PAUSADA"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed mt-2 font-mono">
                        Módulo de extensão integrado que intercepta a API do YouTube Player e injeta parâmetros de alta definição (<code className="text-white bg-black/70 px-1 py-0.5 rounded">fmt=22</code>, <code className="text-white bg-black/70 px-1 py-0.5 rounded">vq=hd1080</code>) para impedir que o player caia para 360p/480p.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Toggle Extensão */}
                      <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-zinc-800">
                        <div className="space-y-0.5 pr-2">
                          <div className="text-[11px] font-mono font-bold text-zinc-200 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-white" />
                            Forçar Apenas 1080p (Full HD Lock)
                          </div>
                          <div className="text-[8.5px] font-mono text-zinc-400">
                            Bloqueia resoluções inferiores e repete o comando HD continuamente durante o vídeo
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = !force1080pOnly;
                            setForce1080pOnly(next);
                            if (next) {
                              setPreferredVideoQuality("hd1080");
                              triggerQualityAutoPulse("hd1080");
                              setYtReloadKey(k => k + 1);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer whitespace-nowrap leading-none border shrink-0 ${
                            force1080pOnly
                              ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                              : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                          }`}
                        >
                          {force1080pOnly ? "ATIVADO" : "DESATIVADO"}
                        </button>
                      </div>

                      {/* Botão de Disparo Imediato e Detalhes da Extensão */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreferredVideoQuality("hd1080");
                            triggerQualityAutoPulse("hd1080");
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-white/60 hover:text-white text-zinc-300 font-mono text-[9.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap leading-none shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>Pulsar Trava 1080p Agora</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const rawUrl = introUrl || DEFAULT_INTRO_URL;
                            const cleanId = getYouTubeVideoId(rawUrl) || "LurY80QqKsw";
                            const hdUrl = `https://www.youtube.com/watch?v=${cleanId}&vq=hd1080&fmt=22`;
                            navigator.clipboard?.writeText(hdUrl);
                            triggerQualityAutoPulse("hd1080");
                          }}
                          className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-[9.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap leading-none shadow-sm"
                          title="Copia link direto formatado com flags 1080p e fmt=22"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                          <span>Copiar URL Direta 1080p</span>
                        </button>
                      </div>

                      {/* Diagnóstico da Extensão */}
                      <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-900 text-[8.5px] font-mono text-zinc-400 space-y-1.5">
                        <div className="flex items-center justify-between text-zinc-300 font-bold border-b border-zinc-850 pb-1">
                          <span className="flex items-center gap-1.5 text-white">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            Parâmetros da Extensão Ativos no Iframe:
                          </span>
                          <span className="text-[7.5px] text-zinc-500 font-mono">Loop 1.2s Ativo</span>
                        </div>
                        <p className="text-zinc-400 leading-tight">
                          • <span className="text-zinc-200">vq=hd1080</span> & <span className="text-zinc-200">hd=1</span>: Notificam o YouTube a selecionar o stream Full HD de 1080 linhas.<br />
                          • <span className="text-zinc-200">fmt=22</span>: Força o container MP4 1080p/720p direto do servidor do Google.<br />
                          • <span className="text-zinc-200">setPlaybackQualityRange</span>: Limita o range mínimo para 1080p impedindo fallback automático.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Diagnóstico & Habilitação do Microfone (Mobile & Desktop) */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between text-left gap-3">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-white" />
                        Microfone no Celular (Mobile)
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold border ${
                        micPermission === "granted"
                          ? "bg-white/10 text-white border-white/30"
                          : micPermission === "denied"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}>
                        {micPermission === "granted" ? "LIBERADO" : micPermission === "denied" ? "BLOQUEADO" : "PENDENTE"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Permission status & action button */}
                      <div className="p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-400">Status de Permissão:</span>
                          <span className="text-[9px] font-mono font-bold text-zinc-200">
                            {micPermission === "granted" 
                              ? "Acesso Permitido" 
                              : micPermission === "denied"
                              ? "Bloqueado pelo Navegador"
                              : "Não Solicitado / Pendente"}
                          </span>
                        </div>

                        {/* Test / Enable Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await requestMicrophonePermission();
                            if (ok) {
                              setSpeechError("");
                            }
                          }}
                          className={`w-full py-2 px-3 rounded-lg font-mono font-black text-[9px] uppercase tracking-wide flex items-center justify-center gap-1.5 border transition-all cursor-pointer shadow-sm active:scale-95 ${
                            micPermission === "granted"
                              ? "bg-zinc-800 text-white border-zinc-700 hover:bg-white hover:text-black"
                              : "bg-white text-black border-black hover:bg-zinc-200"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{micPermission === "granted" ? "Testar Microfone Novamente" : "Habilitar Microfone no Celular"}</span>
                        </button>
                      </div>

                      {/* Live Audio Level Bar (when listening or testing) */}
                      {(isListening || isRecordingMedia || audioLevel > 0) && (
                        <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                          <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                            <span>Sinal do Microfone:</span>
                            <span className="text-white font-bold">{audioLevel}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                            <div 
                              className="bg-white h-full transition-all duration-75"
                              style={{ width: `${audioLevel}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Engine Selector */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-zinc-400 block">
                          Motor de Reconhecimento:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("auto")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "auto"
                                ? "bg-white text-black border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            Auto (Mobile)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("gemini")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "gemini"
                                ? "bg-white text-black border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            IA Gemini
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreferredSpeechEngine("native")}
                            className={`py-1.5 px-1 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer border text-center ${
                              preferredSpeechEngine === "native"
                                ? "bg-white text-black border-white"
                                : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
                            }`}
                          >
                            Nativo Web
                          </button>
                        </div>
                      </div>

                      {/* Help button for blocked permissions */}
                      <button
                        type="button"
                        onClick={() => setShowMicModal(true)}
                        className="w-full text-center text-[8px] font-mono text-zinc-400 hover:text-white underline cursor-pointer py-0.5"
                      >
                        O microfone não funciona? Ver instruções de desbloqueio
                      </button>
                    </div>
                  </div>

                  {/* Card 5: Ramos de Coníferas & Drones Árticos Eco-Design */}
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between text-left gap-3">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
                        <BranchLogo className="w-3.5 h-3.5 text-white" />
                        Ramos e Drones (Eco-Design)
                      </span>
                      <span className="text-[8px] font-mono bg-white/10 text-white px-2 py-0.5 rounded font-bold border border-white/20 uppercase">
                        Taiga
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-500 leading-normal font-mono">
                      Controle a presença visual dos ramos de coníferas com geada na moldura e dos drones autônomos de monitoramento da Taiga.
                    </p>

                    <div className="space-y-2.5">
                      {/* Ramos Toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                            <BranchLogo className="w-3.5 h-3.5 text-white" /> Ramos da Taiga
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 block">
                            Galhos de pinheiro com geada prateada e cristais de gelo
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowVines(prev => !prev)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border border-zinc-800 shrink-0 ${
                            showVines ? "bg-white" : "bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-black block absolute top-0.5 transition-transform ${
                              showVines ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Drones Toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-900">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                            <span>🛸</span> Drones de Monitoramento
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 block">
                            Drones de patrulha aérea TG-01, sonda acústica TG-02 e sentinela TG-03
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDrones(prev => !prev)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border border-zinc-800 shrink-0 ${
                            showDrones ? "bg-white" : "bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-black block absolute top-0.5 transition-transform ${
                              showDrones ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Voice Triggers Grid (Col Span: 8) */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Mini control bar */}
                  <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-2 gap-2">
                    <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap leading-none">
                      <Mic className="w-3.5 h-3.5 text-white" />
                      Gatilhos Cadastrados ({questions.length})
                    </span>

                    <button
                      type="button"
                      onClick={resetToCodeDefaults}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-white hover:text-black text-zinc-300 font-mono text-[9px] font-bold uppercase transition-all cursor-pointer border border-zinc-800 hover:border-black shadow-sm whitespace-nowrap leading-none"
                      title="Restaura os links gravados diretamente no código da ferramenta para qualquer dispositivo"
                    >
                      <Database className="w-3 h-3 text-white shrink-0" />
                      <span className="whitespace-nowrap leading-none">Restaurar Links do Código</span>
                    </button>
                  </div>

                  {/* Elegant Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                    {questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="bg-zinc-950/80 border border-zinc-900 hover:border-white/40 rounded-xl p-4 flex flex-col justify-between gap-3 text-left transition-all duration-200"
                      >
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                            Canal #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {q.videoUrl && (
                              <span className="text-[8px] bg-white/10 text-white px-1.5 py-0.5 rounded font-extrabold font-mono border border-white/20">
                                ATIVO
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeQuestion(q.id)}
                              className="text-zinc-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                              title="Excluir Gatilho"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          
                          {/* Phrase input */}
                          <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">
                              Frase Ativadora:
                            </label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-100 focus:outline-none font-bold font-mono"
                              value={q.phrase}
                              onChange={(e) => updateQuestionPhrase(q.id, e.target.value)}
                              placeholder="Ex: Me fale dos animais de Taiga"
                            />
                          </div>

                          {/* URL Input (YouTube / Web) */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-mono font-bold">
                              <span>URL (YouTube / Link Web):</span>
                              {isYouTubeUrl(q.videoUrl) ? (
                                <span className="text-[8px] bg-red-600/25 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-black">
                                  YOUTUBE
                                </span>
                              ) : q.videoUrl?.startsWith("http") ? (
                                <span className="text-[8px] bg-white/20 text-white border border-white/30 px-1.5 py-0.2 rounded font-black">
                                  LINK WEB
                                </span>
                              ) : q.videoUrl ? (
                                <span className="text-[8px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded font-black">
                                  LOCAL
                                </span>
                              ) : null}
                            </div>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
                              value={q.videoUrl}
                              onChange={(e) => handleUrlChange(q.id, e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=... ou .mp4"
                            />
                          </div>

                          {/* Video file upload option as fallback */}
                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 border border-dashed border-zinc-800 hover:border-white/50 bg-zinc-950/60 rounded-lg p-1.5 text-center cursor-pointer transition-all flex items-center justify-center gap-1 min-h-[32px]">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileChange(q.id, file);
                                }}
                                className="hidden"
                              />
                              <Upload className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <span className="text-zinc-400 font-mono text-[8px] truncate">
                                {q.videoName && !q.videoUrl?.startsWith("http") ? q.videoName : "Ou arquivo local (.mp4)"}
                              </span>
                            </label>
                          </div>

                          {/* Trigger test button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (q.videoUrl) {
                                triggerVideoSlot(q.id);
                                setActiveTab("chat");
                              }
                            }}
                            disabled={!q.videoUrl}
                            className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-350 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer font-bold font-mono text-[9px] uppercase shadow-sm"
                          >
                            Testar Canal em Tela Cheia
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Streamlined "Add" card trigger slot */}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="border border-dashed border-zinc-800 hover:border-white/50 rounded-xl p-4 flex flex-col justify-center items-center gap-2 hover:bg-zinc-900/25 transition-all cursor-pointer text-zinc-500 hover:text-zinc-300 min-h-[190px]"
                    >
                      <div className="w-10 h-10 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:border-white">
                        <span className="text-base leading-none font-bold">+</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider font-mono block text-zinc-300">Novo Gatilho</span>
                        <span className="text-[9px] text-zinc-500 mt-1 max-w-[170px] block mx-auto leading-normal font-mono">
                          Associe um novo link de vídeo a um comando.
                        </span>
                      </div>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Clean Aesthetic Footer (Apenas na aba de Ajustes para manter a tela inicial limpa) */}
      {activeTab === "settings" && !hidePanels && !isFullscreen && (
        <footer id="ecobot-footer" className="mt-auto py-6 border-t border-zinc-900 bg-zinc-950/80">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 gap-2">
            <span>ASSISTENTE DE TAIGA — BIOMA & PRESERVAÇÃO</span>
            <span>© CONEXÃO INTERATIVA DE VÍDEO</span>
          </div>
        </footer>
      )}

      {/* Floating Action Button to Restore Panels & Restart (Visible only when panels are hidden) */}
      {hidePanels && !isFullscreen && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-24 bg-transparent flex items-end pb-4 justify-center pointer-events-auto z-50 group select-none">
          <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setHidePanels(false)}
              className="flex items-center gap-2.5 px-5 py-3.5 bg-black text-white hover:bg-white hover:text-black font-display font-black text-xs uppercase tracking-widest rounded-full border-3 border-black shadow-[5px_5px_0px_0px_rgba(255,255,255,0.4)] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] active:translate-y-[2px] active:shadow-none transition-all duration-300 cursor-pointer text-glow-white hover:text-glow-none"
              title="Mostrar Painel, Configurações e todos os controles de volta"
            >
              <Eye className="w-4 h-4 animate-pulse" />
              <span>Retornar com o Painel</span>
            </button>

            <button
              onClick={() => {
                setHasStarted(false);
                setHidePanels(false);
              }}
              className="flex items-center gap-2.5 px-5 py-3.5 bg-black text-rose-500 hover:bg-rose-500 hover:text-white font-display font-black text-xs uppercase tracking-widest rounded-full border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all duration-300 cursor-pointer"
              title="Reiniciar toda a experimentação e voltar para a tela inicial"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Experimentação</span>
            </button>
          </div>
        </div>
      )}
      {activeTab === "chat" && !isFullscreen && (!hasStarted || videoFinished) && (
        <div className="fixed bottom-6 right-6 z-[45] flex flex-col items-end gap-1.5 pointer-events-auto animate-fade-in">
          <div className="flex items-center gap-1.5 bg-zinc-950/95 border-2 border-black px-2.5 py-1 rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] text-[8px] font-mono font-bold uppercase transition-all duration-300">
            <span className={`w-1.5 h-1.5 rounded-full ${isListening || isRecordingMedia ? "bg-red-500 animate-pulse" : "bg-white"}`} />
            <span className={isListening || isRecordingMedia ? "text-red-400 font-extrabold animate-pulse" : "text-zinc-400"}>
              {isListening || isRecordingMedia ? (isRecordingMedia ? `GRAVANDO ${recordingDuration}s` : "ESCUTA ATIVA") : "FALAR POR VOZ"}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-3 border-black cursor-pointer shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] ${
              isListening || isRecordingMedia
                ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.45)]"
                : "bg-white text-black hover:bg-zinc-200"
            }`}
            title={isListening || isRecordingMedia ? "Desativar escuta de voz" : "Ativar microfone para acionar comando de voz"}
          >
            {isListening || isRecordingMedia ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Mobile Microphone Permission Guide Modal */}
      {showMicModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border-3 border-black rounded-3xl w-full max-w-lg p-6 flex flex-col gap-4 text-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-white" />
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                  Como Habilitar o Microfone no Celular
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMicModal(false)}
                className="text-zinc-500 hover:text-white p-1 text-xs font-mono font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <p className="text-zinc-300 leading-relaxed">
                Para responder por voz aos vídeos do Assistente de Taiga no celular, o navegador precisa da sua autorização para captar áudio:
              </p>

              {/* Android Instructions */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-white font-bold block uppercase text-[10px] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  No Android (Google Chrome):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px]">
                  <li>Toque no ícone de <strong>configurações de site</strong> (à esquerda da URL).</li>
                  <li>Toque em <strong>Permissões</strong> &gt; <strong>Microfone</strong>.</li>
                  <li>Marque como <strong>Permitir</strong>.</li>
                </ol>
              </div>

              {/* iPhone / Safari Instructions */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-white font-bold block uppercase text-[10px] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  No iPhone / iPad (Safari):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px]">
                  <li>Toque no botão <strong>aA</strong> na barra de endereços do Safari.</li>
                  <li>Selecione <strong>Ajustes do Site</strong>.</li>
                  <li>Em <strong>Microfone</strong>, escolha <strong>Permitir</strong>.</li>
                </ol>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2.5 mt-2 border-t border-zinc-900 pt-3">
              <button
                type="button"
                onClick={() => setShowMicModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-lg border border-zinc-800 transition-all cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await requestMicrophonePermission();
                  if (ok) {
                    setShowMicModal(false);
                    setSpeechError("");
                  }
                }}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-mono text-[10px] font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autorizar e Testar Microfone Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border-3 border-black rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 text-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
              {confirmModal.title}
            </h3>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold uppercase rounded-lg border border-zinc-800 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-black uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
