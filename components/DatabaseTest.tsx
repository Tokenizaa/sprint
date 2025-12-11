import React, { useState, useEffect } from 'react';
// Calls server endpoints for DB tests and reports


const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [teamReport, setTeamReport] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Note: admin initialization must be done server-side. Front-end will use read-only/public client where available.
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/leaderboard');
      const result = await resp.json();
      if (result.success) {
        setConnectionStatus('Connection OK (leaderboard fetched)');
      } else {
        setConnectionStatus('Connection failed: ' + (result.error || result.message));
        setError(result.error || result.message);
      }
    } catch (error) {
      setConnectionStatus('Error: ' + (error as Error).message);
      setError('Erro ao testar conexão: ' + (error as Error).message);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/users');
      const result = await resp.json();
      if (result.success && result.data) {
        setUsers(result.data);
        setConnectionStatus(`Sucesso: ${result.data.length} usuários encontrados`);
      } else {
        setUsers([]);
        setError(result.error || 'Erro ao buscar usuários');
      }
    } catch (error) {
      setUsers([]);
      setError('Erro ao buscar usuários: ' + (error as Error).message);
    }
    setLoading(false);
  };

  const fetchTeamReport = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/leaderboard');
      const result = await resp.json();
      if (result.success && result.data) {
        setTeamReport(result.data);
        setConnectionStatus(`Sucesso: Relatório de equipe com ${result.data.length} membros`);
      } else {
        setTeamReport([]);
        setError(result.error || 'Erro ao buscar relatório da equipe');
      }
    } catch (error) {
      setTeamReport([]);
      setError('Erro ao buscar relatório da equipe: ' + (error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-race-carbon border border-white/10 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black text-white mb-6">Teste de Conexão com Banco de Dados</h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
          <p className="font-bold">Erro:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-white mb-2">Status da conexão: {connectionStatus || 'Aguardando teste...'}</p>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-race-navy text-white font-bold py-2 px-4 rounded-lg hover:bg-black transition-all mr-2 disabled:opacity-50"
        >
          {loading ? 'Testando...' : 'Testar Conexão'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-race-yellow text-race-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-all mr-2 disabled:opacity-50 w-full"
          >
            {loading ? 'Buscando usuários...' : 'Buscar Usuários'}
          </button>
        </div>
        <div>
          <button
            onClick={fetchTeamReport}
            disabled={loading}
            className="bg-race-yellow text-race-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-all mr-2 disabled:opacity-50 w-full"
          >
            {loading ? 'Buscando relatório...' : 'Buscar Relatório da Equipe'}
          </button>
        </div>
      </div>
      
      {users.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-3">Usuários Encontrados ({users.length})</h3>
          <div className="bg-black/30 rounded-xl p-4 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="border-b border-white/10 py-2 last:border-0">
                <p className="text-white font-bold">{user.name}</p>
                <p className="text-gray-400 text-sm">ID: {user.id}</p>
                <p className="text-gray-400 text-sm">WhatsApp: {user.whatsapp}</p>
                <p className="text-gray-400 text-sm">Papel: {user.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {teamReport.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-3">Relatório da Equipe ({teamReport.length} membros)</h3>
          <div className="bg-black/30 rounded-xl p-4 max-h-60 overflow-y-auto">
            {teamReport.map((member) => (
              <div key={member.id} className="border-b border-white/10 py-2 last:border-0">
                <p className="text-white font-bold">{member.name}</p>
                <p className="text-gray-400 text-sm">Vendas Oficiais: {member.totalOfficialSales}</p>
                <p className="text-gray-400 text-sm">Vendas Autorrelatadas: {member.selfReportedSales}</p>
                <p className="text-gray-400 text-sm">Pontuação: {member.score}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;