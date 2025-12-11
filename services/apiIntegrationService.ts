import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DailyLog, TeamMember, User, OfficialSale, DataResponse } from '../types';
import { handleError } from '../utils/errorUtils';

// Configuração do cliente Supabase para integração
const isBrowser = typeof window !== 'undefined';

// Safe access to vite env or process env
const getEnvVar = (key: string): string | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}
  return undefined;
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || 'https://vzddnorrlkpkcsvvxity.supabase.co';
// Prefer non-VITE server env for the service role key
const SUPABASE_SERVICE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('VITE_SUPABASE_SERVICE_ROLE_KEY') || '';

let supabaseAdmin: SupabaseClient | null = null;

// Inicialização do cliente Supabase admin (APENAS SERVER-SIDE)
export const initSupabaseAdmin = (): { success: boolean; error?: string } => {
  if (isBrowser) {
    return { success: false, error: "Admin init prevented in browser" };
  }

  if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY.includes('XXXXXXXX')) {
    return { success: false, error: "Service Role Key inválida ou não configurada no servidor." };
  }

  try {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    console.log('Supabase admin client initialized (server-only)');
    return { success: true };
  } catch (e) {
    const errorMessage = handleError(e, "Falha ao inicializar Supabase Admin");
    return { success: false, error: errorMessage };
  }
};

// Função para sincronizar dados da API externa (Híbrida)
export const syncExternalData = async (): Promise<{ success: boolean; message: string; payloads?: any[] }> => {
  // No navegador, delegar para a API Interna
  if (isBrowser) {
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      return await response.json();
    } catch (e) {
      return { success: false, message: "Falha ao chamar API interna: " + (e as Error).message };
    }
  }

  // No servidor, executar a lógica
  if (!supabaseAdmin) {
    return { success: false, message: "Supabase admin client not initialized" };
  }

  try {
    // Importação dinâmica para evitar que código de servidor vaze para o bundle do cliente
    const externalApi = await import('./externalApiService');
    
    // 1. Obter token
    const tokenResult = await externalApi.getToken();
    if (!tokenResult.success || !tokenResult.token) {
      return { success: false, message: `Failed to get external API token: ${tokenResult.error}` };
    }
    const token = tokenResult.token;

    // 2. Buscar dados
    const distResult = await externalApi.getDistribuidores(token);
    const CAMPAIGN_START = '2025-12-08 00:00:00';
    const pedidosResult = await externalApi.getPedidos(token, CAMPAIGN_START);

    // 3. Montar payloads
    const payloads: any[] = [];
    if (distResult.success && distResult.data) {
      payloads.push({ source: 'distribuidores', data: distResult.data, fetched_at: new Date().toISOString() });
    }
    if (pedidosResult.success && pedidosResult.data) {
      payloads.push({ source: 'pedidos', data: pedidosResult.data, fetched_at: new Date().toISOString() });
    }

    if (payloads.length === 0) {
      return { success: true, message: 'No external data fetched' };
    }

    // 4. Salvar cache bruto e processar vendas (Lógica Simplificada)
    // Aqui normalmente salvaríamos no Supabase e processaríamos as vendas oficiais
    
    return { success: true, message: `Fetched ${payloads.length} payloads (Server Side Execution)`, payloads };
  } catch (error) {
    const errorMessage = handleError(error, "Error syncing external data");
    return { success: false, message: errorMessage };
  }
};

// Buscar relatórios (Consome API Interna no browser)
export const getTeamPerformanceReport = async (): Promise<DataResponse<TeamMember[]>> => {
  if (isBrowser) {
    try {
      const resp = await fetch('/api/leaderboard');
      if (resp.ok) return await resp.json();
      return { success: false, error: `API error: ${resp.statusText}` };
    } catch (e) {
      return { success: false, error: "Failed to fetch leaderboard from API" };
    }
  }

  // Lógica de Servidor
  if (!supabaseAdmin) return { success: false, error: "Server Admin not init" };
  
  // (Implementação real do servidor buscaria do Supabase)
  return { success: false, error: "Server implementation pending DB connection" };
};

export const getSalesStatsByPeriod = async (startDate: string, endDate: string) => { return { success: false, error: 'Not implemented' } };
export const getKPIs = async (startDate?: string, endDate?: string) => { return { success: false, error: 'Not implemented' } };

export const getAllUsers = async (): Promise<DataResponse<User[]>> => {
  if (isBrowser) {
    try {
      const resp = await fetch('/api/users');
      if (!resp.ok) throw new Error(resp.statusText);
      return await resp.json();
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }
  return { success: false, error: "Server implementation required" };
};

export const getUserById = async (userId: string) => { return { success: false, error: 'Not implemented' } };
export const getDailySales = async () => { return { success: false, error: 'Not implemented' } };

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (isBrowser) {
     try {
       const res = await fetch('/api/leaderboard'); // Ping simples
       if (res.ok) return { success: true, message: "API connection successful" };
       return { success: false, message: `API error: ${res.statusText}` };
     } catch(e) {
       return { success: false, message: (e as Error).message };
     }
  }
  if (supabaseAdmin) return { success: true, message: "Supabase Admin Initialized" };
  return { success: false, message: "Not initialized" }; 
};

export const unsubscribeFromDashboardUpdates = (subscription: any) => {};
export const upsertOfficialSale = async (sale: any) => { return { success: false, error: "Server-side only" } };
export const updateUserRole = async (userId: string, role: any) => { return { success: false, error: 'Not implemented' } };
export const subscribeToDashboardUpdates = (cb: any) => {};