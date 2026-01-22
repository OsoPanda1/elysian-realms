import { useRef, useEffect, useCallback, useState } from 'react';

export type District = 'plaza' | 'templo' | 'santuario' | 'tianguis' | 'murallas' | 'origen';

interface AudioTrack {
  url: string;
  volume: number;
  loop: boolean;
}

// KAOS Spatial Audio System - Ambient sounds per district
const DISTRICT_AUDIO: Record<District, AudioTrack[]> = {
  origen: [
    { url: '/audio/ambient/sacred-bells.mp3', volume: 0.3, loop: true },
    { url: '/audio/ambient/water-flow.mp3', volume: 0.2, loop: true },
  ],
  plaza: [
    { url: '/audio/ambient/city-murmur.mp3', volume: 0.25, loop: true },
    { url: '/audio/ambient/digital-hum.mp3', volume: 0.15, loop: true },
    { url: '/audio/ambient/water-channels.mp3', volume: 0.2, loop: true },
  ],
  templo: [
    { url: '/audio/ambient/temple-resonance.mp3', volume: 0.3, loop: true },
    { url: '/audio/ambient/ancient-whispers.mp3', volume: 0.15, loop: true },
    { url: '/audio/ambient/stone-echo.mp3', volume: 0.1, loop: true },
  ],
  santuario: [
    { url: '/audio/ambient/ethereal-choir.mp3', volume: 0.25, loop: true },
    { url: '/audio/ambient/crystal-tones.mp3', volume: 0.2, loop: true },
    { url: '/audio/ambient/ai-presence.mp3', volume: 0.15, loop: true },
  ],
  tianguis: [
    { url: '/audio/ambient/market-bustle.mp3', volume: 0.3, loop: true },
    { url: '/audio/ambient/coin-chimes.mp3', volume: 0.15, loop: true },
    { url: '/audio/ambient/trade-murmurs.mp3', volume: 0.2, loop: true },
  ],
  murallas: [
    { url: '/audio/ambient/guardian-pulse.mp3', volume: 0.3, loop: true },
    { url: '/audio/ambient/defense-hum.mp3', volume: 0.2, loop: true },
    { url: '/audio/ambient/watchful-silence.mp3', volume: 0.15, loop: true },
  ],
};

// Synthesized ambient audio using Web Audio API (fallback when no files exist)
function createSynthAmbient(ctx: AudioContext, district: District): OscillatorNode[] {
  const oscillators: OscillatorNode[] = [];
  
  const districtConfigs: Record<District, { freq: number; type: OscillatorType; detune: number }[]> = {
    origen: [
      { freq: 110, type: 'sine', detune: 0 },
      { freq: 165, type: 'sine', detune: 5 },
      { freq: 220, type: 'sine', detune: -3 },
    ],
    plaza: [
      { freq: 80, type: 'sine', detune: 0 },
      { freq: 120, type: 'triangle', detune: 2 },
      { freq: 160, type: 'sine', detune: -2 },
    ],
    templo: [
      { freq: 55, type: 'sine', detune: 0 },
      { freq: 110, type: 'sine', detune: 7 },
      { freq: 165, type: 'triangle', detune: -5 },
    ],
    santuario: [
      { freq: 220, type: 'sine', detune: 0 },
      { freq: 330, type: 'sine', detune: 3 },
      { freq: 440, type: 'sine', detune: -3 },
    ],
    tianguis: [
      { freq: 100, type: 'sawtooth', detune: 0 },
      { freq: 150, type: 'triangle', detune: 5 },
      { freq: 200, type: 'sine', detune: -5 },
    ],
    murallas: [
      { freq: 40, type: 'sine', detune: 0 },
      { freq: 80, type: 'square', detune: 10 },
      { freq: 120, type: 'triangle', detune: -10 },
    ],
  };

  const configs = districtConfigs[district];
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.03; // Very subtle
  masterGain.connect(ctx.destination);

  configs.forEach((config) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = config.type;
    osc.frequency.value = config.freq;
    osc.detune.value = config.detune;
    
    // LFO for subtle movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1 + Math.random() * 0.2;
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    gain.gain.value = 0.3 + Math.random() * 0.2;
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    
    oscillators.push(osc);
  });

  return oscillators;
}

export function useSpatialAudio() {
  const [currentDistrict, setCurrentDistrict] = useState<District>('plaza');
  const [isMuted, setIsMuted] = useState(true); // Start muted - user must interact first
  const [isReady, setIsReady] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on user interaction
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    
    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = 0;
      masterGainRef.current.connect(audioCtxRef.current.destination);
      setIsReady(true);
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }, []);

  // Switch district audio
  const switchDistrict = useCallback((district: District) => {
    setCurrentDistrict(district);
    
    if (!audioCtxRef.current || isMuted) return;

    // Stop current oscillators
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorsRef.current = [];

    // Create new ambient for district
    oscillatorsRef.current = createSynthAmbient(audioCtxRef.current, district);
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioCtxRef.current) {
      initAudio();
    }
    
    setIsMuted(prev => {
      const newMuted = !prev;
      
      if (audioCtxRef.current && masterGainRef.current) {
        // Fade in/out
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(
          masterGainRef.current.gain.value, 
          now
        );
        masterGainRef.current.gain.linearRampToValueAtTime(
          newMuted ? 0 : 0.1, 
          now + 0.5
        );

        if (!newMuted && oscillatorsRef.current.length === 0) {
          oscillatorsRef.current = createSynthAmbient(audioCtxRef.current, currentDistrict);
        }
      }
      
      return newMuted;
    });
  }, [initAudio, currentDistrict]);

  // Play one-shot sound effect
  const playSFX = useCallback((type: 'confirm' | 'click' | 'success' | 'error' | 'transition') => {
    if (!audioCtxRef.current || isMuted) return;
    
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    const configs: Record<string, { freq: number; duration: number; type: OscillatorType }> = {
      confirm: { freq: 440, duration: 0.3, type: 'sine' },
      click: { freq: 880, duration: 0.1, type: 'square' },
      success: { freq: 660, duration: 0.4, type: 'sine' },
      error: { freq: 220, duration: 0.3, type: 'sawtooth' },
      transition: { freq: 330, duration: 0.5, type: 'triangle' },
    };
    
    const config = configs[type];
    osc.type = config.type;
    osc.frequency.value = config.freq;
    
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + config.duration);
  }, [isMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
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
