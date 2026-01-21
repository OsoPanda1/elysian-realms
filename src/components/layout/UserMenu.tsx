import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  User, LogOut, Settings, Wallet, 
  Shield, ChevronDown, Star, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, wallet, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/auth')}
        >
          <User className="w-4 h-4 mr-2" />
          Iniciar Sesión
        </Button>
        <Button 
          className="bg-aurora text-primary-foreground font-display glow-primary hover:opacity-90 transition-opacity"
          onClick={() => navigate('/auth')}
        >
          Crear Cuenta
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-lg bg-aurora flex items-center justify-center">
          <span className="font-display font-bold text-sm text-primary-foreground">
            {profile?.display_name?.[0]?.toUpperCase() || 'C'}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium">{profile?.display_name || 'Ciudadano'}</p>
          <p className="text-xs text-muted-foreground">{wallet?.balance?.toFixed(2) || '0.00'} TAU</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-xl border-glow overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-aurora flex items-center justify-center">
                    <span className="font-display font-bold text-lg text-primary-foreground">
                      {profile?.display_name?.[0]?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{profile?.display_name || 'Ciudadano TAMV'}</p>
                    <p className="text-xs text-muted-foreground font-mono">{profile?.did || 'did:tamv:...'}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <Wallet className="w-4 h-4 mx-auto text-primary mb-1" />
                    <p className="text-sm font-medium">{wallet?.balance?.toFixed(0) || '0'}</p>
                    <p className="text-xs text-muted-foreground">TAU</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <Star className="w-4 h-4 mx-auto text-gold mb-1" />
                    <p className="text-sm font-medium">{profile?.reputation_score || 100}</p>
                    <p className="text-xs text-muted-foreground">Rep</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <Zap className="w-4 h-4 mx-auto text-cyber-green mb-1" />
                    <p className="text-sm font-medium">{profile?.missions_completed || 0}</p>
                    <p className="text-xs text-muted-foreground">Misiones</p>
                  </div>
                </div>

                {/* Trust Level */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Nivel de Confianza</span>
                    <span className="text-primary">{((profile?.trust_level || 0.5) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-aurora rounded-full transition-all"
                      style={{ width: `${(profile?.trust_level || 0.5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Mi Perfil</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to wallet
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Nubiwallet</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to security
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Seguridad</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to settings
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Configuración</span>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-primary/10">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-colors text-left text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
