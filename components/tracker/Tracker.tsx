
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, PlusCircle, Gauge, Calculator, Bot 
} from 'lucide-react';
import { getLogs, saveLog, getLeaderboard } from '../../services/storageService';
import { DailyLog, TeamMember, User } from '../../types';
import Dashboard from './Dashboard';
import EntryForm from './EntryForm';
import CoachChat from './CoachChat';
import EarningsCalculator from '../Calculator';

interface TrackerProps {
  currentUser: User;
}

const Tracker: React.FC<TrackerProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'coach' | 'calculator'>('dashboard');
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  const isAdmin = currentUser.role === 'admin';

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const userLogsResult = await getLogs(currentUser.id);
        if (userLogsResult.success && Array.isArray(userLogsResult.data)) {
          setLogs(userLogsResult.data);
        } else {
          setLogs([]); 
        }

        const leaderboardResult = await getLeaderboard(currentUser.id);
        if (leaderboardResult.success && Array.isArray(leaderboardResult.data)) {
          setTeam(leaderboardResult.data);
        } else {
          setTeam([]);
        }
    } catch (e) {
        console.error("Critical error fetching data", e);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveLog = async (newLog: DailyLog) => {
    setLogs(prev => [...prev, newLog]);
    const result = await saveLog(newLog);
    
    if (result.success) {
        setNotification('🏁 Registro salvo! Telemetria atualizada.');
        setTimeout(() => setNotification(''), 3000);
        setActiveTab('dashboard');
        fetchData();
    } else {
        setNotification('❌ Erro ao salvar: ' + result.error);
        setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Tab Navigation */}
      <div className="bg-race-navy sticky top-0 z-30 shadow-sm border-b border-white/10 px-4 pt-4">
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-race-navy text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
           >
             <Gauge size={18} /> Painel
           </button>
           <button 
             onClick={() => setActiveTab('entry')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'entry' ? 'bg-race-yellow text-race-dark shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
           >
             <PlusCircle size={18} /> Registrar
           </button>
           <button 
             onClick={() => setActiveTab('coach')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'coach' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
           >
             <Bot size={18} /> Coach AI
           </button>
           <button 
             onClick={() => setActiveTab('calculator')}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'calculator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
           >
             <Calculator size={18} /> Simulador
           </button>
           {isAdmin && (
             <span className="px-3 py-2 text-xs font-bold text-race-yellow bg-race-yellow/20 rounded border border-race-yellow/50 uppercase tracking-wider ml-auto">
               Admin Mode
             </span>
           )}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar w-full">
        <div className="max-w-4xl mx-auto space-y-6 h-full pb-20">
          
          {/* Notification Toast */}
          {notification && (
            <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center justify-center font-bold animate-slide-up fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
               <CheckCircle size={24} className="mr-3" />
               {notification}
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
             <Dashboard logs={logs} team={team} isAdmin={isAdmin} />
          )}

          {/* ENTRY TAB */}
          {activeTab === 'entry' && (
            <EntryForm currentUser={currentUser} onSave={handleSaveLog} notification={notification} />
          )}

          {/* CALCULATOR TAB */}
          {activeTab === 'calculator' && (
              <div className="animate-fade-in">
                  <EarningsCalculator />
              </div>
          )}

          {/* COACH TAB */}
          {activeTab === 'coach' && (
            <CoachChat currentUser={currentUser} />
          )}

        </div>
      </div>
    </div>
  );
};

export default Tracker;
