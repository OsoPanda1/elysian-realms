import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float, Environment, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Shield, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';

// Sacred Stone Portal with enhanced visuals
function SacredPortal() {
  const portalRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={portalRef}>
      {/* Outer Ring */}
      <mesh ref={ringRef} position={[0, 3, -5]}>
        <torusGeometry args={[3.5, 0.1, 16, 100]} />
        <meshStandardMaterial 
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Main Portal Structure - Obsidian Stone */}
      <mesh position={[0, 3, -5]}>
        <torusGeometry args={[3, 0.5, 16, 100]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.2}
          metalness={0.8}
          emissive="#00d4ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Inner Light Portal */}
      <mesh ref={glowRef} position={[0, 3, -5]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial 
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy Particles */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 2 + Math.sin(i * 0.5) * 0.5;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              3 + Math.sin(angle + i) * 0.5,
              -5 + Math.sin(angle) * 0.3
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#00d4ff" : "#ff00ff"}
              emissive={i % 2 === 0 ? "#00d4ff" : "#ff00ff"}
              emissiveIntensity={2}
            />
          </mesh>
        );
      })}

      {/* Ceremonial Pillars */}
      {[-4, 4].map((x, i) => (
        <group key={i} position={[x, 0, -6]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
            <meshStandardMaterial 
              color="#2d2d44"
              roughness={0.3}
              metalness={0.7}
              emissive="#d4af37"
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Gold Cap */}
          <mesh position={[0, 6.2, 0]}>
            <coneGeometry args={[0.5, 0.8, 8]} />
            <meshStandardMaterial 
              color="#d4af37"
              roughness={0.2}
              metalness={0.9}
              emissive="#d4af37"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Glyphs on pillars */}
          {[1, 2.5, 4].map((y, j) => (
            <mesh key={j} position={[0.35, y, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.4, 0.4]} />
              <meshStandardMaterial 
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={0.5 + Math.sin(j) * 0.3}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Water-Data Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#0a0a1a"
          roughness={0.1}
          metalness={0.9}
          emissive="#00d4ff"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Altar */}
      <mesh position={[0, 0.5, -3]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.2}
          metalness={0.8}
          emissive="#d4af37"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 1.2, -3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
        <meshStandardMaterial 
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.8}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// Floating particles in the scene
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    
    const color = new THREE.Color(Math.random() > 0.5 ? '#00d4ff' : '#ff00ff');
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} />
    </points>
  );
}

type Step = 'loading' | 'intro' | 'dedication' | 'acknowledgment' | 'complete';

interface WorldEntryGateCompleteProps {
  onEnter: () => void;
}

