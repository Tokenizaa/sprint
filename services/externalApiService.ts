import { handleError } from '../utils/errorUtils';

// Tipos para os dados da API externa
interface ExternalDistributor {
  id: string;
  usuario: string;
  nome: string;
  email: string;
}

interface ExternalOrderItem {
  quantidade: string;
}

interface ExternalOrder {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  pagamento_confirmado: string;
  itens: ExternalOrderItem[];
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string | null;
}

interface DistributorsApiResponse {
  distribuidores: ExternalDistributor[];
}

interface ClientsApiResponse {
  clientes: any[];
}

// Credenciais da API externa
const API_BASE_URL = "https://allinbrasil.com.br/api/v1";

// Safe env access for both Node and Browser environments
const getEnvVar = (key: string): string | undefined => {
  try {
    // Check Node process
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // Check Vite import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}
  return undefined;
};

const CLIENT_ID = getEnvVar('CLIENT_ID') || "Camp_c20d65784a390c";
const CLIENT_SECRET = getEnvVar('CLIENT_SECRET') || "62457f7a66c270904c63c1c02f929e64384383f4";

/**
 * Obtém o token de acesso.
 * IMPORTANTE: Chamar apenas do servidor (Backend) para não expor CLIENT_SECRET no navegador.
 */
export async function getToken(): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Uses native fetch (available in modern Node and Browsers)
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID || '',
        client_secret: CLIENT_SECRET || '',
        grant_type: "client_credentials"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to get token: ${response.status} ${errorText}` };
    }

    const data = await response.json() as TokenResponse;
    return { success: true, token: data.access_token };
  } catch (error) {
    const errorMessage = handleError(error, "Error getting access token");
    return { success: false, error: errorMessage };
  }
}

export async function getDistribuidores(token: string): Promise<{ success: boolean; data?: ExternalDistributor[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/distribuidores`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to fetch distributors: ${response.status} ${errorText}` };
    }

    const data = await response.json() as DistributorsApiResponse;
    return { success: true, data: data.distribuidores };
  } catch (error) {
    const errorMessage = handleError(error, "Error fetching distributors");
    return { success: false, error: errorMessage };
  }
}

export async function getClientes(token: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to fetch clients: ${response.status} ${errorText}` };
    }

    const data = await response.json() as ClientsApiResponse;
    return { success: true, data: data.clientes };
  } catch (error) {
    const errorMessage = handleError(error, "Error fetching clients");
    return { success: false, error: errorMessage };
  }
}

export async function getPedidos(token: string, startDate?: string): Promise<{ success: boolean; data?: ExternalOrder[] | any[]; error?: string }> {
  try {
    const selectFields = 'cliente_nome,cliente_telefone,pagamento_confirmado,itens,distribuidor_indicador_id,tipo_nome,valor_total,data_adicionado';
    const dateFilter = startDate ? `&data_adicionado__maior_igual=${encodeURIComponent(startDate)}` : '';

    const response = await fetch(`${API_BASE_URL}/pedidos?select=${selectFields}${dateFilter}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 404) {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `Pedidos endpoint not accessible (404). Likely missing [pedidos] scope. Details: ${errorText}` 
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to fetch orders: ${response.status} ${errorText}` };
    }

    const rawData = await response.text();
    try {
      const data = JSON.parse(rawData);
      if (!data || !data.pedidos || !Array.isArray(data.pedidos)) {
        return { success: false, error: "Unexpected data structure for orders" };
      }

      const mapped = data.pedidos.map((order: any) => {
        const patrocinador = order.distribuidor_indicador_id ?? null;
        const tipoCliente = order.tipo_nome ?? order.cliente_tipo_pessoa_id ?? null;
        const situacao = order.pagamento_confirmado === '1' ? 'Pago' : 'Não pago';
        const total = order.valor_total ?? null;

        const itens = Array.isArray(order.itens) ? order.itens.map((it: any) => {
          let sku = null;
          try {
            if (it.produto_opcoes && Array.isArray(it.produto_opcoes) && it.produto_opcoes.length > 0) {
              const firstOption = it.produto_opcoes[0];
              sku = firstOption.produto_opcao_sku ?? firstOption.sku ?? null;
            }
          } catch (e) { sku = null; }

          return {
            produto: it.produto_descricao ?? it.produto_nome ?? null,
            modelo: it.produto_modelo ?? null,
            sku,
            quantidade: it.quantidade ? parseInt(it.quantidade, 10) : (it.quantidade_int ?? 0),
            valor_unitario: it.valor_unitario ?? it.valor_unitario_formatado ?? null,
            valor_total: it.valor_total ?? null
          };
        }) : [];

        return {
          id: order.id,
          cliente: order.cliente_nome ?? null,
          patrocinador,
          tipo_cliente: tipoCliente,
          telefone: order.cliente_telefone ?? null,
          total,
          situacao,
          itens,
          data_adicionado: order.data_adicionado ?? null
        };
      });

      return { success: true, data: mapped };
    } catch (parseError: any) {
      return { success: false, error: `Failed to parse orders data: ${parseError.message}` };
    }
  } catch (error) {
    const errorMessage = handleError(error, "Error fetching orders");
    return { success: false, error: errorMessage };
  }
}

export async function syncExternalData(): Promise<{ success: boolean; message: string }> {
  // ATENÇÃO: Esta função utiliza Secrets. Se chamada no browser, falhará ou exporá segredos se estiverem no build.
  // Deve ser chamada apenas do Backend/Server-Side.
  return { success: false, message: "Use the backend endpoint /api/sync" };
}