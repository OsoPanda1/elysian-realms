-- =====================================================
-- TAMV CIVILIZACIÓN DIGITAL - 7 CAPAS FEDERADAS
-- Arquitectura de base de datos soberana
-- =====================================================

-- Enum para roles de usuario en TAMV
CREATE TYPE public.app_role AS ENUM ('user', 'creator', 'guardian', 'node', 'institution', 'admin');

-- Enum para estados de verificación
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'suspended');

-- Enum para niveles de riesgo
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- =====================================================
-- CAPA 1: IDENTIDAD SOBERANA (ID-NVIDA)
-- =====================================================

-- Tabla de perfiles de usuario (Ciudadanos TAMV)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Identidad básica
  display_name TEXT NOT NULL DEFAULT 'Ciudadano TAMV',
  avatar_url TEXT,
  bio TEXT,
  
  -- Identidad soberana (DID TAMV)
  did TEXT UNIQUE,
  
  -- Estado y reputación
  verification_status verification_status NOT NULL DEFAULT 'pending',
  trust_level DECIMAL(3,2) NOT NULL DEFAULT 0.50 CHECK (trust_level >= 0 AND trust_level <= 1),
  reputation_score INTEGER NOT NULL DEFAULT 100,
  
  -- Estadísticas XR
  xr_time_minutes INTEGER NOT NULL DEFAULT 0,
  worlds_visited INTEGER NOT NULL DEFAULT 0,
  missions_completed INTEGER NOT NULL DEFAULT 0,
  
  -- Flags
  dedication_acknowledged BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de roles de usuario (separada por seguridad)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- =====================================================
-- CAPA 2: INTENCIÓN CONSCIENTE
-- =====================================================

-- Registro de intenciones y acciones del usuario
CREATE TABLE public.intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  action_type TEXT NOT NULL,
  purpose TEXT,
  context JSONB DEFAULT '{}',
  risk_level risk_level NOT NULL DEFAULT 'low',
  
  approved BOOLEAN NOT NULL DEFAULT true,
  rejection_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CAPA 3: ÉTICA Y GOBERNANZA (DEKATEOTL)
-- =====================================================

-- Reglas de gobernanza DAO
CREATE TABLE public.governance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL DEFAULT 'ethical',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CAPA 5: ECONOMÍA Y VALOR (TAU / Ledger)
-- =====================================================

-- Wallet de usuario (Nubiwallet)
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(18,8) NOT NULL DEFAULT 0,
  locked_balance DECIMAL(18,8) NOT NULL DEFAULT 0,
  total_earned DECIMAL(18,8) NOT NULL DEFAULT 0,
  total_spent DECIMAL(18,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transacciones (Ledger TAU)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  
  amount DECIMAL(18,8) NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  
  -- Distribución 20/30/50
  fenix_share DECIMAL(18,8) DEFAULT 0,
  infra_share DECIMAL(18,8) DEFAULT 0,
  reserve_share DECIMAL(18,8) DEFAULT 0,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CAPA 6: REGISTRO INMUTABLE (BookPI / MSR)
-- =====================================================

-- Registro de propiedad intelectual y actos
CREATE TABLE public.registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  act_type TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  is_immutable BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- CAPA 7: OBSERVABILIDAD Y MEMORIA
-- =====================================================

-- Conversaciones con Isabella AI
CREATE TABLE public.isabella_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Nueva conversación',
  context JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mensajes de Isabella AI
CREATE TABLE public.isabella_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.isabella_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- MUNDOS XR Y MISIONES
-- =====================================================

-- Mundos/Escenas XR disponibles
CREATE TABLE public.xr_worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  scene_config JSONB DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  required_trust_level DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Misiones y logros
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT NOT NULL DEFAULT 'daily',
  xp_reward INTEGER NOT NULL DEFAULT 10,
  tau_reward DECIMAL(18,8) DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Progreso de misiones del usuario
CREATE TABLE public.user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);

-- =====================================================
-- MARKETPLACE 3D
-- =====================================================

CREATE TABLE public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  
  price DECIMAL(18,8) NOT NULL,
  image_url TEXT,
  model_url TEXT,
  
  is_listed BOOLEAN NOT NULL DEFAULT true,
  stock INTEGER DEFAULT -1,
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xr_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKING
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles: Users can view all, edit own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Roles: Only viewable by self or admin
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Intentions: Users can manage own
CREATE POLICY "Users can manage own intentions" ON public.intentions
FOR ALL USING (auth.uid() = user_id);

