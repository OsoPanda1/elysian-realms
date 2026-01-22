import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  outfitColor: string;
  accessories: string[];
  aura: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: '#c4a07a',
  hairStyle: 'short',
  hairColor: '#1a1a1a',
  eyeColor: '#4a3728',
  outfit: 'citizen',
  outfitColor: '#00d4ff',
  accessories: [],
  aura: 'none',
};

export const AVATAR_OPTIONS = {
  skinTones: [
    { id: 'fair', color: '#f5dcc5', name: 'Claro' },
    { id: 'light', color: '#e8c5a8', name: 'Medio claro' },
    { id: 'medium', color: '#c4a07a', name: 'Medio' },
    { id: 'tan', color: '#a87d5a', name: 'Bronceado' },
    { id: 'brown', color: '#8b5a3c', name: 'Moreno' },
    { id: 'dark', color: '#5c3825', name: 'Oscuro' },
  ],
  hairStyles: [
    { id: 'short', name: 'Corto', icon: '💇' },
    { id: 'long', name: 'Largo', icon: '💇‍♀️' },
    { id: 'mohawk', name: 'Mohawk', icon: '🦹' },
    { id: 'bald', name: 'Calvo', icon: '👨‍🦲' },
    { id: 'ponytail', name: 'Cola', icon: '👩' },
    { id: 'afro', name: 'Afro', icon: '🧑‍🦱' },
  ],
  hairColors: [
    { id: 'black', color: '#1a1a1a', name: 'Negro' },
    { id: 'brown', color: '#4a3728', name: 'Castaño' },
    { id: 'blonde', color: '#d4a84b', name: 'Rubio' },
    { id: 'red', color: '#8b2500', name: 'Pelirrojo' },
    { id: 'white', color: '#e8e8e8', name: 'Blanco' },
    { id: 'cyan', color: '#00d4ff', name: 'Cian TAMV' },
    { id: 'magenta', color: '#ff00ff', name: 'Magenta' },
  ],
  eyeColors: [
    { id: 'brown', color: '#4a3728', name: 'Café' },
    { id: 'hazel', color: '#7a6035', name: 'Avellana' },
    { id: 'green', color: '#2d6a4f', name: 'Verde' },
    { id: 'blue', color: '#3a86ff', name: 'Azul' },
    { id: 'gray', color: '#6c757d', name: 'Gris' },
    { id: 'cyber', color: '#00d4ff', name: 'Cyber' },
    { id: 'aurora', color: '#ff00ff', name: 'Aurora' },
  ],
  outfits: [
    { id: 'citizen', name: 'Ciudadano', trustRequired: 0 },
    { id: 'guardian', name: 'Guardián', trustRequired: 3 },
    { id: 'scholar', name: 'Erudito', trustRequired: 2 },
    { id: 'merchant', name: 'Comerciante', trustRequired: 1 },
    { id: 'founder', name: 'Fundador', trustRequired: 5 },
    { id: 'celestial', name: 'Celestial', trustRequired: 10 },
  ],
  accessories: [
    { id: 'glasses', name: 'Lentes', icon: '👓' },
    { id: 'mask', name: 'Máscara', icon: '🎭' },
    { id: 'crown', name: 'Corona', icon: '👑', trustRequired: 5 },
    { id: 'halo', name: 'Halo', icon: '😇', trustRequired: 8 },
    { id: 'wings', name: 'Alas', icon: '🪽', trustRequired: 10 },
  ],
  auras: [
    { id: 'none', name: 'Ninguna', color: 'transparent' },
    { id: 'cyan', name: 'Cian', color: '#00d4ff' },
    { id: 'magenta', name: 'Magenta', color: '#ff00ff' },
    { id: 'gold', name: 'Oro', color: '#d4af37' },
    { id: 'rainbow', name: 'Arcoíris', gradient: true },
  ],
};

export function useAvatarSystem() {
  const { user, profile, updateProfile } = useAuth();
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);

  const loadAvatar = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.avatar_url) {
        try {
          const parsed = JSON.parse(data.avatar_url);
          setAvatar({ ...DEFAULT_AVATAR, ...parsed });
        } catch {
          // avatar_url is a regular URL, use default
        }
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  }, [user]);

  const saveAvatar = useCallback(async (config: AvatarConfig) => {
    if (!user) return { error: new Error('No user') };
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: JSON.stringify(config) })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setAvatar(config);
      toast.success('Avatar guardado en tu perfil');
      return { error: null };
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast.error('Error guardando avatar');
      return { error: error as Error };
    } finally {
      setSaving(false);
    }
  }, [user]);

  const updateAvatarPart = useCallback(<K extends keyof AvatarConfig>(
    part: K, 
    value: AvatarConfig[K]
  ) => {
    setAvatar(prev => ({ ...prev, [part]: value }));
  }, []);

  const availableOutfits = useMemo(() => {
    const trustLevel = profile?.trust_level || 0;
    return AVATAR_OPTIONS.outfits.filter(o => o.trustRequired <= trustLevel);
  }, [profile?.trust_level]);

  const availableAccessories = useMemo(() => {
    const trustLevel = profile?.trust_level || 0;
    return AVATAR_OPTIONS.accessories.filter(a => !a.trustRequired || a.trustRequired <= trustLevel);
  }, [profile?.trust_level]);

  return {
    avatar,
    setAvatar,
    loadAvatar,
    saveAvatar,
    updateAvatarPart,
    saving,
    availableOutfits,
    availableAccessories,
    options: AVATAR_OPTIONS,
  };
}
