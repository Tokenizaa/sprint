import React, { useState, useEffect } from 'react';
import { Calculator, Calendar, DollarSign, Target } from 'lucide-react';
import { CAMPAIGN_START, CAMPAIGN_END } from '../constants';

const EarningsCalculator: React.FC = () => {
  const [pairsPerDay, setPairsPerDay] = useState(3);
  const [profitPerPair, setProfitPerPair] = useState(244.50);
  const [totalDays, setTotalDays] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const start = CAMPAIGN_START; 
    const diffTime = Math.abs(CAMPAIGN_END.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setTotalDays(days || 14); // Default to 14 if calc fails
  }, []);

  useEffect(() => {
    setTotalProfit(pairsPerDay * profitPerPair * (totalDays || 14));
  }, [pairsPerDay, profitPerPair, totalDays]);

  return (
    <div className="bg-race-carbon border border-white/10 p-6 shadow-2xl relative overflow-hidden group rounded-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-race-yellow to-race-green"></div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 skew-x-[-10deg] translate-x-10 -translate-y-10"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8 text-white font-display font-black text-2xl uppercase tracking-wider italic">
          <Calculator className="w-8 h-8 text-race-yellow" />
          Simulador de Estratégia
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold text-race-yellow uppercase tracking-widest mb-2 flex items-center gap-2">
                <Target size={14} /> Meta de Pares / Dia
              </label>
              <input
                type="number"
                value={pairsPerDay}
                onChange={(e) => setPairsPerDay(Number(e.target.value))}
                className="w-full p-4 bg-black border border-white/10 focus:border-race-yellow focus:ring-0 focus:outline-none font-display font-bold text-3xl text-white transition-all rounded-lg"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-race-green uppercase tracking-widest mb-2 flex items-center gap-2">
                <DollarSign size={14} /> Lucro Médio / Par (R$)
              </label>
              <input
                type="number"
                value={profitPerPair}
                onChange={(e) => setProfitPerPair(Number(e.target.value))}
                className="w-full p-4 bg-black border border-white/10 focus:border-race-green focus:ring-0 focus:outline-none font-display font-bold text-3xl text-white transition-all rounded-lg"
              />
            </div>
          </div>

          <div className="bg-black/50 border border-white/5 p-6 flex flex-col justify-center items-center relative overflow-hidden group rounded-xl">
            <div className="absolute inset-0 bg-carbon-pattern opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-race-yellow opacity-5 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                <Calendar className="w-4 h-4" />
                <span>Resultado em {totalDays || 14} Dias</span>
              </div>

              <div className="text-4xl md:text-5xl font-display font-black text-race-yellow flex items-center italic tracking-tighter drop-shadow-[0_0_15px_rgba(250,255,0,0.3)]">
                <span className="text-2xl mr-1 text-white/30 not-italic">R$</span>
                {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-bold mt-4 uppercase tracking-[0.2em] text-gray-400">Potencial Total no Bolso</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;