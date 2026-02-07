// src/lib/economy/tauCredits.ts
import { supabase } from '@/integrations/supabase/client';

export type TauTransactionType = 'MISSION_REWARD' | 'MARKETPLACE_PURCHASE' | 'TRANSFER';

export interface TauWallet {
  id: string;
  user_id: string;
  balance: number;
  locked_balance: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
}

export interface TauTransaction {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  amount: number;
  transaction_type: string;
  description: string | null;
  fenix_share: number | null;
  infra_share: number | null;
  reserve_share: number | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export interface TauMission {
  id: string;
  title: string;
  description: string | null;
  tau_reward: number | null;
  xp_reward: number;
  is_active: boolean;
  mission_type: string;
}

export async function getWallet(): Promise<TauWallet | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError ?? new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data as unknown as TauWallet;
}

export async function getTransactions(limit = 50): Promise<TauTransaction[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as TauTransaction[]) ?? [];
}

export async function createTauTransaction(
  toUserId: string,
  amount: number,
  transactionType: string,
  description?: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.rpc('create_transaction', {
    p_from_user_id: user.id,
    p_to_user_id: toUserId,
    p_amount: amount,
    p_transaction_type: transactionType,
    p_description: description,
  });

  if (error) throw error;
  return data;
}

export async function claimMissionReward(missionId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.rpc('claim_mission_reward', {
    p_mission_id: missionId,
    p_user_id: user.id,
  });

  if (error) throw error;
  return data;
}

export async function getActiveMissions(): Promise<TauMission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as unknown as TauMission[]) ?? [];
}
