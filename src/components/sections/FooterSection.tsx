import { motion } from 'framer-motion';
import { Globe, Twitter, MessageCircle, Github, Mail, Heart } from 'lucide-react';

const links = {
  platform: [
    { label: 'Mundo XR', href: '#mundo' },
    { label: 'Isabella AI', href: '#isabella' },
    { label: 'Marketplace', href: '#marketplace' },
    { label: 'Misiones', href: '#misiones' },
  ],
  resources: [
    { label: 'Documentación', href: '#' },
    { label: 'API', href: '#' },
    { label: 'Centro de Ayuda', href: '#' },
    { label: 'Comunidad', href: '#' },
  ],
  company: [
    { label: 'Sobre Nosotros', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Prensa', href: '#' },
    { label: 'Contacto', href: '#' },
  ],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export function FooterSection() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cosmic" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a 
              href="#"
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-12 h-12 rounded-xl bg-aurora flex items-center justify-center glow-primary">
                <span className="font-display font-bold text-primary-foreground text-xl">T</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-gradient-aurora">TAMV</h1>
                <p className="text-xs text-muted-foreground tracking-widest">XR UNIVERSE</p>
              </div>
            </motion.a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              El primer universo XR latinoamericano. Creando el futuro de las 
              experiencias inmersivas, un mundo virtual a la vez.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg glass border-glow flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-3">
              {links.platform.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Compañía</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2024 TAMV XR Universe. Hecho con 
            <Heart className="w-4 h-4 text-secondary fill-secondary" /> 
            en Latinoamérica
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
