/**
 * Membresías TAMV — Capas de capacidad, no castas.
 * Basadas en contribución + cumplimiento + verificación externa opcional.
 */

import { supabase } from "@/integrations/supabase/client";
import { ledger, SYSTEM_POOLS } from "./ledger.internal";

export type MembershipTier = "free" | "creator" | "guardian" | "institutional";

export interface MembershipInfo {
  tier: MembershipTier;
  activeSince: number;
  expiresAt?: number;
  contributionScore: number;
  capabilities: string[];
}

// Capacidades por nivel
const TIER_CAPABILITIES: Record<MembershipTier, string[]> = {
  free: [
    "create_profile",
    "publish_text",
    "publish_images_limited",
    "publish_short_clips",
    "chat_private",
    "join_public_groups",
    "visit_dreamspaces",
  ],
  creator: [
    "create_channels",
    "create_dreamspaces",
    "stream_regular",
    "extended_storage",
    "manage_collections",
    "receive_community_credits",
  ],
  guardian: [
    "signal_incidents",
    "supervise_channels",
    "interact_protocol_engine",
    "activate_consultations",
    "msr_bookpi_logging",
  ],
  institutional: [
    "research_labs",
    "xr_educational_cabins",
    "protocol_simulations",
    "anonymized_data_access",
    "federated_api_access",
    "advanced_dashboards",
  ],
};

// Requisitos mínimos de contribución por nivel
const TIER_MIN_CONTRIBUTION: Record<MembershipTier, number> = {
  free: 0,
  creator: 50,
  guardian: 200,
  institutional: 0, // requiere verificación formal, no contribución
};

/**
 * Determina la membresía actual de un usuario basándose en su rol y contribución.
 */
export async function getMembership(userId: string): Promise<MembershipInfo> {
  // Obtener rol del usuario
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const userRoles = roles?.map((r) => r.role) ?? [];

  // Determinar tier basado en roles
  let tier: MembershipTier = "free";
  if (userRoles.includes("institution")) tier = "institutional";
  else if (userRoles.includes("guardian")) tier = "guardian";
  else if (userRoles.includes("creator")) tier = "creator";

  // Calcular contribution score
  const contributionScore = ledger.getBalance(
    `user:${userId}`,
    "contribution_point"
  );

  // Obtener todas las capabilities (acumulativas)
  const allTiers: MembershipTier[] = ["free"];
  if (tier === "creator" || tier === "guardian" || tier === "institutional") {
    allTiers.push("creator");
  }
  if (tier === "guardian") allTiers.push("guardian");
  if (tier === "institutional") allTiers.push("institutional");

  const capabilities = allTiers.flatMap((t) => TIER_CAPABILITIES[t]);

  return {
    tier,
    activeSince: Date.now(),
    contributionScore,
    capabilities: [...new Set(capabilities)],
  };
}

/**
 * Verifica si un usuario tiene una capacidad específica.
 */
export async function hasCapability(
  userId: string,
  capability: string,
): Promise<boolean> {
  const membership = await getMembership(userId);
  return membership.capabilities.includes(capability);
}

/**
 * Eleva la membresía de un usuario (ej. al comprar suscripción externa).
 * Acuña créditos de uso y asigna el rol correspondiente.
 */
export async function upgradeMembership(
  userId: string,
  targetTier: MembershipTier,
  reason: string,
  creditsToMint: number = 300,
): Promise<MembershipInfo> {
  // Asignar rol si no lo tiene
  const roleMap: Record<MembershipTier, string | null> = {
    free: null,
    creator: "creator",
    guardian: "guardian",
    institutional: "institution",
  };

  const role = roleMap[targetTier];
  if (role) {
    await supabase.from("user_roles").upsert(
      {
        user_id: userId,
        role: role as any,
      },
      { onConflict: "user_id,role" as any }
    );
  }

  // Acuñar créditos de uso
  if (creditsToMint > 0) {
    await ledger.record({
      fromAccount: SYSTEM_POOLS.SYSTEM,
      toAccount: `user:${userId}`,
      amount: creditsToMint,
      unit: "usage_credit",
      type: "mint",
      reason: `membership_upgrade_${targetTier}: ${reason}`,
    });
  }

  return getMembership(userId);
}

/**
 * Obtiene las capacidades disponibles para un tier.
 */
export function getTierCapabilities(tier: MembershipTier): string[] {
  return [...TIER_CAPABILITIES[tier]];
}

/**
 * Obtiene el requisito de contribución para un tier.
 */
export function getTierRequirement(tier: MembershipTier): number {
  return TIER_MIN_CONTRIBUTION[tier];
}
