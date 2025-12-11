import React, { useState, useEffect } from 'react';
import { Flag, User as UserIcon, Lock, Loader2, AlertTriangle, Phone, ArrowRight } from 'lucide-react';
import { authenticateUser, registerUser, initSupabase } from '../services/storageService';
import { User } from '../types';
import { validatePhoneNumber, validatePassword, validateName } from '../utils/securityUtils';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // DB Connection is initialized in index.tsx
  // This useEffect is kept empty for future use if needed
  useEffect(() => {
    // Initialization logic moved to index.tsx for better app-wide consistency
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (!whatsapp.trim() || !password.trim()) {
            setError('Preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        // Validate phone number
        if (!validatePhoneNumber(whatsapp)) {
            setError('Número de telefone inválido. Use o formato: 11999999999');
            setLoading(false);
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setLoading(false);
            return;
        }

        if (isRegistering) {
            // REGISTER FLOW
            if (!name.trim()) {
                setError('Nome é obrigatório para cadastro.');
                setLoading(false);
                return;
            }

            // Validate name
            const nameValidation = validateName(name);
            if (!nameValidation.isValid) {
                setError(nameValidation.message);
                setLoading(false);
                return;
            }

            const result = await registerUser(name, whatsapp, password);
            if (result.success && result.user) {
                onLogin(result.user);
            } else {
                setError(result.error || 'Erro ao cadastrar. Verifique se o número já existe.');
            }
        } else {
            // LOGIN FLOW
            const result = await authenticateUser(whatsapp, password);
            if (result.success && result.user) {
                onLogin(result.user);
            } else {
                setError(result.error || 'Credenciais inválidas. Verifique WhatsApp e senha.');
            }
        }

    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro inesperado de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-race-dark relative overflow-hidden py-12 px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-carbon-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-speed-lines opacity-10 pointer-events-none"></div>
      
      {/* Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-race-yellow opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Card - Removed Skew for Better Alignment */}
      <div className="w-full max-w-md bg-race-carbon border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 animate-slide-up backdrop-blur-xl rounded-2xl">
            
            {/* Top Border Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-race-yellow shadow-[0_0_15px_#FAFF00]"></div>
            
            <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-16 h-16 bg-race-yellow text-race-dark rounded-xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(244,255,0,0.2)]">
                    <Flag size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter italic">
                    Sprint Final <span className="text-race-yellow">All-In</span>
                </h1>
                <p className="text-gray-500 text-[10px] mt-2 font-bold tracking-[0.3em] uppercase">
                    {isRegistering ? 'Cadastro de Piloto' : 'Acesso ao Grid'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 w-full">
            
            {isRegistering && (
                <div className="animate-fade-in">
                    <label className="block text-[10px] font-bold text-race-yellow uppercase tracking-widest mb-2 font-display">Nome Completo</label>
                    <div className="relative group">
                    <UserIcon size={16} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-race-yellow transition-colors" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full pl-10 p-3 bg-black/50 border border-white/10 rounded-lg focus:border-race-yellow focus:ring-0 focus:outline-none font-bold text-white placeholder-gray-700 transition-all font-display uppercase italic text-sm"
                        disabled={loading}
                    />
                    </div>
                </div>
            )}
                
            <div>
                <label className="block text-[10px] font-bold text-race-yellow uppercase tracking-widest mb-2 font-display">WhatsApp (ID)</label>
                <div className="relative group">
                <Phone size={16} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-race-yellow transition-colors" />
                <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="11999999999"
                    className="w-full pl-10 p-3 bg-black/50 border border-white/10 rounded-lg focus:border-race-yellow focus:ring-0 focus:outline-none font-bold text-white placeholder-gray-700 transition-all font-display italic text-sm"
                    disabled={loading}
                />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-race-yellow uppercase tracking-widest mb-2 font-display">Senha de Acesso</label>
                <div className="relative group">
                <Lock size={16} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-race-yellow transition-colors" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 p-3 bg-black/50 border border-white/10 rounded-lg focus:border-race-yellow focus:ring-0 focus:outline-none font-bold text-white placeholder-gray-700 text-sm"
                    disabled={loading}
                />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[10px] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wide text-center">
                    <AlertTriangle size={14} className="shrink-0"/> <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-race-yellow text-race-dark font-display font-black text-lg py-4 hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(244,255,0,0.3)] flex items-center justify-center gap-2 mt-4 group disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-widest rounded-lg"
            >
                {loading ? (
                <Loader2 className="animate-spin" size={20} />
                ) : (
                <span className="flex items-center gap-2">
                    {isRegistering ? 'CONFIRMAR CADASTRO' : 'ACESSAR PAINEL'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                )}
            </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-wider transition-colors border-b border-transparent hover:border-race-yellow pb-1"
                >
                    {isRegistering ? 'Já tem uma conta? Entrar' : 'Novo Piloto? Criar Conta'}
                </button>
            </div>
      </div>
    </div>
  );
};

export default Login;