import { motion } from 'framer-motion';
import { useAvatarSystem, AVATAR_OPTIONS, AvatarConfig } from '@/hooks/useAvatarSystem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Loader2, Save, User, Shirt, Sparkles, Eye } from 'lucide-react';
import { AvatarPreview3D } from './AvatarPreview3D';

interface AvatarCustomizerProps {
  onComplete?: () => void;
  compact?: boolean;
}

export function AvatarCustomizer({ onComplete, compact = false }: AvatarCustomizerProps) {
  const { 
    avatar, 
    updateAvatarPart, 
    saveAvatar, 
    saving,
    availableOutfits,
    availableAccessories,
  } = useAvatarSystem();

  const handleSave = async () => {
    const { error } = await saveAvatar(avatar);
    if (!error && onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl overflow-hidden ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {/* 3D Preview */}
        <div className={`${compact ? 'h-48' : 'h-80'} rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted`}>
          <AvatarPreview3D config={avatar} />
        </div>

        {/* Customization Options */}
        <div className="space-y-4">
          <Tabs defaultValue="body" className="w-full">
            <TabsList className="grid grid-cols-4 gap-1">
              <TabsTrigger value="body" className="flex gap-1 text-xs">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Cuerpo</span>
              </TabsTrigger>
              <TabsTrigger value="hair" className="flex gap-1 text-xs">
                <span>💇</span>
                <span className="hidden sm:inline">Cabello</span>
              </TabsTrigger>
              <TabsTrigger value="outfit" className="flex gap-1 text-xs">
                <Shirt className="w-3 h-3" />
                <span className="hidden sm:inline">Ropa</span>
              </TabsTrigger>
              <TabsTrigger value="extras" className="flex gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Extras</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className={compact ? 'h-32' : 'h-48'}>
              {/* Body Tab */}
              <TabsContent value="body" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tono de Piel</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.skinTones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => updateAvatarPart('skinTone', tone.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          avatar.skinTone === tone.color 
                            ? 'border-primary scale-110 ring-2 ring-primary/50' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: tone.color }}
                        title={tone.name}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color de Ojos</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.eyeColors.map((eye) => (
                      <button
                        key={eye.id}
                        onClick={() => updateAvatarPart('eyeColor', eye.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          avatar.eyeColor === eye.color 
                            ? 'border-primary scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: eye.color }}
                        title={eye.name}
                      >
                        <Eye className="w-4 h-4 text-white/80" />
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Hair Tab */}
              <TabsContent value="hair" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Estilo</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.hairStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => updateAvatarPart('hairStyle', style.id)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          avatar.hairStyle === style.id 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      >
                        <span className="mr-1">{style.icon}</span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.hairColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateAvatarPart('hairColor', color.color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          avatar.hairColor === color.color 
                            ? 'border-primary scale-110 ring-2 ring-primary/50' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Outfit Tab */}
              <TabsContent value="outfit" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Atuendo</label>
                  <div className="flex flex-wrap gap-2">
                    {availableOutfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => updateAvatarPart('outfit', outfit.id)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          avatar.outfit === outfit.id 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      >
                        {outfit.name}
                        {outfit.trustRequired > 0 && (
                          <span className="ml-1 text-xs opacity-70">★{outfit.trustRequired}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Color del Atuendo</label>
                  <div className="flex flex-wrap gap-2">
                    {['#00d4ff', '#ff00ff', '#d4af37', '#00ff88', '#ff4444', '#8844ff'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateAvatarPart('outfitColor', color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          avatar.outfitColor === color 
                            ? 'border-primary scale-110' 
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Extras Tab */}
              <TabsContent value="extras" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Accesorios</label>
                  <div className="flex flex-wrap gap-2">
                    {availableAccessories.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          const has = avatar.accessories.includes(acc.id);
                          updateAvatarPart(
                            'accessories',
                            has 
                              ? avatar.accessories.filter(a => a !== acc.id)
                              : [...avatar.accessories, acc.id]
                          );
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          avatar.accessories.includes(acc.id)
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      >
                        <span className="mr-1">{acc.icon}</span>
                        {acc.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Aura</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_OPTIONS.auras.map((aura) => (
                      <button
                        key={aura.id}
                        onClick={() => updateAvatarPart('aura', aura.id)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          avatar.aura === aura.id 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-muted border-border hover:bg-muted/80'
                        }`}
                      >
                        {aura.gradient ? '🌈' : '✨'} {aura.name}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full bg-aurora glow-primary"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Avatar
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
