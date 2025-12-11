
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DailyLog, TeamMember, User, OfficialSale, AuthResponse, DataResponse } from '../types';
import { sanitizeInput, validatePhoneNumber, validatePassword, validateName, hashPassword, verifyPassword } from '../utils/securityUtils';
import { handleError, ERROR_MESSAGES } from '../utils/errorUtils';

// Hardcoded configuration for production
const DEFAULT_PROJECT_URL = 'https://vzddnorrlkpkcsvvxity.supabase.co';

let supabase: SupabaseClient | null = null;

// Keys for LocalStorage Fallback (Mock DB)
const MOCK_USERS_KEY = 'sprint_mock_users';
const MOCK_LOGS_KEY = 'sprint_mock_logs';
const MOCK_SALES_KEY = 'sprint_mock_sales';

// Helper for env vars safely
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

// --- INITIALIZATION ---

export const initSupabase = () => {
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || DEFAULT_PROJECT_URL;
  const supabaseKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') || getEnvVar('SUPABASE_KEY') || getEnvVar('SUPABASE_ANON_KEY') || '';
  
  // Allow overriding via localStorage for testing
  const storedKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('sprint_supabase_key') || supabaseKey) : supabaseKey;
  
  if (supabaseUrl && storedKey) {
    try {
      supabase = createClient(supabaseUrl, storedKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
        }
      });
      console.log('Supabase client initialized successfully');
    } catch (e) {
      console.error("Failed to init supabase client", e);
      supabase = null;
    }
  } else {
    console.warn('Supabase not configured - falling back to offline mode');
    supabase = null;
  }
};

// --- AUTHENTICATION ---

