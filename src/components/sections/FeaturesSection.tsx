import { motion } from 'framer-motion';
import { Globe, Users, ShoppingBag, Trophy, Gamepad2, Video, Shield, Palette } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Mundo XR Persistente',
    description: 'Explora un universo virtual que evoluciona y se expande constantemente.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Users,
    title: 'Espacios Sociales VR',
    description: 'Conecta con usuarios de todo el mundo en espacios inmersivos compartidos.',
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Palette,
    title: 'Avatares Personalizados',
    description: 'Crea tu identidad digital única con miles de opciones de personalización.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace 3D',
    description: 'Compra, vende e intercambia objetos digitales, skins y accesorios.',
    gradient: 'from-gold to-secondary',
  },
  {
    icon: Video,
    title: 'Streaming Inmersivo',
    description: 'Transmite en vivo y recibe regalos 3D animados de tu audiencia.',
    gradient: 'from-secondary to-primary',
  },
  {
    icon: Gamepad2,
    title: 'Sistema de Misiones',
    description: 'Completa desafíos, gana recompensas y desbloquea contenido exclusivo.',
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Trophy,
    title: 'Rangos y Logros',
    description: 'Progresa en el metaverso y muestra tus logros con emblemas únicos.',
    gradient: 'from-gold to-accent',
  },
  {
    icon: Shield,
    title: 'Identidad Soberana',
    description: 'Tu identidad digital segura, privada y bajo tu control total.',
    gradient: 'from-cyber-green to-primary',
  },
];

export function FeaturesSection() {
  return (
    <section id="mundo" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Funcionalidades</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            Todo un{' '}
            <span className="text-gradient-aurora">Universo</span>
            {' '}por Descubrir
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TAMV XR Universe integra las tecnologías más avanzadas para crear 
            una experiencia inmersiva sin precedentes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-6 rounded-2xl glass border-glow hover:border-primary/30 transition-all duration-300"
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 glow-primary`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
