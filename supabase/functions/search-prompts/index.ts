import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    // Get auth header to identify user
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get user from token if provided
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Parse request body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se requestBody existe e tem a propriedade query
    if (!requestBody || typeof requestBody !== 'object') {
      return new Response(
        JSON.stringify({ error: "Request body must be an object" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query, matchThreshold = 0.5, matchCount = 5 }: SearchRequest = requestBody;

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for: "${query}" (user: ${userId || 'anonymous'})`);

    // Generate embedding for query
    const embedding = generateSimpleEmbedding(query);

    // Call the search function
    const { data: results, error } = await supabase.rpc('search_similar_prompts', {
      query_embedding: embedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      p_user_id: userId,
    });

    if (error) {
      console.error("Search error:", error);
      throw error;
    }

    // Get full prompt details for matches
    if (results && results.length > 0) {
      const promptIds = results.map((r: any) => r.prompt_id);
      
      const { data: prompts, error: promptError } = await supabase
        .from('prompt_history')
        .select('*')
        .in('id', promptIds);
      
      if (promptError) {
        console.error("Error fetching prompts:", promptError);
      }
      
      const enrichedResults = results.map((r: any) => ({
        ...r,
        prompt: prompts?.find((p: any) => p.id === r.prompt_id),
      }));

      return new Response(
        JSON.stringify({ results: enrichedResults }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ results: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateSimpleEmbedding(text: string): number[] {
  const dimensions = 1536;
  const embedding = new Array(dimensions).fill(0);
  
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode * 31 + j * 17 + i * 7) % dimensions;
      embedding[index] += 1;
    }
  }
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}