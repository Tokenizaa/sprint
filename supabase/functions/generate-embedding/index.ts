import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmbeddingRequest {
  text: string;
  promptId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verifica se o Ollama está configurado
    const OLLAMA_BASE_URL = Deno.env.get("OLLAMA_BASE_URL");
    const OLLAMA_EMBEDDING_MODEL = Deno.env.get("OLLAMA_EMBEDDING_MODEL") || "nomic-embed-text";
    
    const { text, promptId }: EmbeddingRequest = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating embedding for text (${text.length} chars)...`);

    let contentSummary = text.slice(0, 500);
    let embedding: number[] = [];

    // Se Ollama estiver configurado, usa-o para gerar embeddings
    if (OLLAMA_BASE_URL) {
      try {
        console.log(`Using Ollama for embedding generation: ${OLLAMA_BASE_URL}`);
        
        const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OLLAMA_EMBEDDING_MODEL,
            prompt: text,
          }),
        });

        if (ollamaResponse.ok) {
          const ollamaData = await ollamaResponse.json();
          embedding = ollamaData.embedding;
          
          // Gera um resumo usando o Ollama também
          const summaryResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: OLLAMA_EMBEDDING_MODEL.includes("-embed-") ? OLLAMA_EMBEDDING_MODEL.replace("-embed-", "-") : "llama3", // Tenta usar um modelo de linguagem
              prompt: `Resuma o seguinte texto em 2-3 frases, capturando a essência principal:\n\n${text}`,
              stream: false,
            }),
          });

          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            contentSummary = summaryData.response || contentSummary;
          }
        } else {
          throw new Error(`Ollama API error: ${ollamaResponse.status}`);
        }
      } catch (ollamaError) {
        console.error("Ollama embedding generation failed:", ollamaError);
        // Fallback para o método original
        contentSummary = text.slice(0, 500);
        embedding = generateSimpleEmbedding(contentSummary);
      }
    } else {
      // Usa o método original com a API Lovable AI
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        throw new Error("LOVABLE_API_KEY is not configured");
      }

      const summaryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "Você é um assistente que cria resumos semânticos concisos para busca vetorial. Gere um resumo de 2-3 frases capturando a essência do prompt, incluindo: propósito, técnica de prompting, domínio/área, e principais funcionalidades. Responda APENAS com o resumo, sem explicações adicionais."
            },
            {
              role: "user",
              content: text
            }
          ],
        }),
      });

      if (!summaryResponse.ok) {
        const errorText = await summaryResponse.text();
        console.error("AI gateway error:", summaryResponse.status, errorText);
        
        if (summaryResponse.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (summaryResponse.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`AI gateway error: ${summaryResponse.status}`);
      }

      const summaryData = await summaryResponse.json();
      contentSummary = summaryData.choices?.[0]?.message?.content || text.slice(0, 500);

      // Generate embedding using text-embedding model simulation
      embedding = generateSimpleEmbedding(contentSummary);
    }

    console.log("Generated summary:", contentSummary);

    return new Response(
      JSON.stringify({ 
        embedding, 
        contentSummary,
        promptId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simple deterministic embedding generator (1536 dimensions for OpenAI compatibility)
// This creates a semantic hash based on word frequencies and character patterns
function generateSimpleEmbedding(text: string): number[] {
  const dimensions = 1536;
  const embedding = new Array(dimensions).fill(0);
  
  // Normalize text
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  
  // Create embedding based on word hashes and positions
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode * 31 + j * 17 + i * 7) % dimensions;
      embedding[index] += 1 / (1 + i * 0.1); // Weight by position
    }
  }
  
  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
  }
  
  return embedding;
}
