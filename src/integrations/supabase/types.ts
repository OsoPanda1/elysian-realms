export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      governance_rules: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          rule_type: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          rule_type?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          rule_type?: string
        }
        Relationships: []
      }
      intentions: {
        Row: {
          action_type: string
          approved: boolean
          context: Json | null
          created_at: string
          id: string
          purpose: string | null
          rejection_reason: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          user_id: string
        }
        Insert: {
          action_type: string
          approved?: boolean
          context?: Json | null
          created_at?: string
          id?: string
          purpose?: string | null
          rejection_reason?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          user_id: string
        }
        Update: {
          action_type?: string
          approved?: boolean
          context?: Json | null
          created_at?: string
          id?: string
          purpose?: string | null
          rejection_reason?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          user_id?: string
        }
        Relationships: []
      }
      isabella_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          is_active: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      isabella_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "isabella_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "isabella_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_listed: boolean
          metadata: Json | null
          model_url: string | null
          name: string
          price: number
          rarity: string | null
          seller_id: string
          stock: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_listed?: boolean
          metadata?: Json | null
          model_url?: string | null
          name: string
          price: number
          rarity?: string | null
          seller_id: string
          stock?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_listed?: boolean
          metadata?: Json | null
          model_url?: string | null
          name?: string
          price?: number
          rarity?: string | null
          seller_id?: string
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          mission_type: string
          requirements: Json | null
          tau_reward: number | null
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          mission_type?: string
          requirements?: Json | null
          tau_reward?: number | null
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          mission_type?: string
          requirements?: Json | null
          tau_reward?: number | null
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          dedication_acknowledged: boolean
          did: string | null
          display_name: string
          id: string
          missions_completed: number
          onboarding_completed: boolean
          reputation_score: number
          trust_level: number
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          worlds_visited: number
          xr_time_minutes: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          dedication_acknowledged?: boolean
          did?: string | null
          display_name?: string
          id?: string
          missions_completed?: number
          onboarding_completed?: boolean
          reputation_score?: number
          trust_level?: number
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          worlds_visited?: number
          xr_time_minutes?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          dedication_acknowledged?: boolean
          did?: string | null
          display_name?: string
          id?: string
          missions_completed?: number
          onboarding_completed?: boolean
          reputation_score?: number
          trust_level?: number
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          worlds_visited?: number
          xr_time_minutes?: number
        }
        Relationships: []
      }
      registry: {
        Row: {
          act_type: string
          content_hash: string
          created_at: string
          description: string | null
          id: string
          is_immutable: boolean
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          act_type: string
          content_hash: string
          created_at?: string
          description?: string | null
          id?: string
          is_immutable?: boolean
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          act_type?: string
          content_hash?: string
          created_at?: string
          description?: string | null
          id?: string
          is_immutable?: boolean
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          fenix_share: number | null
          from_user_id: string | null
          id: string
          infra_share: number | null
          metadata: Json | null
          reserve_share: number | null
          to_user_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          fenix_share?: number | null
          from_user_id?: string | null
          id?: string
          infra_share?: number | null
          metadata?: Json | null
          reserve_share?: number | null
          to_user_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          fenix_share?: number | null
          from_user_id?: string | null
          id?: string
          infra_share?: number | null
          metadata?: Json | null
          reserve_share?: number | null
          to_user_id?: string | null
          transaction_type?: string
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          mission_id: string
          progress: number
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          mission_id: string
          progress?: number
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          mission_id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          locked_balance: number
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          locked_balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xr_worlds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          required_trust_level: number | null
          scene_config: Json | null
          slug: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          required_trust_level?: number | null
          scene_config?: Json | null
          slug: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          required_trust_level?: number | null
          scene_config?: Json | null
          slug?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "user"
        | "creator"
        | "guardian"
        | "node"
        | "institution"
        | "admin"
      risk_level: "low" | "medium" | "high" | "critical"
      verification_status: "pending" | "verified" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "creator", "guardian", "node", "institution", "admin"],
      risk_level: ["low", "medium", "high", "critical"],
      verification_status: ["pending", "verified", "suspended"],
    },
  },
} as const