-- Governance Rules: Public read
CREATE POLICY "Governance rules are public" ON public.governance_rules
FOR SELECT USING (true);

-- Wallets: Users can view own
CREATE POLICY "Users can view own wallet" ON public.wallets
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet" ON public.wallets
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can view own
CREATE POLICY "Users can view own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Registry: Public read
CREATE POLICY "Registry is public" ON public.registry
FOR SELECT USING (true);

CREATE POLICY "Users can insert own registry" ON public.registry
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Isabella Conversations: Users manage own
CREATE POLICY "Users can view own conversations" ON public.isabella_conversations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.isabella_conversations
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.isabella_conversations
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.isabella_conversations
FOR DELETE USING (auth.uid() = user_id);

-- Isabella Messages: Users manage own
CREATE POLICY "Users can view own messages" ON public.isabella_messages
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.isabella_messages
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- XR Worlds: Public read
CREATE POLICY "XR worlds are public" ON public.xr_worlds
FOR SELECT USING (is_public = true);

-- Missions: Public read
CREATE POLICY "Missions are public" ON public.missions
FOR SELECT USING (is_active = true);

-- User Missions: Users manage own
CREATE POLICY "Users can view own mission progress" ON public.user_missions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mission progress" ON public.user_missions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mission progress" ON public.user_missions
FOR UPDATE USING (auth.uid() = user_id);

-- Marketplace: Public read, sellers manage own
CREATE POLICY "Marketplace items are public" ON public.marketplace_items
FOR SELECT USING (is_listed = true);

CREATE POLICY "Sellers can manage own items" ON public.marketplace_items
FOR ALL USING (auth.uid() = seller_id);

-- =====================================================
-- TRIGGER FOR AUTO-UPDATE timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.isabella_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE AND WALLET ON USER SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, did)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Ciudadano TAMV'),
    'did:tamv:' || NEW.id
  );
  
  -- Create wallet
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 100.00);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INSERT DEFAULT XR WORLDS
-- =====================================================

INSERT INTO public.xr_worlds (name, slug, description, is_public, required_trust_level, scene_config) VALUES
('Sala de Dedicatoria', 'dedication-hall', 'Espacio sagrado donde comienza tu viaje en TAMV. Dedicado a Reina Trejo Serrano.', true, 0, '{"type": "dedication", "ambient": "cosmic"}'),
('Hub Central TAMV', 'hub-central', 'El corazón de la civilización digital. Conecta con otros ciudadanos.', true, 0, '{"type": "social", "ambient": "futuristic"}'),
('DreamSpace Obsidian', 'dreamspace-obsidian', 'Espacio personal de creación y reflexión.', true, 0.3, '{"type": "personal", "ambient": "obsidian"}'),
('Alamexa Arena', 'alamexa-arena', 'Arena de eventos y competencias comunitarias.', true, 0.5, '{"type": "arena", "ambient": "energy"}');

-- =====================================================
-- INSERT DEFAULT MISSIONS
-- =====================================================

INSERT INTO public.missions (title, description, mission_type, xp_reward, tau_reward, requirements) VALUES
('Primer Paso', 'Completa la Sala de Dedicatoria', 'onboarding', 50, 10, '{"action": "dedication_complete"}'),
('Conectar con Isabella', 'Ten tu primera conversación con Isabella AI', 'onboarding', 30, 5, '{"action": "first_chat"}'),
('Explorador XR', 'Visita 3 mundos diferentes', 'daily', 20, 2, '{"worlds_count": 3}'),
('Ciudadano Verificado', 'Completa tu perfil al 100%', 'achievement', 100, 25, '{"profile_complete": true}');

-- =====================================================
-- INSERT DEFAULT GOVERNANCE RULES
-- =====================================================

INSERT INTO public.governance_rules (code, name, description, rule_type) VALUES
('DKTL-DIGNITY-001', 'Dignidad Primero', 'Toda acción debe respetar la dignidad humana', 'ethical'),
('DKTL-TRUTH-001', 'Sin Olvido', 'Nada se borra, todo se evoluciona', 'registry'),
('DKTL-ECONOMY-001', 'Distribución Justa', 'Regla 20/30/50 para todas las transacciones', 'economic'),
('DKTL-IDENTITY-001', 'Identidad Soberana', 'Tu identidad te pertenece', 'identity');