export function WorldEntryGateComplete({ onEnter }: WorldEntryGateCompleteProps) {
  const { user, profile, updateProfile } = useAuth();
  const { initAudio, playSFX } = useSpatialAudio();
  const [step, setStep] = useState<Step>('loading');
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if user already acknowledged
  useEffect(() => {
    if (profile?.dedication_acknowledged) {
      setStep('complete');
      setTimeout(onEnter, 500);
    } else if (profile) {
      setStep('intro');
    }
  }, [profile, onEnter]);

  const handleContinue = useCallback(() => {
    initAudio();
    playSFX('click');
    setStep('dedication');
  }, [initAudio, playSFX]);

  const handleAcknowledge = useCallback(async () => {
    if (!user) {
      toast.error('Debes iniciar sesión primero');
      return;
    }

    setIsRegistering(true);
    playSFX('confirm');

    try {
      // 1. Update profile - mark dedication as acknowledged
      const { error: profileError } = await updateProfile({ 
        dedication_acknowledged: true,
        onboarding_completed: true,
      });

      if (profileError) throw profileError;

      // 2. Register foundational event in MSR (registry table)
      const { error: registryError } = await supabase
        .from('registry')
        .insert({
          user_id: user.id,
          act_type: 'FOUNDATIONAL_EVENT',
          description: 'Acto fundacional: Reconocimiento de la Dedicatoria a Reina Trejo Serrano',
          content_hash: btoa(JSON.stringify({
            userId: user.id,
            timestamp: new Date().toISOString(),
            action: 'DEDICATION_ACKNOWLEDGED',
            dedicatee: 'Reina Trejo Serrano',
          })),
          is_immutable: true,
          metadata: {
            type: 'WorldEntryGate',
            version: '1.0.0',
            citizen_did: profile?.did || 'pending',
          }
        });

      if (registryError) {
        console.error('Registry error:', registryError);
        // Continue anyway - don't block user entry
      }

      playSFX('success');
      setStep('acknowledgment');
      
      // Transition to complete after animation
      setTimeout(() => {
        setStep('complete');
        setTimeout(onEnter, 1000);
      }, 3000);

    } catch (error) {
      console.error('Acknowledgment error:', error);
      playSFX('error');
      toast.error('Error registrando tu acto fundacional. Intenta de nuevo.');
    } finally {
      setIsRegistering(false);
    }
  }, [user, profile, updateProfile, playSFX, onEnter]);

  if (step === 'loading') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-display">Preparando la Puerta de Origen...</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#00d4ff" />
        <pointLight position={[0, 3, -5]} intensity={2} color="#d4af37" />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff00ff" />
        <spotLight position={[0, 15, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <FloatingParticles />
        <SacredPortal />
        <fog attach="fog" args={['#050510', 10, 50]} />
        <Environment preset="night" />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-2xl mx-auto px-6 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-aurora flex items-center justify-center glow-primary"
              >
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="font-display text-3xl md:text-5xl font-bold mb-4 text-gradient-aurora"
              >
                PUERTA DE ORIGEN
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Estás por entrar a <span className="text-primary font-display">TAMV</span>, 
                la primera civilización digital soberana.
                <br />
                Antes de continuar, conocerás el origen de todo.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex justify-center gap-4 flex-wrap"
              >
                <div className="glass rounded-lg px-4 py-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">MSR Registry</span>
                </div>
                <div className="glass rounded-lg px-4 py-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-sm">BookPI Record</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-8"
              >
                <Button
                  size="lg"
                  className="bg-aurora text-primary-foreground font-display glow-primary"
                  onClick={handleContinue}
                >
                  Continuar al Acto Fundacional
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 'dedication' && (
            <motion.div
              key="dedication"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-3xl mx-auto px-6 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-[hsl(45,100%,60%)] to-amber-600 flex items-center justify-center glow-gold"
              >
                <Heart className="w-8 h-8 text-background fill-current" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl md:text-4xl font-bold mb-6 text-gradient-gold"
              >
                DEDICATORIA
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-strong rounded-2xl p-8 mb-8 border border-[hsl(45,100%,60%)]/20"
              >
                <p className="text-xl md:text-2xl font-display text-[hsl(45,100%,60%)] mb-4">
                  A Reina Trejo Serrano
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                  Mujer de hierro. Pilar invisible. Origen de todo.
                </p>
                <p className="text-sm text-muted-foreground/80 italic leading-relaxed">
                  Una mujer que soportó golpes durante décadas. Que conoció el dolor antes que el descanso. 
                  Que fue quebrada por la vida muchas veces, pero jamás doblada.
                  <br /><br />
                  Este sistema, esta civilización, este mundo… existen porque ella resistió.
                  <br /><br />
                  TAMV Online lleva su nombre en silencio, inscrito en cada capa invisible del sistema, 
                  como homenaje eterno a una mujer que enseñó que <strong className="text-foreground">la dignidad no se negocia, se encarna.</strong>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Al continuar, reconoces el origen sagrado de esta civilización.
                  <br />
                  Este acto quedará registrado permanentemente en <span className="text-primary">MSR</span> y <span className="text-accent">BookPI</span>.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[hsl(45,100%,60%)] to-amber-600 text-background font-display glow-gold"
                  onClick={handleAcknowledge}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando en MSR...
                    </span>
                  ) : (
                    'Reconocer y Entrar a TAMV'
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 'acknowledgment' && (
            <motion.div
              key="acknowledgment"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-xl mx-auto px-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-aurora flex items-center justify-center glow-primary"
              >
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <h2 className="font-display text-3xl font-bold mb-4 text-gradient-aurora">
                Bienvenido, Ciudadano
              </h2>
              <p className="text-muted-foreground">
                Tu acto fundacional ha sido registrado.
                <br />
                Ahora eres parte de la historia de TAMV.
              </p>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                className="h-1 bg-aurora rounded-full mt-8"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
