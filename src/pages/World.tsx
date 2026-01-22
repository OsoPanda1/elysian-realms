import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CiudadTAMV, DistrictHUD } from '@/components/city/CiudadTAMV';
import { IsabellaChat } from '@/components/chat/IsabellaChat';
import { UserMenu } from '@/components/layout/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
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
  EyeOff
} from 'lucide-react';

type District = 'plaza' | 'templo' | 'santuario' | 'tianguis' | 'murallas';

export default function World() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [currentDistrict, setCurrentDistrict] = useState<District>('plaza');
  const [showChat, setShowChat] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fpMode, setFpMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const districtInfo: Record<District, { name: string; description: string; icon: string }> = {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-display">Cargando Ciudad TAMV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Main 3D City View */}
      <div className="absolute inset-0">
        <CiudadTAMV 
          initialDistrict={currentDistrict}
          onDistrictChange={setCurrentDistrict}
          fpMode={fpMode}
        />
      </div>

      {/* UI Overlay */}
      {showUI && (
        <>
          {/* Top HUD Bar */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
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
                    <span className="text-lg">{districtInfo[currentDistrict].icon}</span>
                    <div>
                      <p className="font-display text-sm text-primary">
                        {districtInfo[currentDistrict].name}
                      </p>
                      <p className="text-xs text-muted-foreground hidden md:block">
                        {districtInfo[currentDistrict].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Online Users */}
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">42 ciudadanos</span>
              </div>

              {/* Right: User & Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass rounded-xl"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="glass rounded-xl"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
          >
            <Button
              variant={showChat ? "default" : "ghost"}
              size="icon"
              className={showChat ? "glow-primary rounded-xl" : "glass rounded-xl"}
              onClick={() => setShowChat(!showChat)}
              title="Chat con Isabella"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <Button
              variant={showMinimap ? "default" : "ghost"}
              size="icon"
              className={showMinimap ? "glow-primary rounded-xl" : "glass rounded-xl"}
              onClick={() => setShowMinimap(!showMinimap)}
              title="Minimapa"
            >
              <Map className="w-4 h-4" />
            </Button>

            <Button
              variant={fpMode ? "default" : "ghost"}
              size="icon"
              className={fpMode ? "glow-primary rounded-xl" : "glass rounded-xl"}
              onClick={() => setFpMode(!fpMode)}
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
          {showMinimap && (
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
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
                    onClick={() => setCurrentDistrict('plaza')}
                    className={`absolute w-4 h-4 rounded-full transition-all cursor-pointer ${currentDistrict === 'plaza' ? 'bg-primary glow-primary scale-125' : 'bg-primary/40 hover:bg-primary/60'}`}
                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    title="Plaza Mayor"
                  />
                  <button 
                    onClick={() => setCurrentDistrict('templo')}
                    className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'templo' ? 'bg-cyan-400 scale-125' : 'bg-cyan-400/40 hover:bg-cyan-400/60'}`}
                    style={{ top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    title="Templo MSR"
                  />
                  <button 
                    onClick={() => setCurrentDistrict('santuario')}
                    className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'santuario' ? 'bg-primary scale-125' : 'bg-primary/40 hover:bg-primary/60'}`}
                    style={{ top: '50%', left: '20%', transform: 'translate(-50%, -50%)' }}
                    title="Santuario Isabella"
                  />
                  <button 
                    onClick={() => setCurrentDistrict('tianguis')}
                    className={`absolute w-3 h-3 rounded-full transition-all cursor-pointer ${currentDistrict === 'tianguis' ? 'bg-accent scale-125' : 'bg-accent/40 hover:bg-accent/60'}`}
                    style={{ top: '50%', left: '80%', transform: 'translate(-50%, -50%)' }}
                    title="Tianguis"
                  />
                  <button 
                    onClick={() => setCurrentDistrict('murallas')}
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

          {/* Help Panel */}
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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

          {/* Bottom - District Navigation HUD */}
          <DistrictHUD 
            currentDistrict={currentDistrict} 
            onNavigate={setCurrentDistrict} 
          />

          {/* FP Mode Instructions */}
          {fpMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 glass px-4 py-2 rounded-lg"
            >
              <p className="text-sm text-center">
                <span className="text-primary font-display">Modo Primera Persona</span>
                <span className="text-muted-foreground"> — Click para capturar mouse, ESC para salir</span>
              </p>
            </motion.div>
          )}
        </>
      )}

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
      {showChat && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-4 bottom-20 z-50 w-96 max-h-[60vh]"
        >
          <IsabellaChat />
        </motion.div>
      )}
    </div>
  );
}
