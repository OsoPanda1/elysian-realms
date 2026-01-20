import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Target, Clock, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const missions = [
  {
    title: 'Explorador Novato',
    description: 'Visita 5 espacios VR diferentes',
    reward: '100 TXR',
    progress: 60,
    difficulty: 'Fácil',
    icon: Target,
    color: 'primary',
  },
  {
    title: 'Social Butterfly',
    description: 'Haz 10 amigos en el metaverso',
    reward: '250 TXR',
    progress: 30,
    difficulty: 'Media',
    icon: Star,
    color: 'secondary',
  },
  {
    title: 'Coleccionista',
    description: 'Adquiere 3 items del marketplace',
    reward: '500 TXR + Badge',
    progress: 0,
    difficulty: 'Difícil',
    icon: Trophy,
    color: 'gold',
  },
];

const ranks = [
  { name: 'Iniciado', level: 1, color: 'text-muted-foreground' },
  { name: 'Explorador', level: 5, color: 'text-primary' },
  { name: 'Veterano', level: 15, color: 'text-secondary' },
  { name: 'Leyenda', level: 30, color: 'text-gold' },
  { name: 'Trascendido', level: 50, color: 'text-gradient-aurora' },
];

export function MissionsSection() {
  return (
    <section id="misiones" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Missions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-4">
              <Gamepad2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Misiones Activas</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Completa{' '}
              <span className="text-gradient-aurora">Desafíos</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Gana recompensas exclusivas completando misiones diarias, 
              semanales y especiales.
            </p>

            <div className="space-y-4">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-4 rounded-xl glass border-glow hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${mission.color}/20 flex items-center justify-center shrink-0`}>
                      <mission.icon className={`w-6 h-6 text-${mission.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display font-semibold truncate">{mission.title}</h4>
                        <span className="text-xs text-muted-foreground shrink-0">{mission.difficulty}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${mission.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="absolute inset-y-0 left-0 bg-aurora rounded-full"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{mission.progress}% completado</span>
                        <span className="text-xs font-display font-semibold text-gold">+{mission.reward}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="mt-6 bg-aurora text-primary-foreground font-display glow-primary">
              <Zap className="w-4 h-4 mr-2" />
              Ver Todas las Misiones
            </Button>
          </motion.div>

          {/* Right - Ranks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 mb-4">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Sistema de Rangos</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Asciende de{' '}
              <span className="text-gradient-gold">Rango</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Sube de nivel, desbloquea privilegios exclusivos y 
              demuestra tu estatus en el metaverso.
            </p>

            {/* Rank Ladder */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-muted via-primary to-gold" />

              <div className="space-y-4">
                {ranks.map((rank, index) => (
                  <motion.div
                    key={rank.name}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative pl-16"
                  >
                    {/* Node */}
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 ${
                      index === 0 ? 'bg-primary border-primary glow-primary' : 'bg-card border-muted'
                    }`}>
                      {index === 0 && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-primary opacity-50"
                        />
                      )}
                    </div>

                    <div className={`p-4 rounded-xl glass border-glow ${
                      index === 0 ? 'border-primary/30' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-display font-semibold ${rank.color}`}>
                            {rank.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Nivel {rank.level}+
                          </p>
                        </div>
                        {index === 0 && (
                          <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            Tu Rango
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
