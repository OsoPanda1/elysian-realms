// src/lib/economy/tauCredits.ts
import { supabase } from '@/lib/supabaseClient';

export type TauTransactionType = 'MISSION_REWARD' | 'MARKETPLACE_PURCHASE' | 'TRANSFER';

export interface TauWallet {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface TauTransaction {
  id: string;
  wallet_id: string;
  type: TauTransactionType;
  amount: number;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export interface TauMission {
  id: string;
  title: string;
  description: string;
  reward_amount: number;
  status: 'ACTIVE' | 'INACTIVE';
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

  if (error) {
    throw error;
  }

  return data as TauWallet;
}

export async function getTransactions(limit = 50): Promise<TauTransaction[]> {
  const wallet = await getWallet();

  if (!wallet) {
    return [];
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as TauTransaction[]) ?? [];
}

// Llama a la RPC create_transaction (en Supabase) que ya hace 20/30/50
export async function createTauTransaction(
  type: TauTransactionType,
  amount: number,
  metadata: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc('create_transaction', {
    p_type: type,
    p_amount: amount,
    p_metadata: metadata,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Reclamar recompensa de misión (RPC claim_mission_reward)
export async function claimMissionReward(missionId: string) {
  const { data, error } = await supabase.rpc('claim_mission_reward', {
    p_mission_id: missionId,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getActiveMissions(): Promise<TauMission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as TauMission[]) ?? [];
}
