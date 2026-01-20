import { motion } from 'framer-motion';
import { ShoppingBag, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const marketItems = [
  {
    name: 'Aura Cósmica',
    category: 'Efecto',
    price: '250',
    rarity: 'Legendario',
    image: '🌌',
    color: 'from-gold via-secondary to-gold',
  },
  {
    name: 'Máscara Cyber',
    category: 'Avatar',
    price: '180',
    rarity: 'Épico',
    image: '🎭',
    color: 'from-secondary to-accent',
  },
  {
    name: 'Alas de Luz',
    category: 'Accesorio',
    price: '320',
    rarity: 'Mítico',
    image: '✨',
    color: 'from-primary to-cyber-green',
  },
  {
    name: 'Trono Virtual',
    category: 'Mobiliario',
    price: '150',
    rarity: 'Raro',
    image: '👑',
    color: 'from-gold to-accent',
  },
];

const rarityColors: Record<string, string> = {
  'Legendario': 'text-gold',
  'Épico': 'text-secondary',
  'Mítico': 'text-primary',
  'Raro': 'text-accent',
};

export function MarketplaceSection() {
  return (
    <section id="marketplace" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 mb-4">
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Marketplace</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Objetos{' '}
              <span className="text-gradient-gold">Digitales</span>
              {' '}Únicos
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Descubre, colecciona e intercambia items exclusivos para 
              personalizar tu experiencia en el metaverso.
            </p>
          </div>
          <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 shrink-0">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Todo
          </Button>
        </motion.div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl glass border-glow overflow-hidden"
            >
              {/* Image Area */}
              <div className={`relative aspect-square bg-gradient-to-br ${item.color} opacity-20`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {item.image}
                  </span>
                </div>
                {/* Sparkle Effect */}
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-5 h-5 text-gold" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                  <span className={`text-xs font-semibold ${rarityColors[item.rarity]}`}>
                    {item.rarity}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-display font-bold text-gold">{item.price}</span>
                    <span className="text-xs text-muted-foreground">TXR</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-aurora text-primary-foreground font-display text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Comprar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
