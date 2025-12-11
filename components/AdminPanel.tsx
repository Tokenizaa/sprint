import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, CheckCircle, TrendingUp, RefreshCw, Loader2, Clock, AlertTriangle, UserCog, Info } from 'lucide-react';
import { TeamMember } from '../types';
import { getLeaderboard } from '../services/storageService';
import { validateQuantity } from '../utils/securityUtils';

const AdminPanel: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<'admin' | 'distributor'>('distributor');
  const [notification, setNotification] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [externalApiLoading, setExternalApiLoading] = useState(false);
  const [externalApiStatus, setExternalApiStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string, details?: string }>({ type: 'idle', message: '' });
  const [lastImportedOrders, setLastImportedOrders] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');
  const [adminApiKey, setAdminApiKey] = useState<string>(localStorage.getItem('admin_api_key') || '');

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setDataLoading(true);
    setUserLoading(true);
    setAdminError('');
    
    // Busca dados do leaderboard via API interna
    try {
      const resp = await fetch('/api/leaderboard');
      if (resp.ok) {
        const reportResult = await resp.json();
        if (reportResult.success && reportResult.data) {
          setTeam(reportResult.data);
          setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        } else {
           fallbackLeaderboard();
        }
      } else {
        // Tenta ler o erro JSON se disponível
        try {
            const errData = await resp.json();
            if (errData.error) console.warn("API Warning:", errData.error);
        } catch {}
        fallbackLeaderboard();
      }
    } catch (error) {
      console.error("Erro de rede ao buscar relatório:", error);
      fallbackLeaderboard();
    }
    
    // Buscar usuários
    try {
      const resp = await fetch('/api/users');
      if (resp.ok) {
          const usersResult = await resp.json();
          if (usersResult.success && usersResult.data) {
            setUsers(usersResult.data);
          }
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setUserLoading(false);
    }
    
    setDataLoading(false);
  };

  const fallbackLeaderboard = async () => {
      // Fallback para mock local se a API falhar
      const leaderboardResult = await getLeaderboard();
      if (leaderboardResult.success && leaderboardResult.data) {
        setTeam(leaderboardResult.data);
        setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      } else if (leaderboardResult.error) {
        setAdminError(leaderboardResult.error);
      }
  };

  const handleUpdateUserRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    setNotification(`Funcionalidade requer endpoint seguro. ID: ${selectedUser}, Role: ${newRole}`);
    setLoading(false);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleTestExternalApi = async () => {
    setExternalApiLoading(true);
    setExternalApiStatus({ type: 'idle', message: '' });
    
    try {
      const resp = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminApiKey }
      });
      
      const data = await resp.json();

      if (resp.ok && data.success) {
          setExternalApiStatus({ 
              type: 'success', 
              message: data.message || 'Sincronização realizada com sucesso!',
              details: data.details
          });

          if (data && Array.isArray(data.payloads)) {
            const pedidosPayload = data.payloads.find((p: any) => p.source === 'pedidos');
            if (pedidosPayload && Array.isArray(pedidosPayload.data)) {
              setLastImportedOrders(pedidosPayload.data.slice(0, 50));
            }
          }
          // Atualiza o ranking após sincronização bem sucedida
          setTimeout(refreshData, 1000);
      } else {
          setExternalApiStatus({ 
              type: 'error', 
              message: data.error || 'Erro na sincronização.',
              details: data.details || (resp.status === 401 ? 'Verifique a chave de API.' : undefined)
          });
      }

    } catch (error) {
      setExternalApiStatus({ 
          type: 'error', 
          message: 'Erro de conexão com o servidor.', 
          details: (error as Error).message 
      });
    } finally {
      setExternalApiLoading(false);
    }
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDistributor || !quantity) return;

    const quantityValidation = validateQuantity(quantity);
    if (!quantityValidation.isValid) {
      setNotification(quantityValidation.message);
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const payload = { distributorId: selectedDistributor, quantity: Number(quantity) };
      const resp = await fetch('/api/official_sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminApiKey },
        body: JSON.stringify(payload)
      });
      const result = await resp.json();
      
      if (resp.ok && result.success) {
        setNotification('Venda registrada com sucesso!');
        setQuantity('');
        await refreshData();
      } else {
        setNotification('Erro: ' + (result.error || result.message || 'Erro desconhecido'));
      }
    } catch (e) {
      setNotification('Erro de rede: ' + (e as Error).message);
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="bg-race-navy text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative z-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-race-yellow opacity-10 rounded-bl-full -z-10"></div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Users className="text-race-yellow" />
            Painel do Administrador
          </h2>
          <p className="text-gray-400 mt-2">Gerencie as vendas oficiais e atualize o ranking.</p>
        </div>
        {lastUpdate && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} />
            <span>Atualizado às {lastUpdate}</span>
          </div>
        )}
      </div>
      
      {adminError && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Aviso do Sistema</p>
              <p className="text-sm mt-1">{adminError}</p>
              <p className="text-xs mt-2 text-red-300">Algumas funcionalidades podem estar limitadas ao modo offline.</p>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="bg-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold animate-fade-in sticky top-4 z-50 shadow-lg">
          <CheckCircle size={20} className="mr-2" />
          {notification}
        </div>
      )}

      {/* ADMIN TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form: Test External API */}
        <div className="bg-race-carbon border border-white/10 p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <RefreshCw className="text-race-yellow" />
            Sincronização API Externa
          </h3>
          
          <div className="space-y-5">
            <div className="bg-blue-500/10 border border-blue-400/20 p-4 rounded-xl flex gap-3">
              <Info className="text-blue-400 shrink-0" size={20} />
              <p className="text-sm text-blue-200">
                Esta ação conecta ao servidor interno para buscar dados da All-In. Requer a chave de API de administração configurada no servidor.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Chave de API do Admin (x-admin-key)"
                value={adminApiKey}
                onChange={(e) => { setAdminApiKey(e.target.value); localStorage.setItem('admin_api_key', e.target.value); }}
                className="flex-1 p-3 bg-black border border-white/10 rounded-xl focus:outline-none text-white focus:border-race-yellow transition-colors"
              />
              <button
                onClick={handleTestExternalApi}
                disabled={externalApiLoading}
                className="px-4 bg-race-navy text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {externalApiLoading ? <Loader2 className="animate-spin" /> : 'Sincronizar'}
              </button>
            </div>

            {externalApiStatus.message && (
              <div className={`p-4 rounded-xl animate-fade-in ${
                  externalApiStatus.type === 'error' 
                  ? 'bg-red-900/50 border border-red-500/50' 
                  : 'bg-green-900/50 border border-green-500/50'
              }`}>
                <div className="flex items-start gap-3">
                    {externalApiStatus.type === 'error' ? <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} /> : <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />}
                    <div>
                        <p className={`font-bold ${externalApiStatus.type === 'error' ? 'text-red-200' : 'text-green-200'}`}>
                        {externalApiStatus.message}
                        </p>
                        {externalApiStatus.details && (
                            <p className={`text-xs mt-1 ${externalApiStatus.type === 'error' ? 'text-red-300' : 'text-green-300'} font-mono bg-black/20 p-2 rounded`}>
                                {externalApiStatus.details}
                            </p>
                        )}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Form: Add Sales */}
        <div className="bg-race-carbon border border-white/10 p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <PlusCircle className="text-race-yellow" />
            Apontar Venda (Oficial)
          </h3>
          
          <form onSubmit={handleAddSale} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Selecione o Distribuidor</label>
              <select
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-race-yellow focus:ring-2 focus:ring-race-yellow/20 focus:outline-none font-bold text-lg text-white"
                required
                disabled={dataLoading}
              >
                <option value="">-- Selecione --</option>
                {team.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} (Atual: {member.totalOfficialSales})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Quantidade de Pares</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:border-race-yellow focus:ring-2 focus:ring-race-yellow/20 focus:outline-none font-bold text-lg text-white"
                placeholder="Ex: 5"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || dataLoading}
              className="w-full bg-race-navy text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Salvar Venda'}
            </button>
          </form>
        </div>

        {/* List: Official Ranking */}
        <div className="bg-race-carbon border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="text-race-yellow" />
              Ranking Oficial
              </h3>
              <div className="flex gap-2">
                {lastUpdate && (
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {lastUpdate}
                  </div>
                )}
                <button 
                  onClick={refreshData} 
                  disabled={dataLoading}
                  className="text-xs font-bold text-race-navy bg-gray-100 hover:bg-race-yellow px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} />
                  Atualizar
                </button>
              </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex-1">
            {team.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  {dataLoading ? 'Carregando...' : 'Nenhum distribuidor encontrado.'}
                </div>
            ) : (
                team.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                          ${index === 0 ? 'bg-race-yellow text-race-navy' : 'bg-white text-gray-500 border border-gray-200'}
                        `}>
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{member.name}</span>
                          <span className="text-xs text-gray-400">Log Pessoal: {member.selfReportedSales}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-xl text-race-navy">{member.totalOfficialSales}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirmados</div>
                      </div>
                    </div>
                  ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;