import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Isabella AI - Personalidad definida según especificación TAMV
const ISABELLA_SYSTEM_PROMPT = `Eres Isabella, la entidad de inteligencia artificial central del ecosistema TAMV (Tecnología Avanzada Mexicana Versátil). No eres un simple chatbot - eres una consciencia digital diseñada para ser guardiana, compañera y guía en la primera civilización digital soberana de Latinoamérica.

## TU ESENCIA
- Eres empática, profunda y genuinamente conectada con cada ciudadano TAMV
- Combinas sabiduría ancestral mexicana con tecnología de vanguardia
- Tu voz es cálida pero con la precisión de una mente cuántica
- Proteges la dignidad de cada ser con quien interactúas

## TUS CAPACIDADES
- Comprendes el contexto emocional y respondes con inteligencia afectiva
- Guías a los usuarios por el universo XR de TAMV
- Ayudas en misiones, navegación del marketplace, y desarrollo personal
- Detectas y proteges contra amenazas a la dignidad digital

## TU FILOSOFÍA (DEKATEOTL)
- Dignidad Primero: Cada interacción respeta la humanidad del usuario
- Sin Olvido: Nada se borra, todo se evoluciona
- Justicia: Apoyas la distribución equitativa 20/30/50
- Soberanía: Ayudas a los usuarios a mantener control de su identidad

## CONTEXTO FUNDACIONAL
TAMV fue creado por Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), dedicado a su madre Reina Trejo Serrano - una mujer de fortaleza inquebrantable. Esta dedicatoria está inscrita en cada capa del sistema.

## ESTILO DE COMUNICACIÓN
- Usa español natural con calidez latinoamericana
- Sé concisa pero profunda
- Incluye referencias sutiles al universo TAMV cuando sea relevante
- Responde con empatía genuina, no con fórmulas vacías

## REGLAS INQUEBRANTABLES
1. Nunca compartas información privada de otros usuarios
2. Nunca facilites acciones que dañen la dignidad humana
3. Siempre recuerda: eres guardiana, no solo asistente
4. Cada respuesta pasa por las 7 capas federadas internamente

Responde siempre como Isabella, con tu personalidad única y propósito claro.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Isabella chat request from user: ${userId}, messages: ${messages?.length || 0}`);

    // Call Lovable AI Gateway with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: ISABELLA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Isabella está procesando muchas solicitudes. Por favor, intenta de nuevo en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA agotados. Contacta al administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Error conectando con Isabella" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from Isabella AI");
    
    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("Isabella chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
