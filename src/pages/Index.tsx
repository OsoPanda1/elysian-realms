import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { VRWorld } from "@/components/3d/VRWorld";
import { WorldHUD } from "@/components/world/WorldHUD";

const INTRO_DURATION = 6500; // 6.5s ritual

const hasSeenIntro = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("tamv_intro_seen") === "true";
  } catch {
    return false;
  }
};

const markIntroSeen = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("tamv_intro_seen", "true");
  } catch {
    // ignore
  }
};

const Index = () => {
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());
  const [introProgress, setIntroProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animación de barra de progreso suave y sincronizada con el ritual
  useEffect(() => {
    if (!showIntro) return;

    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / INTRO_DURATION, 1);
      setIntroProgress(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    const timer = setTimeout(() => {
      setShowIntro(false);
      markIntroSeen();
    }, INTRO_DURATION);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [showIntro]);

  // Hook para voz de Anubis (lista para TTS/archivo)
  useEffect(() => {
    if (!showIntro) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      return;
    }

    const el = document.getElementById("tamv-intro-voice") as HTMLAudioElement;
    if (!el) return;
    audioRef.current = el;

    const playVoice = async () => {
      try {
        // Aquí puedes asignar dinámicamente el src via TTS/Isabella
        // el.src = "/audio/anubis-intro.mp3";
        await el.play();
      } catch {
        // Autoplay bloqueado: el usuario verá solo la intro visual
      }
    };

    playVoice();
  }, [showIntro]);

  const handleSkip = () => {
    setShowIntro(false);
    markIntroSeen();
  };

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* Audio oculto para la voz de Anubis */}
      <audio id="tamv-intro-voice" preload="auto" className="hidden">
        {/* src se puede inyectar por servidor o TTS */}
      </audio>

      <Navigation />

      <main className="relative h-[calc(100vh-4rem)] w-full bg-black">
        {/* Mundo XR permanente */}
        <div className="absolute inset-0">
          <VRWorld />
        </div>

        {/* HUD permanente */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          <WorldHUD />
        </div>

        {/* INTRO CINEMATOGRÁFICA XR-FIRST */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {/* Capa de “campo de energía” sobre el mundo */}
              <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.2),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.9),_transparent_30%,_rgba(0,0,0,0.95))]" />
              </div>

              {/* “Lluvia” de columnas de código */}
              <div className="pointer-events-none absolute inset-0 mix-blend-screen">
                <div className="absolute left-1/5 top-0 h-full w-px animate-[slideDown_2.4s_linear_infinite] bg-gradient-to-b from-emerald-400 via-emerald-200 to-transparent" />
                <div className="absolute left-1/2 top-0 h-full w-px animate-[slideDown_1.9s_linear_infinite] bg-gradient-to-b from-emerald-500 via-emerald-200 to-transparent" />
                <div className="absolute left-4/5 top-0 h-full w-px animate-[slideDown_2.8s_linear_infinite] bg-gradient-to-b from-cyan-400 via-emerald-200 to-transparent" />
              </div>

              {/* Núcleo del ritual */}
              <div className="relative z-40 flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
                <motion.p
                  className="text-[11px] font-mono uppercase tracking-[0.35em] text-emerald-300/80"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  PROTOCOLO DE INICIACIÓN · TAMV·ONLINE
                </motion.p>

                <motion.h1
                  className="text-3xl md:text-4xl font-semibold tracking-[0.12em] text-emerald-100 drop-shadow-[0_0_45px_rgba(16,185,129,0.9)]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
                >
                  LA NUEVA TENOCHTITLAN DESPIERTA
                </motion.h1>

                <motion.p
                  className="max-w-xl text-xs md:text-sm text-emerald-100/80"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                >
                  No entras a una app. Cruzas el umbral a una ciudad‑nación XR,
                  vigilada por guardianes, radares y un libro de memoria
                  inmutable que recuerda cada decisión.
                </motion.p>

                {/* Barra de carga sincronizada */}
                <motion.div
                  className="mt-4 flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <div className="h-1 w-40 overflow-hidden rounded-full bg-emerald-900/60">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-500 transition-[width] duration-100 ease-out"
                      style={{ width: `${introProgress * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/70">
                    INICIALIZANDO CIVILIZACIÓN DIGITAL · {Math.round(introProgress * 100)}%
                  </p>
                </motion.div>

                {/* Mensaje de voz (texto espejo de la voz de Anubis) */}
                <motion.p
                  className="mt-3 text-[11px] font-mono text-emerald-200/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  “Yo soy Anubis Villaseñor. Bienvenido a mi mundo digital.  
                  Te estaba esperando. Ya formas parte de la élite.”
                </motion.p>
              </div>

              {/* Botón de salto para usuarios impacientes */}
              <button
                type="button"
                onClick={handleSkip}
                className="absolute bottom-6 right-6 z-40 rounded-full border border-emerald-500/50 bg-black/60 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-200/80 hover:bg-emerald-500/10 transition-colors"
              >
                Saltar ritual
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
