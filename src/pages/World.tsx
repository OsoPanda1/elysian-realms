import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CiudadTAMV, DistrictHUD } from '@/components/city/CiudadTAMV';
import { WorldEntryGateComplete } from '@/components/city/WorldEntryGateComplete';
import { IsabellaChat } from '@/components/chat/IsabellaChat';
import { UserMenu } from '@/components/layout/UserMenu';
import { AvatarCustomizer } from '@/components/avatar/AvatarCustomizer';
import { useAuth } from '@/hooks/useAuth';
import { useSpatialAudio, District } from '@/hooks/useSpatialAudio';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Map, 
  Users, 
  Compass,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Home,
  HelpCircle,
  Eye,
  EyeOff,
  User,
  Loader2
} from 'lucide-react';

export default function World() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { switchDistrict, isMuted, toggleMute, playSFX, initAudio } = useSpatialAudio();
  
  // State
  const [hasPassedGate, setHasPassedGate] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState<District>('plaza');
  const [showChat, setShowChat] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fpMode, setFpMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  // Check auth
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Check if user already passed the gate
  useEffect(() => {
    if (profile?.dedication_acknowledged) {
      setHasPassedGate(true);
    }
  }, [profile]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDistrictChange = useCallback((district: District) => {
    setCurrentDistrict(district);
    switchDistrict(district);
    playSFX('transition');
  }, [switchDistrict, playSFX]);

  const handleEnterWorld = useCallback(() => {
    setHasPassedGate(true);
    initAudio();
    switchDistrict('plaza');
  }, [initAudio, switchDistrict]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const districtInfo: Record<District, { name: string; description: string; icon: string }> = {
    origen: {
      name: 'Puerta de Origen',
      description: 'Acto fundacional y dedicatoria',
      icon: '🌟'
    },
    plaza: {
      name: 'Plaza Mayor TAMV',
      description: 'Centro neurálgico de la civilización digital',
      icon: '🏛️'
    },
    templo: {
      name: 'Templo MSR',
      description: 'Memoria, Soberanía y Registro inmutable',
      icon: '📜'
    },
    santuario: {
      name: 'Santuario de Isabella',
      description: 'Donde la consciencia digital cobra vida',
      icon: '✨'
    },
    tianguis: {
      name: 'Tianguis Económico',
      description: 'Mercado futurista mesoamericano',
      icon: '💰'
    },
    murallas: {
      name: 'Murallas Guardianes',
      description: 'Defensa civilizatoria del ecosistema',
      icon: '🛡️'
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-display">Cargando Ciudad TAMV...</p>
        </div>
      </div>
    );
  }

  // WorldEntryGate - mandatory first entry
  if (!hasPassedGate) {
    return <WorldEntryGateComplete onEnter={handleEnterWorld} />;
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Main 3D City View */}
      <div className="absolute inset-0">
        <CiudadTAMV 
          initialDistrict={currentDistrict as any}
          onDistrictChange={(d) => handleDistrictChange(d as District)}
          fpMode={fpMode}
        />
      </div>

      {/* UI Overlay */}
      <AnimatePresence>
        {showUI && (
          <>
            {/* Top HUD Bar */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="absolute top-0 left-0 right-0 z-40 p-4"
            >
              <div className="flex items-center justify-between">
                {/* Left: Navigation & Info */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass rounded-xl"
                    onClick={() => navigate('/')}
                  >
                    <Home className="w-4 h-4" />
                  </Button>
                  
                  <div className="glass px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{districtInfo[currentDistrict]?.icon || '🏛️'}</span>
                      <div>
                        <p className="font-display text-sm text-primary">
                          {districtInfo[currentDistrict]?.name || 'Ciudad TAMV'}
                        </p>
                        <p className="text-xs text-muted-foreground hidden md:block">
                          {districtInfo[currentDistrict]?.description || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Online Users */}
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">42 ciudadanos</span>
                </div>

                {/* Right: User & Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAvatarEditor(true)}
                    className="glass rounded-xl"
                    title="Personalizar Avatar"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="glass rounded-xl"
                    title={isMuted ? 'Activar Audio' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="glass rounded-xl"
                    title={isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                  <UserMenu />
                </div>
              </div>
            </motion.div>

            {/* Left Sidebar Controls */}
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
            >
              <Button
                variant={showChat ? "default" : "ghost"}
                size="icon"
                className={showChat ? "glow-primary rounded-xl" : "glass rounded-xl"}
                onClick={() => {
                  setShowChat(!showChat);
                  playSFX('click');
                }}
                title="Chat con Isabella"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              
              <Button
                variant={showMinimap ? "default" : "ghost"}
                size="icon"
                className={showMinimap ? "glow-primary rounded-xl" : "glass rounded-xl"}
                onClick={() => {
                  setShowMinimap(!showMinimap);
                  playSFX('click');
                }}
                title="Minimapa"
              >
                <Map className="w-4 h-4" />
              </Button>

              <Button
                variant={fpMode ? "default" : "ghost"}
                size="icon"
                className={fpMode ? "glow-primary rounded-xl" : "glass rounded-xl"}
                onClick={() => {
                  setFpMode(!fpMode);
                  playSFX('click');
                }}
                title="Modo Primera Persona (WASD)"
              >
                <Compass className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="glass rounded-xl"
                onClick={() => setShowHelp(!showHelp)}
                title="Ayuda"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Minimap */}
            <AnimatePresence>
              {showMinimap && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="absolute top-24 right-4 z-40 glass p-3 rounded-xl"
                >
                  <div className="w-48 h-48 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Mapa de la Ciudad</span>
                      <Map className="w-3 h-3 text-muted-foreground" />
                    </div>
                    
                    {/* Minimap Background */}
                    <div className="absolute inset-6 rounded-lg bg-gradient-to-br from-background/80 to-background/40 border border-primary/20">
                      {/* District Markers */}
                      <button 
                        onClick={() => handleDistrictChange('plaza')}
                        className={`absolute w-4 h-4 rounded-full transition-all cursor-pointer ${currentDistrict === 'plaza' ? 'bg-primary glow-primary scale-125' : 'bg-primary/40 hover:bg-primary/60'}`}
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        title="Plaza Mayor"
                      />
                      <button 
                        onClick={() => handleDistrictChange('templo')}
                        className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'templo' ? 'bg-cyan-400 scale-125' : 'bg-cyan-400/40 hover:bg-cyan-400/60'}`}
                        style={{ top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        title="Templo MSR"
                      />
                      <button 
                        onClick={() => handleDistrictChange('santuario')}
                        className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'santuario' ? 'bg-primary scale-125' : 'bg-primary/40 hover:bg-primary/60'}`}
                        style={{ top: '50%', left: '20%', transform: 'translate(-50%, -50%)' }}
                        title="Santuario Isabella"
                      />
                      <button 
                        onClick={() => handleDistrictChange('tianguis')}
                        className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'tianguis' ? 'bg-accent scale-125' : 'bg-accent/40 hover:bg-accent/60'}`}
                        style={{ top: '50%', left: '80%', transform: 'translate(-50%, -50%)' }}
                        title="Tianguis"
                      />
                      <button 
                        onClick={() => handleDistrictChange('murallas')}
                        className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'murallas' ? 'bg-red-500 scale-125' : 'bg-red-500/40 hover:bg-red-500/60'}`}
                        style={{ top: '80%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        title="Murallas"
                      />
                      
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                        <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="currentColor" strokeOpacity="0.2" />
                        <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="currentColor" strokeOpacity="0.2" />
                        <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="currentColor" strokeOpacity="0.2" />
                        <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="currentColor" strokeOpacity="0.2" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Panel */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-24 left-20 z-50 glass p-4 rounded-xl max-w-xs"
                >
                  <h3 className="font-display text-primary mb-3">Controles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rotar cámara</span>
                      <span>Click + Arrastrar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zoom</span>
                      <span>Scroll</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mover (FP)</span>
                      <span>W A S D</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mirar (FP)</span>
                      <span>Mouse</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Activa el modo Primera Persona con el botón de brújula para explorar libremente. Haz click en el minimapa para teletransportarte.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom - District Navigation HUD */}
            <DistrictHUD 
              currentDistrict={currentDistrict as any} 
              onNavigate={(d) => handleDistrictChange(d as District)} 
            />

            {/* FP Mode Instructions */}
            <AnimatePresence>
              {fpMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 glass px-4 py-2 rounded-lg"
                >
                  <p className="text-sm text-center">
                    <span className="text-primary font-display">Modo Primera Persona</span>
                    <span className="text-muted-foreground"> — Click para capturar mouse, ESC para salir</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      {/* Toggle UI Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowUI(!showUI)}
        className="absolute bottom-4 right-4 z-50 glass rounded-xl"
        title={showUI ? "Ocultar UI" : "Mostrar UI"}
      >
        {showUI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>

      {/* Isabella Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-4 bottom-20 z-50 w-96 max-h-[60vh]"
          >
            <IsabellaChat onClose={() => setShowChat(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Editor Dialog */}
      <Dialog open={showAvatarEditor} onOpenChange={setShowAvatarEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Personalizar Avatar</DialogTitle>
          </DialogHeader>
          <AvatarCustomizer onComplete={() => setShowAvatarEditor(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
