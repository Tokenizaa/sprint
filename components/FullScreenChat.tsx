import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Bot, Send, Loader2, Copy, Mic, Volume2, History, ChevronRight, Star, Zap, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { User } from '../types';
import { getLocalResponse, runDiagnosticTest } from '../services/ragService';
import { GoogleGenAI } from "@google/genai";
import { LOCAL_KNOWLEDGE_BASE, QUICK_ACTIONS } from '../constants';


interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  isLocal?: boolean;
}

interface ChatProps {
  currentUser: User;
}

const FullScreenChat: React.FC<ChatProps> = React.memo(({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem(`chat_history_${currentUser.id}`);
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        console.error("Failed to parse chat history", e);
        return [{ role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sou seu Engenheiro de Vendas. O sistema está online e pronto para traçar sua estratégia.` }];
      }
    }
    return [{ role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sou seu Engenheiro de Vendas. O sistema está online e pronto para traçar sua estratégia.` }];
  });
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [usedQuickActions, setUsedQuickActions] = useState<Record<string, number>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedMessages, setCopiedMessages] = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(`chat_history_${currentUser.id}`, JSON.stringify(messages));
  }, [messages, currentUser.id]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'pt-BR';
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setListening(false);
        };
        recognitionRef.current.onerror = () => {
          setListening(false);
        };
        recognitionRef.current.onend = () => {
          setListening(false);
        };
      }
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMessages(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopiedMessages(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const loadConversation = (conversation: ChatMessage[]) => {
    setMessages(conversation);
    setSidebarOpen(false);
  };

  const getConversations = (): ChatMessage[][] => {
    const conversations: ChatMessage[][] = [];
    const allMessages = messages;
    
    // Group messages into conversations based on user messages
    let currentConversation: ChatMessage[] = [];
    allMessages.forEach(msg => {
      if (msg.role === 'user') {
        if (currentConversation.length > 0) {
          conversations.push([...currentConversation]);
        }
        currentConversation = [msg];
      } else {
        currentConversation.push(msg);
      }
    });
    
    if (currentConversation.length > 0) {
      conversations.push(currentConversation);
    }
    
    return conversations;
  };

  // Memoize quick actions variations
  const answerVariations = useMemo(() => ({
    '💰 Potencial de Lucro': [
      'Se você seguir o plano de 3 pares/dia por 14 dias, seu lucro total será de **R$ 10.269,00** (baseado em R$ 244,50 de lucro por par).',
      'Com consistência na execução, você pode faturar **R$ 10.269,00** em apenas 14 dias. O segredo está na disciplina diária!',
      'Imagine só: **R$ 10.269,00** no bolso ao final dessa campanha. É isso que você pode conquistar com 3 pares vendidos por dia.'
    ],
    '👟 Estratégia Presencial': [
      'O segredo é a PROVA. Saia com o tênis. Aborde: "Posso te mostrar por que esse tênis virou febre? Só 10 segundos no pé". Quando o cliente sente o conforto, a venda fecha.',
      'Na venda presencial, a prova é tudo! Vista o tênis e mostre: "Testa 10 segundos". O conforto imediato convence mais que mil palavras.',
      'A venda presencial é poderosa! Com o tênis na mão: "Experimenta rapidinho". O cliente sente o conforto e fecha a compra.'
    ],
    '📅 Minha Rotina': [
      '**Manhã:** Venda Presencial (Rua/Visitas).\n**Tarde:** Ativação de clientes antigos (WhatsApp).\n**Noite:** Digital (Stories e novos contatos).',
      'Sua rotina de sucesso:\n🌅 **Manhã:** Venda presencial\n☀️ **Tarde:** Ativação de contatos\n🌇 **Noite:** Marketing digital'
      ,'Organize seu dia assim:\n- Manhã: Saia com o tênis e venda presencial\n- Tarde: Contate clientes antigos\n- Noite: Poste nas redes sociais'
    ],
    '🏛️ Os 4 Pilares': [
      '1. Ativação (Clientes Antigos)\n2. Prospecção (Novos)\n3. Rotina Digital\n4. Venda Presencial (O mais forte!).',
      'Os 4 pilares que garantem seu sucesso:\n1. Reative clientes antigos\n2. Prospere novos contatos\n3. Mantenha presença digital\n4. Venda diretamente na rua',
      'Estratégia vencedora:\n🔹 Ativação de carteira\n🔹 Prospecção ativa\n🔹 Presença digital\n🔹 Venda presencial'
    ]
  }), []);

  // --- MESSAGE PROCESSING ---
  const processMessage = useCallback(async (userMessage: string, predefinedAnswer?: string) => {
    
    // 1. Handle Quick Actions (Predefined)
    if (predefinedAnswer) {
        setChatLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', text: predefinedAnswer, isLocal: true }]);
            setChatLoading(false);
        }, 600);
        return;
    }

    // 2. Handle /test command (Diagnostic)
    if (userMessage.trim().toLowerCase() === '/test') {
        runDiagnosticTest(setMessages);
        return;
    }

    setChatLoading(true);

    // Check if Gemini API key is available (using process.env.API_KEY as per guidelines)
    const geminiApiKey = process.env.API_KEY;
    if (!geminiApiKey || geminiApiKey === 'PLACEHOLDER_FOR_YOUR_API_KEY') {
      const errorMessage = "🔴 Conexão com Gemini Falhou: A Chave da API não foi configurada corretamente. O modo de IA avançado está desabilitado. Por favor, insira uma chave válida no arquivo '.env' e reinicie o servidor de desenvolvimento para obter a funcionalidade completa.";
      setMessages(prev => [...prev, { role: 'model', text: errorMessage, isLocal: true }]);
      setChatLoading(false);
      console.error(errorMessage);
      return;
    }

    // 3. Try Gemini API
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: "user",
                parts: [{ text: `Você é um Coach de Vendas especialista na campanha Sprint Final All-In. 
                Baseie-se nestes dados: ${LOCAL_KNOWLEDGE_BASE}.
                Usuário: ${currentUser.name}.
                Responda em TÓPICOS curtos (bullet points).
                Use negrito para destacar valores e metas.
                Seja motivador estilo "treinador de elite".

                Pergunta do usuário: ${userMessage}` }]
            }],
        });        
        const text = response.text;
        if (!text) throw new Error("Empty response");
        
        setMessages(prev => [...prev, { role: 'model', text: text, isLocal: false }]);

    } catch (e) {
        // 4. Fallback to Local RAG
        console.warn("Switching to Local RAG due to:", e);
        
        // Simulate "thinking" delay for realism
        setTimeout(() => {
            const localAnswer = getLocalResponse(userMessage);
            setMessages(prev => [...prev, { role: 'model', text: localAnswer, isLocal: true }]);
            setChatLoading(false);
        }, 1000);
        return; // Return early so we don't clear loading twice
    } finally {
        setChatLoading(false);
    }
  }, [currentUser.name]);

  const handleQuickResponse = useCallback((action: typeof QUICK_ACTIONS[0]) => {
    const userMsg = action.question;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    // Implement alternating responses
    const actionKey = action.label;
    const currentIndex = usedQuickActions[actionKey] || 0;
    
    // Get response variation
    const variations = answerVariations[actionKey as keyof typeof answerVariations] || [action.answer];
    const nextIndex = currentIndex % variations.length;
    const selectedAnswer = variations[nextIndex];
    
    // Update usage counter
    setUsedQuickActions(prev => ({
      ...prev,
      [actionKey]: nextIndex + 1
    }));
    
    processMessage(userMsg, selectedAnswer);
  }, [answerVariations, processMessage, usedQuickActions]);

  const handleChatSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      const text = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text }]);
      processMessage(text);
  }, [input, processMessage]);

  // Memoize test questions
  const testQuestions = useMemo(() => [
    "Qual é a meta de vendas?",
    "Como funciona a venda presencial?",
    "Quais são os 4 pilares?",
    "O que falar se o cliente achar caro?",
    "Qual o lucro total?",
    "Como prospectar novos clientes?",
    "O que postar no Instagram?",
    "Como abordar cliente antigo?",
    "Rotina da manhã",
    "Rotina da noite"
  ], []);

  const runDiagnosticTestMemo = useCallback(() => {
    setMessages(prev => [...prev, { role: 'system', text: "🔄 INICIANDO DIAGNÓSTICO RAG LOCAL..." }]);
    
    let delay = 0;
    testQuestions.forEach((q, i) => {
        delay += 1500;
        setTimeout(() => {
            const answer = getLocalResponse(q);
            setMessages(prev => [
                ...prev, 
                { role: 'user', text: `TESTE ${i+1}: ${q}` },
                { role: 'model', text: answer, isLocal: true }
            ]);
        }, delay);
    });
  }, [testQuestions]);

  return (
    <div className="flex h-screen w-full bg-race-carbon">
      {/* Sidebar */}
      <div className={`md:flex flex-col z-20 h-full bg-race-navy border-r border-white/10 transition-all duration-300 ${sidebarOpen ? 'absolute md:relative w-64' : 'hidden md:flex md:w-64'} overflow-hidden`}>        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <History size={20} />
              Histórico
            </h3>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {getConversations().map((conversation, idx) => {
              const firstUserMessage = conversation.find(msg => msg.role === 'user');
              return (
                <div 
                  key={idx}
                  onClick={() => loadConversation(conversation)}
                  className="p-3 mb-2 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition-colors"
                >
                  <div className="text-xs text-gray-400 truncate">
                    {firstUserMessage ? firstUserMessage.text.substring(0, 30) + '...' : 'Conversa ' + (idx + 1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {conversation.length} mensagens
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">        {/* Chat Header */}
        <div className="bg-race-navy p-4 flex items-center gap-3 shadow-md z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white mr-2"
          >
            <History size={20} />
          </button>
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

        {/* Messages Area - Full Width */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/50 min-h-0 custom-scrollbar w-full">          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`
                max-w-4xl w-full p-4 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col gap-2 transition-all duration-300 hover:shadow-md
                ${msg.role === 'user' 
                  ? 'bg-race-navy text-white rounded-tr-none [&_*]:text-white' 
                  : 'bg-black border border-white/10 rounded-tl-none [&_*]:text-race-silver'}
              `}>
                <div>
                  {msg.text.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {/* Enhanced Markdown-like rendering with icons */}
                      {line.startsWith('**') ? 
                        <span className="font-bold block mt-2 text-race-yellow flex items-center gap-2 animate-pulse">
                          <Zap size={16} className="text-race-yellow" />
                          {line.replace(/\*\*/g, '')}
                        </span> : 
                        line.startsWith('•') ? 
                        <div className="flex gap-2 ml-2 mt-1 items-start">
                          <Star size={14} className="text-race-yellow mt-1 flex-shrink-0" />
                          <span className="text-white">{line.substring(1)}</span>
                        </div> :
                        <span className="text-gray-300">{line}</span>
                      }
                      {!line.startsWith('•') && line.trim() !== '' && <br/>}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Action buttons for model messages */}
                {msg.role !== 'user' && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-white/10">
                    <button 
                      onClick={() => copyMessage(msg.text, i)}
                      className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      title="Copiar mensagem"
                    >
                      {copiedMessages[i] ? '✓ Copiado' : <><Copy size={14} /> Copiar</>}
                    </button>
                    <button 
                      onClick={() => speakMessage(msg.text)}
                      className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      title="Ouvir mensagem"
                    >
                      <Volume2 size={14} /> Ouvir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Suggestions after each response */}
          {messages.length > 0 && messages[messages.length - 1].role !== 'user' && (
            <div className="p-4 bg-race-navy/50 rounded-2xl border border-white/10 max-w-4xl w-full">
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <MessageCircle size={16} className="text-race-yellow" />
                Continue a conversa:
              </h4>
              <div className="flex flex-wrap gap-2">
                {[ 
                  "Como posso aumentar minhas vendas?",
                  "Qual é a minha meta diária?",
                  "Como prospectar novos clientes?",
                  "O que postar no Instagram?"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }, 100);
                    }}
                    className="text-xs bg-black/50 border border-white/10 px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:border-race-yellow transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <ChevronRight size={12} />
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
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

        {/* Clear History Button */}
        <div className="p-2 bg-black/50">
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar o histórico do chat?')) {
                const initialMessage: ChatMessage = { role: 'model', text: `🟢 Rádio Box: Olá ${currentUser.name}! Sou seu Engenheiro de Vendas. O sistema está online e pronto para traçar sua estratégia.` };
                setMessages([initialMessage]);
                setUsedQuickActions({});
              }
            }}
            className="text-xs text-gray-500 hover:text-race-yellow transition-colors px-2 py-1"
          >
            Limpar Histórico
          </button>
        </div>
        
        {/* Input Area with Voice */}
        <form onSubmit={handleChatSubmit} className="p-4 bg-black/50 border-t border-white/10 flex gap-2">
          <button 
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all ${listening ? 'bg-red-500 text-white' : 'bg-black border border-white/10 text-gray-400 hover:text-white'}`}
            title={listening ? "Parar gravação" : "Falar mensagem"}
          >
            <Mic size={20} />
          </button>
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
});

export default FullScreenChat;