import React, { useState, useCallback } from 'react';
import { DailyLog } from '../../types';

interface EntryFormProps {
  currentUser: {
    id: string;
  };
  onSave: (log: DailyLog) => void;
  notification: string;
}

const EntryForm: React.FC<EntryFormProps> = React.memo(({ currentUser, onSave, notification }) => {
  const [pairs, setPairs] = useState('');
  const [prospects, setProspects] = useState('');
  const [activations, setActivations] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar entradas
    if (pairs && (Number(pairs) < 0 || Number(pairs) > 100)) {
      alert("Número de pares vendidos deve estar entre 0 e 100");
      return;
    }
    
    if (prospects && (Number(prospects) < 0 || Number(prospects) > 1000)) {
      alert("Número de prospects deve estar entre 0 e 1000");
      return;
    }
    
    if (activations && (Number(activations) < 0 || Number(activations) > 100)) {
      alert("Número de ativações deve estar entre 0 e 100");
      return;
    }
    
    const newLog: DailyLog = {
      id: `temp-${Date.now()}`,
      userId: currentUser.id,
      date: new Date().toLocaleDateString('pt-BR'),
      pairsSold: Number(pairs) || 0,
      prospectsContacted: Number(prospects) || 0,
      activations: Number(activations) || 0,
      type: 'mixed'
    };

    // Note: Do NOT call syncExternalData() here directly in client.
    // It requires server-side secrets. 
    // If needed, call an API endpoint: await fetch('/api/sync', ...)

    onSave(newLog);
    
    setPairs('');
    setProspects('');
    setActivations('');
  }, [currentUser.id, onSave, pairs, prospects, activations]);

  return (
    <div className="animate-fade-in">
       <div className="bg-race-carbon border border-white/10 p-8 rounded-3xl shadow-xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-race-yellow to-race-green"></div>
         <h2 className="text-2xl font-black text-white mb-8 text-center uppercase italic tracking-tight">Registro Diário</h2>
         
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pares Vendidos</label>
                   <input type="number" min="0" value={pairs} onChange={e => setPairs(e.target.value)} className="w-full p-4 bg-black border border-white/10 focus:border-race-yellow focus:ring-0 focus:outline-none font-display font-bold text-2xl text-white transition-all rounded-xl" placeholder="0" required />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">Novos Contatos</label>
                   <input type="number" min="0" value={prospects} onChange={e => setProspects(e.target.value)} className="w-full p-4 bg-black border border-white/10 focus:border-race-yellow focus:ring-0 focus:outline-none font-display font-bold text-2xl text-white transition-all rounded-xl" placeholder="0" required />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">Ativações</label>
                   <input type="number" min="0" value={activations} onChange={e => setActivations(e.target.value)} className="w-full p-4 bg-black border border-white/10 focus:border-race-yellow focus:ring-0 focus:outline-none font-display font-bold text-2xl text-white transition-all rounded-xl" placeholder="0" required />
                </div>
            </div>

            <button type="submit" className="w-full py-5 bg-race-yellow text-race-dark font-black text-xl uppercase italic tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-xl">
              Salvar Telemetria
            </button>
         </form>
       </div>
    </div>
  );
});

export default EntryForm;