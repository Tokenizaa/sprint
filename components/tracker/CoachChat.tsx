
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Bot, Send, Loader2, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { LOCAL_KNOWLEDGE_BASE, QUICK_ACTIONS } from '../../constants';

// --- RAG SEARCH ENGINE UTILITIES ---
const STOP_WORDS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das', 
  'em', 'no', 'na', 'nos', 'nas', 
  'por', 'pelo', 'pela', 'pelos', 'pelas', 'para', 'com', 'sem', 'e', 'ou', 'mas', 'que', 'se', 'como', 'quando', 
  'onde', 'quem', 'qual', 'quais', 'quanto', 'quantos', 'é', 'são', 'foi', 'foram', 'ser', 'estar', 'ter', 'haver',
  'eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'meu', 'teu', 'seu', 'nosso', 'vosso', 'isso', 'aquilo',
  'este', 'esta', 'esse', 'essa', 'aquele', 'aquela', 'muito', 'pouco', 'mais', 'menos', 'não', 'sim', 'então', 'logo'
]);

const stemWord = (word: string): string => {
  return word.toLowerCase()
    .replace(/(ar|er|ir|or)$/, '')
    .replace(/(s|es)$/, '')
    .replace(/(indo|endo|ando)$/, '')
    .replace(/(mente)$/, '')
    .replace(/(oso|osa)$/, '')
    .replace(/(a|o|e)$/, '');
};

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .map(stemWord);
};

interface KnowledgeChunk {
  title: string;
  content: string;
  tokens: string[];
  originalText: string;
}

// External RAG content (Simulated here, but would normally be imported)
const EXTERNAL_RAG_CONTENT = `
# ESTRATÉGIA SPRINT FINAL ALL-IN
## Meta Financeira
- **Meta Diária:** 3 pares de tênis vendidos.
- **Lucro Unitário:** R$ 244,50 por par.
- **Duração:** 14 dias (08/12 a 22/12).
- **Lucro Total Projetado:** R$ 10.269,00.
`; 

