import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CosmicScene } from '@/components/3d/CosmicScene';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <CosmicScene />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-10" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 z-10" />
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
      </div>

      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-glow mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gradient-gold">Bienvenido al Futuro</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight"
          >
            <span className="text-foreground">El Primer</span>
            <br />
            <span className="text-gradient-aurora">Universo XR</span>
            <br />
            <span className="text-foreground">Latinoamericano</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Explora mundos virtuales, conecta con avatares inteligentes, 
            y sé parte de la revolución inmersiva con{' '}
            <span className="text-primary font-semibold">Isabella AI</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-aurora text-primary-foreground font-display text-lg px-8 py-6 glow-primary hover:opacity-90 transition-all duration-300 group"
              onClick={() => window.location.href = '/world'}
            >
              Explorar Metaverso
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-foreground font-display text-lg px-8 py-6 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-xl mx-auto"
          >
            {[
              { value: '10K+', label: 'Usuarios' },
              { value: '500+', label: 'Espacios VR' },
              { value: '∞', label: 'Posibilidades' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-bold text-2xl sm:text-3xl text-gradient-aurora">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
