
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyLog, TeamMember } from '../../types';
import AdminPanel from '../AdminPanel';

interface DashboardProps {
  logs: DailyLog[];
  team: TeamMember[];
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = React.memo(({ logs, team, isAdmin }) => {
  // --- RENDER HELPERS ---
  const totalSales = useMemo(() => {
    if (!Array.isArray(logs)) return 0;
    return logs.reduce((acc, log) => acc + (log.pairsSold || 0), 0);
  }, [logs]);

  const totalPotential = useMemo(() => {
    return totalSales * 244.50;
  }, [totalSales]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    if (!Array.isArray(logs) || logs.length === 0) return [];
    return logs.slice(-7).map(log => ({
      name: log.date ? log.date.split('/')[0] + '/' + log.date.split('/')[1] : '',
      vendas: log.pairsSold || 0
    }));
  }, [logs]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin View */}
      {isAdmin && <AdminPanel />}
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-race-carbon border border-white/10 p-5 rounded-2xl shadow-sm">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Vendas Totais</div>
          <div className="text-3xl font-black text-race-yellow">{totalSales} <span className="text-sm text-gray-400 font-normal">pares</span></div>
        </div>
        <div className="bg-race-carbon border border-white/10 p-5 rounded-2xl shadow-sm">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Lucro Estimado</div>
          <div className="text-3xl font-black text-emerald-600">R$ {totalPotential.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-race-carbon border border-white/10 p-6 rounded-3xl shadow-sm">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-race-yellow" /> Desempenho Diário</h3>
        {chartData.length > 0 ? (
          <div className="w-full h-[300px] min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#0A0F1C', color: '#fff'}}
                    cursor={{fill: '#1a202c'}}
                />
                <Bar dataKey="vendas" fill="#FAFF00" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
            Nenhum dado disponível para exibir no gráfico
          </div>
        )}
      </div>
    </div>
  );
});

export default Dashboard;