const processKnowledgeBase = (text: string): KnowledgeChunk[] => {
  const lines = text.split('\n');
  const chunks: KnowledgeChunk[] = [];
  let currentChunk: Partial<KnowledgeChunk> = { title: 'Geral', content: '', originalText: '' };
  
  lines.forEach(line => {
    if (line.startsWith('#')) {
      if (currentChunk.content && currentChunk.content.trim().length > 10) {
        chunks.push({
          title: currentChunk.title!,
          content: currentChunk.content.trim(),
          originalText: currentChunk.originalText!,
          tokens: tokenize(currentChunk.title + ' ' + currentChunk.content)
        });
      }
      const titleClean = line.replace(/^#+\s*/, '');
      currentChunk = {
        title: titleClean,
        content: '',
        originalText: line + '\n'
      };
    } else {
      currentChunk.content += line + '\n';
      currentChunk.originalText += line + '\n';
    }
  });

  if (currentChunk.content && currentChunk.content.trim().length > 0) {
     chunks.push({
        title: currentChunk.title!,
        content: currentChunk.content.trim(),
        originalText: currentChunk.originalText!,
        tokens: tokenize(currentChunk.title + ' ' + currentChunk.content)
     });
  }

  return chunks;
};

const combinedKnowledgeBase = LOCAL_KNOWLEDGE_BASE + "\n\n" + EXTERNAL_RAG_CONTENT;
const KNOWLEDGE_CHUNKS = processKnowledgeBase(combinedKnowledgeBase);

interface CoachChatProps {
  currentUser: User;
}

const CoachChat: React.FC<CoachChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'model' | 'system', text: string, isLocal?: boolean}[]>(() => {
    const savedMessages = localStorage.getItem(`chat_history_${currentUser.id}`);
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        return [{ role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sou seu Engenheiro de Vendas. O sistema está online e pronto para traçar sua estratégia.` }];
      }
    }
    return [{ role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sou seu Engenheiro de Vendas. O sistema está online e pronto para traçar sua estratégia.` }];
  });
  
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [usedQuickActions, setUsedQuickActions] = useState<Record<string, number>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`chat_history_${currentUser.id}`, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, currentUser.id]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getLocalResponse = (query: string): string => {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return "Por favor, faça uma pergunta mais específica sobre a estratégia de vendas.";

    const scoredChunks = KNOWLEDGE_CHUNKS.map(chunk => {
      let score = 0;
      let matchedTerms = 0;
      queryTokens.forEach(token => {
        const titleTokens = tokenize(chunk.title);
        if (titleTokens.includes(token)) { score += 10; matchedTerms++; }
        const contentMatchCount = (chunk.tokens.filter(t => t === token).length);
        if (contentMatchCount > 0) { score += (contentMatchCount * 2); matchedTerms++; }
      });
      return { ...chunk, score, matchedTerms };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    const bestMatch = scoredChunks[0];

    if (bestMatch.score > 0) {
       let response = `**${bestMatch.title.toUpperCase()}**\n\n`;
       const cleanContent = bestMatch.content.replace(/#{1,3}\s/g, '• ').replace(/\*\*/g, '').trim();
       return response + cleanContent + "\n\n(Fonte: Base de Conhecimento Interna)";
    }
    return "Não encontrei informações exatas sobre isso no manual 'Sprint Final'. Tente perguntar sobre: Metas, Abordagem Presencial, 4 Pilares ou Lucro.";
  };

  const processMessage = async (userMessage: string, predefinedAnswer?: string) => {
    if (predefinedAnswer) {
        setChatLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', text: predefinedAnswer, isLocal: true }]);
            setChatLoading(false);
        }, 600);
        return;
    }

    if (userMessage.trim().toLowerCase() === '/test') {
        runDiagnosticTest();
        return;
    }

    setChatLoading(true);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PLACEHOLDER_FOR_YOUR_API_KEY') {
      // Fallback imediato se não houver chave
      setTimeout(() => {
          const localAnswer = getLocalResponse(userMessage);
          setMessages(prev => [...prev, { role: 'model', text: localAnswer, isLocal: true }]);
          setChatLoading(false);
      }, 500);
      return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: "user",
                parts: [{ text: `Você é um Coach de Vendas especialista na campanha Sprint Final All-In. 
                Baseie-se nestes dados: ${LOCAL_KNOWLEDGE_BASE}.
                Usuário: ${currentUser.name}.
                Responda em TÓPICOS curtos.
                Use negrito para destacar valores e metas.
                Seja motivador estilo "treinador de elite".
                Pergunta do usuário: ${userMessage}` }]
            }],
        });        
        const text = response.text;
        if (!text) throw new Error("Empty response");
        setMessages(prev => [...prev, { role: 'model', text: text, isLocal: false }]);
    } catch (e) {
        console.warn("Switching to Local RAG due to API error");
        setTimeout(() => {
            const localAnswer = getLocalResponse(userMessage);
            setMessages(prev => [...prev, { role: 'model', text: localAnswer, isLocal: true }]);
            setChatLoading(false);
        }, 1000);
    } finally {
        if (process.env.GEMINI_API_KEY) setChatLoading(false);
    }
  };

  const runDiagnosticTest = () => {
      setMessages(prev => [...prev, { role: 'system', text: "🔄 INICIANDO DIAGNÓSTICO RAG LOCAL..." }]);
      const testQuestions = ["Qual é a meta de vendas?", "Quais são os 4 pilares?"];
      let delay = 0;
      testQuestions.forEach((q, i) => {
          delay += 1500;
          setTimeout(() => {
              const answer = getLocalResponse(q);
              setMessages(prev => [...prev, { role: 'user', text: `TESTE ${i+1}: ${q}` }, { role: 'model', text: answer, isLocal: true }]);
          }, delay);
      });
  };

  const handleQuickResponse = (action: typeof QUICK_ACTIONS[0]) => {
    const userMsg = action.question;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    const actionKey = action.label;
    const currentIndex = usedQuickActions[actionKey] || 0;
    
    const answerVariations: Record<string, string[]> = {
      '💰 Potencial de Lucro': [action.answer, 'O lucro total projetado é R$ 10.269,00. Foco total!'],
      '👟 Estratégia Presencial': [action.answer, 'Venda presencial é contato visual e produto na mão.'],
      '📅 Minha Rotina': [action.answer, 'Manhã: Rua. Tarde: WhatsApp. Noite: Digital.'],
      '🏛️ Os 4 Pilares': [action.answer, 'Ativação, Prospecção, Digital e Presencial.']
    };
    
    const variations = answerVariations[actionKey] || [action.answer];
    const nextIndex = currentIndex % variations.length;
    const selectedAnswer = variations[nextIndex];
    
    setUsedQuickActions(prev => ({ ...prev, [actionKey]: nextIndex + 1 }));
    processMessage(userMsg, selectedAnswer);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const text = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text }]);
      processMessage(text);
  };

  return (
    <div className="flex flex-col h-full w-full bg-race-carbon border border-white/10 rounded-3xl shadow-xl overflow-hidden animate-fade-in">
        {/* Chat Header */}
        <div className="bg-race-navy p-4 flex items-center gap-3 shadow-md z-10">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-race-yellow">
                <Bot size={24} />
            </div>
            <div>
                <h3 className="text-white font-bold">Engenheiro de Vendas</h3>
                <div className="flex items-center gap-2 text-xs text-race-yellow/80">
                    <span className="w-2 h-2 bg-race-green rounded-full animate-pulse"></span>
                    Canal Prioritário
                </div>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 min-h-0 custom-scrollbar">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                        max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col gap-1
                        ${msg.role === 'user' 
                            ? 'bg-race-navy text-white rounded-tr-none' 
                            : 'bg-black border border-white/10 rounded-tl-none'}
                    `}>
                        <div>
                        {msg.text.split('\n').map((line, idx) => (
                           <React.Fragment key={idx}>
                              {line.startsWith('**') ? 
                                <span className="font-bold block mt-2 text-race-yellow">{line.replace(/\*\*/g, '')}</span> : 
                                line.startsWith('•') ? 
                                <div className="flex gap-2 ml-2 mt-1"><span className="text-race-yellow font-bold">•</span><span>{line.substring(1)}</span></div> :
                                <span className="text-gray-300">{line}</span>
                              }
                              {!line.startsWith('•') && <br/>}
                           </React.Fragment>
                        ))}
                        </div>
                    </div>
                </div>
            ))}
            {chatLoading && (
                <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Loader2 className="animate-spin" size={14} />
                        Processando Estratégia...
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Actions & Input */}
        <div className="bg-black/50 border-t border-white/10">
            <div className="p-2 flex justify-end">
                <button 
                    onClick={() => {
                      if (window.confirm('Limpar histórico?')) {
                        setMessages([{ role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sistema reiniciado.` }]);
                      }
                    }}
                    className="text-xs text-gray-500 hover:text-race-yellow transition-colors px-2"
                >
                    Limpar
                </button>
            </div>
            
            <div className="px-2 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                {QUICK_ACTIONS.map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => handleQuickResponse(action)}
                        disabled={chatLoading}
                        className="bg-black border border-white/10 px-3 py-2 rounded-lg text-xs font-bold text-gray-400 whitespace-nowrap hover:border-race-yellow hover:text-white transition-colors shrink-0 shadow-sm"
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-4 flex gap-3">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pergunte sobre sua estratégia..."
                    className="flex-1 bg-black border border-white/10 focus:border-race-yellow focus:ring-0 focus:outline-none rounded-xl px-4 font-medium transition-all text-white placeholder-gray-700"
                    disabled={chatLoading}
                />
                <button 
                    type="submit" 
                    disabled={chatLoading || !input.trim()}
                    className="bg-race-yellow text-race-dark p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg"
                >
                    <Send size={20} strokeWidth={2.5} />
                </button>
            </form>
        </div>
    </div>
  );
};

export default CoachChat;
