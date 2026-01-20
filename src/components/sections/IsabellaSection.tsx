import { motion } from 'framer-motion';
import { Bot, MessageCircle, Sparkles, Brain, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Brain, title: 'IA Avanzada', description: 'Conversaciones naturales con comprensión contextual' },
  { icon: Heart, title: 'Conexión Emocional', description: 'Avatar empático que entiende tus necesidades' },
  { icon: Zap, title: 'Respuesta Instantánea', description: 'Interacción en tiempo real sin delays' },
];

export function IsabellaSection() {
  return (
    <section id="isabella" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute inset-0 bg-gradient-radial from-secondary/10 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Isabella Avatar Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-secondary via-accent to-primary opacity-20 blur-3xl animate-pulse-glow" />
              
              {/* Avatar Container */}
              <div className="relative w-full h-full rounded-full border border-secondary/30 flex items-center justify-center glass">
                <div className="w-3/4 h-3/4 rounded-full bg-card-gradient border border-secondary/20 flex items-center justify-center animate-float">
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        boxShadow: ['0 0 40px rgba(217, 70, 239, 0.3)', '0 0 80px rgba(217, 70, 239, 0.5)', '0 0 40px rgba(217, 70, 239, 0.3)']
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 mx-auto rounded-full bg-aurora flex items-center justify-center mb-4"
                    >
                      <Bot className="w-12 h-12 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-display font-bold text-xl text-gradient-aurora">Isabella</h3>
                    <p className="text-sm text-muted-foreground">AI Companion</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 w-12 h-12 rounded-lg glass flex items-center justify-center glow-secondary"
              >
                <Sparkles className="w-6 h-6 text-secondary" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-20 left-5 w-10 h-10 rounded-lg glass flex items-center justify-center glow-primary"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 mb-4"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Inteligencia Artificial</span>
              </motion.div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
                Conoce a{' '}
                <span className="text-gradient-aurora">Isabella AI</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Tu compañera virtual en el metaverso. Isabella es una entidad de IA 
                avanzada diseñada para guiarte, asistirte y crear experiencias 
                personalizadas en el universo TAMV.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 p-4 rounded-xl glass border-glow hover:bg-primary/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-aurora flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-lg mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-aurora text-primary-foreground font-display glow-secondary hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chatear con Isabella
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
