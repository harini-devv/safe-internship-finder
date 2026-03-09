import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Please provide more text to analyze." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an internship scam detection expert. Analyze the provided internship offer text and determine if it's likely a scam.

You MUST respond using the analyze_scam tool.

Common scam indicators:
- Requests for upfront payment or fees
- Asks for sensitive personal information (SSN, bank details) early
- Vague job descriptions with unrealistic pay
- Uses free email domains (gmail, yahoo) for official communications
- Poor grammar and spelling
- Pressure tactics or urgency
- No verifiable company information
- Promises of guaranteed income
- Work-from-home with no interview process
- Requests to purchase equipment or software`,
          },
          {
            role: "user",
            content: `Analyze this internship offer for scam indicators:\n\n${text.slice(0, 3000)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_scam",
              description: "Return the scam analysis result",
              parameters: {
                type: "object",
                properties: {
                  scam_probability: {
                    type: "number",
                    description: "Percentage probability that this is a scam (0-100)",
                  },
                  risk_level: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Overall risk level",
                  },
                  explanation: {
                    type: "string",
                    description: "A 2-3 sentence explanation of why this offer may or may not be a scam",
                  },
                  red_flags: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of specific red flags found in the text",
                  },
                },
                required: ["scam_probability", "risk_level", "explanation", "red_flags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_scam" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis result from AI");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-offer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