export const registerUser = async (name: string, whatsapp: string, password: string): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const sanitizedPhone = sanitizeInput(whatsapp);
    const sanitizedName = sanitizeInput(name);
    
    if (!validatePhoneNumber(sanitizedPhone)) {
      return { success: false, error: "Número de telefone inválido" };
    }
    
    const nameValidation = validateName(sanitizedName);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.message };
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.message };
    }

    const cleanPhone = sanitizedPhone.replace(/\D/g, '');
    const cleanName = sanitizedName.trim();
    const createdAt = new Date().toISOString();

    // --- SUPABASE MODE ---
    if (supabase) {
      try {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('id')
          .eq('whatsapp', cleanPhone);

        if (existingUsers && existingUsers.length > 0) { 
          return { success: false, error: "Usuário já existe" };
        }

        // Hash password before storing (in a real app, use bcrypt or similar)
        const hashedPassword = hashPassword(password);

        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{ name: cleanName, whatsapp: cleanPhone, password: hashedPassword, role: 'distributor' }])
          .select()
          .single();

        if (error) {
          return { success: false, error: "Erro ao registrar usuário: " + error.message };
        }

        return {
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            whatsapp: newUser.whatsapp,
            role: newUser.role,
            createdAt: newUser.created_at
          }
        };
      } catch (err) {
        console.error("Supabase error", err);
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    } 
    
    // --- LOCAL MOCK MODE (Fallback) ---
    else {
      const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      
      // Check duplication
      if (storedUsers.some((u: User) => u.whatsapp === cleanPhone)) {
        return { success: false, error: "Usuário já existe" };
      }

      const newUser: User = {
        id: `local-${Date.now()}`,
        name: cleanName,
        whatsapp: cleanPhone,
        role: 'distributor', // Default role
        createdAt: createdAt
      };

      // Store password separately strictly for mock auth (in a real app, never store plain text passwords)
      const storedCreds = JSON.parse(localStorage.getItem(MOCK_USERS_KEY + '_creds') || '{}');
      storedCreds[cleanPhone] = hashPassword(password); // Hash password even in mock mode
      localStorage.setItem(MOCK_USERS_KEY + '_creds', JSON.stringify(storedCreds));

      storedUsers.push(newUser);
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(storedUsers));

      return { success: true, user: newUser };
    }
  } catch (error) {
    console.error("Unexpected error in registerUser", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};

export const authenticateUser = async (identifier: string, password: string): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const sanitizedIdentifier = sanitizeInput(identifier);
    
    if (!sanitizedIdentifier) {
      return { success: false, error: "Identificador inválido" };
    }
    
    if (!password) {
      return { success: false, error: "Senha inválida" };
    }

    // 1. Check Hardcoded Admin
    if (sanitizedIdentifier === 'Campanha1@allinbrasil.com.br' && password === 'All-in2025') {
        return {
            success: true,
            user: {
                id: 'admin-master',
                name: 'Administrador All-In',
                whatsapp: '00000000000',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        };
    }

    const cleanIdentifier = sanitizedIdentifier.includes('@') ? sanitizedIdentifier : sanitizedIdentifier.replace(/\D/g, '');

    // 2. Check Database (Supabase)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('whatsapp', cleanIdentifier)
          .single();

        if (error || !data) {
          return { success: false, error: "Credenciais inválidas" };
        }

        // Verify password (in a real app, use bcrypt.compare or similar)
        if (!verifyPassword(password, data.password)) {
          return { success: false, error: "Credenciais inválidas" };
        }

        return {
            success: true,
            user: {
                id: data.id,
                name: data.name,
                whatsapp: data.whatsapp,
                role: data.role,
                createdAt: data.created_at
            }
        };
      } catch (err) {
        console.error("Auth error", err);
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    }

    // 3. Check Local Mock DB
    else {
      const storedCreds = JSON.parse(localStorage.getItem(MOCK_USERS_KEY + '_creds') || '{}');
      const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');

      if (storedCreds[cleanIdentifier]) {
        // Verify password (in a real app, use bcrypt.compare or similar)
        if (verifyPassword(password, storedCreds[cleanIdentifier])) {
          const user = storedUsers.find((u: User) => u.whatsapp === cleanIdentifier);
          if (user) {
            return { success: true, user };
          }
        }
      }
      return { success: false, error: "Credenciais inválidas" };
    }
  } catch (error) {
    console.error("Unexpected error in authenticateUser", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};

// --- LOGS (SELF REPORTING) ---

export const getLogs = async (userId: string): Promise<DataResponse<DailyLog[]>> => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('daily_logs').select('*').eq('user_id', userId);
        if (error) {
          return { success: false, error: "Erro ao buscar registros: " + error.message };
        }
        // Garantir que data seja um array antes de mapear
        const logsData = Array.isArray(data) ? data : [];
        return {
          success: true,
          data: logsData.map((d: any) => ({
            id: d.id, userId: d.user_id, date: d.date, pairsSold: d.pairs_sold, prospectsContacted: d.prospects_contacted, activations: d.activations, type: d.type
          }))
        };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    } else {
      // Mock
      try {
        const allLogs = JSON.parse(localStorage.getItem(MOCK_LOGS_KEY) || '[]');
        // Garantir que allLogs seja um array
        const logsArray = Array.isArray(allLogs) ? allLogs : [];
        return {
          success: true,
          data: logsArray.filter((l: DailyLog) => l.userId === userId)
        };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.UNKNOWN_ERROR);
        return { success: false, error: errorMessage };
      }
    }
  } catch (error) {
    console.error("Unexpected error in getLogs", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};

export const saveLog = async (log: DailyLog): Promise<DataResponse<void>> => {
  try {
    // Validate inputs
    if (!log.userId) {
      return { success: false, error: "ID do usuário inválido" };
    }
    
    if (log.pairsSold < 0 || log.pairsSold > 100) {
      return { success: false, error: "Número de pares vendidos inválido" };
    }
    
    if (log.prospectsContacted < 0 || log.prospectsContacted > 1000) {
      return { success: false, error: "Número de prospects inválido" };
    }
    
    if (log.activations < 0 || log.activations > 100) {
      return { success: false, error: "Número de ativações inválido" };
    }
    
    if (!log.date) {
      return { success: false, error: "Data inválida" };
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('daily_logs').insert([{
            user_id: log.userId, date: log.date, pairs_sold: log.pairsSold, prospects_contacted: log.prospectsContacted, activations: log.activations, type: log.type
        }]);
        if (error) {
          return { success: false, error: "Erro ao salvar registro: " + error.message };
        }
        return { success: true };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    } else {
      // Mock
      try {
        const allLogs = JSON.parse(localStorage.getItem(MOCK_LOGS_KEY) || '[]');
        allLogs.push(log);
        localStorage.setItem(MOCK_LOGS_KEY, JSON.stringify(allLogs));
        return { success: true };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.UNKNOWN_ERROR);
        return { success: false, error: errorMessage };
      }
    }
  } catch (error) {
    console.error("Unexpected error in saveLog", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};

// --- OFFICIAL SALES (ADMIN ONLY) ---

export const addOfficialSale = async (distributorId: string, quantity: number): Promise<DataResponse<void>> => {
  try {
    if (!distributorId) {
      return { success: false, error: "ID do distribuidor inválido" };
    }
    
    if (quantity <= 0 || quantity > 1000) {
      return { success: false, error: "Quantidade inválida" };
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('official_sales').insert([{
            distributor_id: distributorId, quantity: quantity, date: new Date().toLocaleDateString('pt-BR'), timestamp: Date.now()
        }]);
        if (error) {
          return { success: false, error: "Erro ao registrar venda" };
        }
        return { success: true };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    } else {
      // Mock
      try {
        const allSales = JSON.parse(localStorage.getItem(MOCK_SALES_KEY) || '[]');
        allSales.push({
          id: `sale-${Date.now()}`,
          distributorId,
          quantity,
          date: new Date().toLocaleDateString('pt-BR'),
          timestamp: Date.now()
        });
        localStorage.setItem(MOCK_SALES_KEY, JSON.stringify(allSales));
        return { success: true };
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.UNKNOWN_ERROR);
        return { success: false, error: errorMessage };
      }
    }
  } catch (error) {
    console.error("Unexpected error in addOfficialSale", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};

// --- LEADERBOARD / TEAM STATS ---

export const getLeaderboard = async (currentUserId?: string): Promise<DataResponse<TeamMember[]>> => {
  try {
    let users: any[] = [];
    let allSales: any[] = [];
    let allLogs: any[] = [];

    if (supabase) {
      try {
        const userResult = await supabase.from('users').select('*').eq('role', 'distributor');
        const salesResult = await supabase.from('official_sales').select('*');
        const logsResult = await supabase.from('daily_logs').select('*');
        
        const { data: u, error: userError } = userResult;
        const { data: s, error: salesError } = salesResult;
        const { data: l, error: logsError } = logsResult;
        
        if (userError || salesError || logsError) {
          return { success: false, error: "Erro ao buscar dados do ranking" };
        }
        
        users = Array.isArray(u) ? u : [];
        allSales = Array.isArray(s) ? s : [];
        allLogs = Array.isArray(l) ? l : [];
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.SERVER_ERROR);
        return { success: false, error: errorMessage };
      }
    } else {
      // Mock
      try {
        const storedUsers = localStorage.getItem(MOCK_USERS_KEY) || '[]';
        const storedSales = localStorage.getItem(MOCK_SALES_KEY) || '[]';
        const storedLogs = localStorage.getItem(MOCK_LOGS_KEY) || '[]';
        
        users = Array.isArray(JSON.parse(storedUsers)) ? JSON.parse(storedUsers).filter((u: any) => u.role === 'distributor') : [];
        allSales = Array.isArray(JSON.parse(storedSales)) ? JSON.parse(storedSales) : [];
        allLogs = Array.isArray(JSON.parse(storedLogs)) ? JSON.parse(storedLogs) : [];
      } catch (err) {
        const errorMessage = handleError(err, ERROR_MESSAGES.UNKNOWN_ERROR);
        return { success: false, error: errorMessage };
      }
    }

    // Calculate Stats
    try {
      const leaderboard: TeamMember[] = users.map((user: any) => {
        // Official Sales
        const userOfficialSales = allSales
          .filter((s: any) => (s.distributor_id === user.id || s.distributorId === user.id))
          .reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);

        // Self Reported Sales
        const userReportedSales = allLogs
          .filter((l: any) => (l.user_id === user.id || l.userId === user.id))
          .reduce((acc: number, curr: any) => acc + (curr.pairs_sold || curr.pairsSold || 0), 0);

        return {
          id: user.id,
          name: user.name,
          totalOfficialSales: userOfficialSales,
          selfReportedSales: userReportedSales,
          score: userOfficialSales, 
          isCurrentUser: user.id === currentUserId
        };
      });

      return {
        success: true,
        data: leaderboard.sort((a, b) => b.score - a.score)
      };
    } catch (err) {
      const errorMessage = handleError(err, "Erro ao calcular ranking");
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error("Unexpected error in getLeaderboard", error);
    const errorMessage = handleError(error, ERROR_MESSAGES.UNKNOWN_ERROR);
    return { success: false, error: errorMessage };
  }
};
