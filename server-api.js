import dotenv from 'dotenv';
import http from 'http';
import url from 'url';
import { initSupabaseAdmin, syncExternalData, getKPIs, getTeamPerformanceReport, upsertOfficialSale, getDailySales } from './services/apiIntegrationService.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function sendError(res, status, message, details = null) {
  console.error(`[Error ${status}] ${message}`, details);
  sendJson(res, status, { 
    success: false, 
    error: message, 
    details: details,
    timestamp: new Date().toISOString() 
  });
}

async function requireInit() {
  const init = initSupabaseAdmin();
  if (!init.success) {
    throw new Error(init.error || 'Falha ao inicializar o cliente Supabase Admin.');
  }
}

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '/';

  try {
    // Middleware de Autenticação para rotas /api/
    if (pathname.startsWith('/api/')) {
      const key = req.headers['x-admin-key'] || '';
      
      if (!ADMIN_API_KEY) {
         return sendError(res, 500, 'Erro de configuração do servidor: ADMIN_API_KEY não definida.');
      }
      
      if (key !== ADMIN_API_KEY) {
        return sendError(res, 401, 'Acesso não autorizado. Chave de administração inválida ou ausente.');
      }
    }

    if (req.method === 'POST' && pathname === '/api/sync') {
      await requireInit();
      const result = await syncExternalData();
      
      if (!result.success) {
        return sendError(res, 502, 'Falha na sincronização com API externa', result.message);
      }
      
      return sendJson(res, 200, result);
    }

    if (req.method === 'GET' && pathname === '/api/kpis') {
      await requireInit();
      const { start, end } = parsed.query || {};
      const result = await getKPIs(start, end);
      return sendJson(res, result.success ? 200 : 500, result);
    }

    if (req.method === 'GET' && pathname === '/api/leaderboard') {
      await requireInit();
      const result = await getTeamPerformanceReport();
      if (!result.success) {
         return sendError(res, 500, result.error || 'Erro ao gerar relatório de equipe');
      }
      return sendJson(res, 200, result);
    }

    if (req.method === 'GET' && pathname === '/api/daily-sales') {
      await requireInit();
      const result = await getDailySales();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    if (req.method === 'GET' && pathname === '/api/users') {
      await requireInit();
      const { getAllUsers } = await import('./services/apiIntegrationService.js');
      const result = await getAllUsers();
      return sendJson(res, result.success ? 200 : 500, result);
    }

    if (req.method === 'POST' && pathname === '/api/official_sales') {
      let body = '';
      for await (const chunk of req) body += chunk;
      
      let payload = {};
      try {
        payload = body ? JSON.parse(body) : {};
      } catch (e) {
        return sendError(res, 400, 'JSON inválido no corpo da requisição');
      }

      const { distributorId, quantity, id } = payload;
      if (!distributorId || typeof quantity !== 'number') {
        return sendError(res, 400, 'Dados inválidos: distributorId e quantity (número) são obrigatórios.');
      }

      await requireInit();
      const result = await upsertOfficialSale({ distributorId, quantity, date: new Date().toISOString(), timestamp: Date.now(), id });
      
      if (!result.success) {
         return sendError(res, 500, result.error || 'Erro ao salvar venda oficial');
      }
      return sendJson(res, 200, result);
    }

    // Rota não encontrada
    if (pathname !== '/') {
        return sendError(res, 404, `Endpoint '${pathname}' não encontrado.`);
    }
    
    // Root
    sendJson(res, 200, { status: 'online', message: 'Sprint All-In API Server' });

  } catch (err) {
    console.error('Critical Server Error:', pathname, err);
    sendError(res, 500, 'Erro interno crítico no servidor', err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Server API listening on port ${PORT}`);
});