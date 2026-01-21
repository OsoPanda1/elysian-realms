import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { toast } from 'sonner';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  displayName: z.string().min(2, 'Mínimo 2 caracteres').optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        authSchema.pick({ email: true, password: true }).parse({ email, password });
      } else {
        authSchema.parse({ email, password, displayName: displayName || undefined });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('Credenciales incorrectas');
          } else {
            toast.error(error.message);
          }
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email ya está registrado');
          } else {
            toast.error(error.message);
          }
        }
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 border-glow">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-aurora flex items-center justify-center glow-primary"
            >
              <span className="font-display font-bold text-2xl text-primary-foreground">T</span>
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-gradient-aurora mb-2">
              {isLogin ? 'Bienvenido a TAMV' : 'Únete a TAMV'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? 'Ingresa a la civilización digital' 
                : 'Conviértete en ciudadano digital'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Nombre de Ciudadano
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Tu nombre en TAMV"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 bg-input border-primary/20 focus:border-primary"
                  />
                </div>
                {errors.displayName && (
                  <p className="text-destructive text-xs">{errors.displayName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-primary/20 focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-aurora text-primary-foreground font-display glow-primary hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Crear Cuenta'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="ml-2 text-primary hover:underline font-medium"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
