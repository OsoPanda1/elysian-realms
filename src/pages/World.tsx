import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, Map, Settings, 
  Compass, Volume2, VolumeX, Maximize, Minimize,
  Globe, MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VRWorld } from '@/components/3d/VRWorld';
import { IsabellaChat } from '@/components/chat/IsabellaChat';
import { useAuth } from '@/hooks/useAuth';

export default function World() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [onlineUsers] = useState(42);
  
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* 3D VR World */}
      <div className="absolute inset-0">
        <VRWorld />
      </div>

      {/* UI Overlay */}
      {showUI && (
        <>
          {/* Top Bar */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="absolute top-0 left-0 right-0 z-20 p-4"
          >
            <div className="flex items-center justify-between">
              {/* Left - Back & Location */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="glass rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Hub Central TAMV</span>
                </div>
              </div>

              {/* Center - Online Users */}
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyber-green" />
                <span className="text-sm font-medium">{onlineUsers} en línea</span>
              </div>

              {/* Right - Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass rounded-xl"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="glass rounded-xl"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Left Side - User Info */}
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
          >
            <div className="glass rounded-2xl p-4 w-56">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-aurora flex items-center justify-center">
                  <span className="font-display font-bold text-primary-foreground">
                    {profile?.display_name?.[0] || 'C'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{profile?.display_name || 'Ciudadano'}</p>
                  <p className="text-xs text-muted-foreground">Nivel {Math.floor((profile?.reputation_score || 100) / 100)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TAU Balance</span>
                  <span className="font-medium text-primary">100.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reputación</span>
                  <span className="font-medium">{profile?.reputation_score || 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mundos</span>
                  <span className="font-medium">{profile?.worlds_visited || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom - Controls Help */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="glass rounded-xl px-6 py-3 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">W</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">A</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">S</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">D</kbd>
                </div>
                <span className="text-xs text-muted-foreground">Mover</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground">Arrastrar para rotar</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Scroll</kbd>
                <span className="text-xs text-muted-foreground">Zoom</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Mini Map Placeholder */}
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20"
          >
            <div className="glass rounded-2xl p-3 w-40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Mapa</span>
                <Map className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="aspect-square bg-muted/50 rounded-lg relative overflow-hidden">
                {/* Simple minimap visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-magenta-400 rounded-full" />
                <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Toggle UI Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowUI(!showUI)}
        className="absolute bottom-4 right-4 z-30 glass rounded-xl"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Isabella Chat */}
      <IsabellaChat />
    </div>
  );
}
