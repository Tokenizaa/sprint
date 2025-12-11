import React, { useState } from 'react';

const ExternalApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleSyncData = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Try calling server endpoint; admin must provide API key via localStorage
      const key = localStorage.getItem('admin_api_key') || '';
      const resp = await fetch('/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': key } });
      const data = await resp.json();
      setResult(data.message || data.error || JSON.stringify(data));
    } catch (error) {
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Teste de Integração com API Externa</h2>
      
      <div className="mb-6">
        <button 
          onClick={handleSyncData}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Sincronizando...' : 'Sincronizar Dados Externos'}
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <p className={`font-medium ${result.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {result}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Instruções:</strong> Este componente testa a integração com a API externa da All-In Brasil.
              Ele obtém um token de acesso e busca dados de distribuidores e pedidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalApiTest;