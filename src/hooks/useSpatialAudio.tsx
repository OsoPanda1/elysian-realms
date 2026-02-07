import { useRef, useEffect, useCallback, useState } from 'react';

export type District =
  | 'plaza'
  | 'templo'
  | 'santuario'
  | 'tianguis'
  | 'murallas'
  | 'origen';

/* ======================================================
   KAOS · SPATIAL AUDIO SYSTEM (EVOLVED)
   - API intacta
   - Inmersión profunda
   - Transiciones emocionales
====================================================== */

export function useSpatialAudio() {
  const [currentDistrict, setCurrentDistrict] = useState<District>('plaza');
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambienceBusRef = useRef<GainNode | null>(null);

  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  /* ===================== INIT ===================== */

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const ambienceBus = ctx.createGain();
    ambienceBus.gain.value = 1;
    ambienceBus.connect(master);

    const panner = ctx.createStereoPanner();
    panner.pan.value = 0;
    panner.connect(ambienceBus);

    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    ambienceBusRef.current = ambienceBus;
    pannerRef.current = panner;

    setIsReady(true);
  }, []);

  /* ===================== AMBIENCE CORE ===================== */

  const createAmbientLayer = useCallback(
    (district: District) => {
      if (!audioCtxRef.current || !pannerRef.current) return [];

      const ctx = audioCtxRef.current;
      const oscillators: OscillatorNode[] = [];
      const filters: BiquadFilterNode[] = [];

      const profiles: Record<District, number[]> = {
        origen: [110, 165, 220],
        plaza: [90, 130, 180],
        templo: [55, 110, 165],
        santuario: [220, 330, 440],
        tianguis: [100, 150, 200],
        murallas: [40, 80, 120],
      };

      profiles[district].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 400 + i * 200;

        gain.gain.value = 0.15;

        // Subtle drift (breathing)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.05 + Math.random() * 0.05;
        lfoGain.gain.value = 6;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(pannerRef.current);

        osc.start();

        oscillators.push(osc);
        filters.push(filter);
      });

      oscillatorsRef.current = oscillators;
      filtersRef.current = filters;

      return oscillators;
    },
    [],
  );

  /* ===================== DISTRICT SWITCH ===================== */

  const switchDistrict = useCallback(
    (district: District) => {
      setCurrentDistrict(district);

      if (!audioCtxRef.current || isMuted) return;

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Fade out old ambience
      ambienceBusRef.current?.gain.linearRampToValueAtTime(0, now + 0.6);

      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });

        oscillatorsRef.current = [];

        // Fade in new ambience
        ambienceBusRef.current!.gain.setValueAtTime(0, ctx.currentTime);
        ambienceBusRef.current!.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.8);

        createAmbientLayer(district);
      }, 600);
    },
    [isMuted, createAmbientLayer],
  );

  /* ===================== MUTE ===================== */

  const toggleMute = useCallback(() => {
    if (!audioCtxRef.current) initAudio();

    setIsMuted((prev) => {
      const ctx = audioCtxRef.current!;
      const now = ctx.currentTime;

      masterGainRef.current!.gain.cancelScheduledValues(now);
      masterGainRef.current!.gain.linearRampToValueAtTime(
        prev ? 0.12 : 0,
        now + 0.5,
      );

      if (prev && oscillatorsRef.current.length === 0) {
        createAmbientLayer(currentDistrict);
      }

      return !prev;
    });
  }, [initAudio, currentDistrict, createAmbientLayer]);

  /* ===================== SFX ===================== */

  const playSFX = useCallback(
    (type: 'confirm' | 'click' | 'success' | 'error' | 'transition') => {
      if (!audioCtxRef.current || isMuted) return;

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const tones = {
        confirm: 440,
        click: 880,
        success: 660,
        error: 220,
        transition: 330,
      };

      osc.frequency.value = tones[type];
      osc.type = 'triangle';

      gain.gain.value = 0.08;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    },
    [isMuted],
  );

  /* ===================== CLEANUP ===================== */

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      audioCtxRef.current?.close();
    };
  }, []);

  return {
    currentDistrict,
    switchDistrict,
    isMuted,
    toggleMute,
    isReady,
    initAudio,
    playSFX,
  };
}
