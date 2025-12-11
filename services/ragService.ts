import { LOCAL_KNOWLEDGE_BASE } from '../constants';
import { Dispatch, SetStateAction } from 'react';
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
  // Very basic Portuguese stemmer (suffix removal)
  return word.toLowerCase()
    .replace(/(ar|er|ir|or)$/, '') // verbs infinitive
    .replace(/(s|es)$/, '') // plurals
    .replace(/(indo|endo|ando)$/, '') // gerund
    .replace(/(mente)$/, '') // adverbs
    .replace(/(oso|osa)$/, '') // adjectives
    .replace(/(a|o|e)$/, ''); // gender/theme vowel
};

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w)) // Filter stop words and short words
    .map(stemWord);
};

interface KnowledgeChunk {
  title: string;
  content: string;
  tokens: string[];
  originalText: string;
}

// Pre-process knowledge base into chunks based on Headers
const processKnowledgeBase = (text: string): KnowledgeChunk[] => {
  const lines = text.split('\n');
  const chunks: KnowledgeChunk[] = [];
  let currentChunk: Partial<KnowledgeChunk> = { title: 'Geral', content: '', originalText: '' };
  
  lines.forEach(line => {
    if (line.startsWith('#')) {
      // Save previous chunk if it has content
      if (currentChunk.content && currentChunk.content.trim().length > 10) {
        chunks.push({
          title: currentChunk.title!,
          content: currentChunk.content.trim(),
          originalText: currentChunk.originalText!,
          tokens: tokenize(currentChunk.title + ' ' + currentChunk.content)
        });
      }
      // Start new chunk
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

  // Push last chunk
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

// Initialize knowledge base with local RAG content
const KNOWLEDGE_CHUNKS = processKnowledgeBase(LOCAL_KNOWLEDGE_BASE);

// --- LOCAL RAG ALGORITHM ---
export const getLocalResponse = (query: string): string => {
  const queryTokens = tokenize(query);
  
  if (queryTokens.length === 0) {
    return "Por favor, faça uma pergunta mais específica sobre a estratégia de vendas.";
  }

  // Score chunks
  const scoredChunks = KNOWLEDGE_CHUNKS.map(chunk => {
    let score = 0;
    let matchedTerms = 0;

    queryTokens.forEach(token => {
      // TF-IDF simplified logic
      
      // 1. Check in Title (Higher weight)
      const titleTokens = tokenize(chunk.title);
      if (titleTokens.includes(token)) {
          score += 10;
          matchedTerms++;
      }

      // 2. Check in Content
      const contentMatchCount = (chunk.tokens.filter(t => t === token).length);
      if (contentMatchCount > 0) {
          score += (contentMatchCount * 2);
          matchedTerms++;
      }
    });

    return { ...chunk, score, matchedTerms };
  });

  // Sort by score
  scoredChunks.sort((a, b) => b.score - a.score);

  const bestMatch = scoredChunks[0];

  if (bestMatch.score > 0) {
     // Format the response nicely
     let response = `**${bestMatch.title.toUpperCase()}**\n\n`;
     
     // Clean markdown headers from content for better reading
     const cleanContent = bestMatch.content
       .replace(/#{1,3}\s/g, '• ') // Replace headers with bullets
       .replace(/\*\*/g, '') // Remove bold markers for cleaner text (optional)
       .trim();

     return response + cleanContent + "\n\n(Fonte: Base de Conhecimento Interna)";
  }

  return "Não encontrei informações exatas sobre isso no manual 'Sprint Final'. Tente perguntar sobre: Metas, Abordagem Presencial, 4 Pilares ou Lucro.";
};

export const runDiagnosticTest = (setMessages: Dispatch<SetStateAction<{role: 'user' | 'model' | 'system', text: string, isLocal?: boolean}[]>>) => {
  setMessages(prev => [...prev, { role: 'system', text: "🔄 INICIANDO DIAGNÓSTICO RAG LOCAL..." }]);
  
  const testQuestions = [
      "Qual é a meta de vendas?",
      "Como funciona a venda presencial?",
      "Quais são os 4 pilares?",
      "O que falar se o cliente achar caro?",
      "Qual o lucro total?",
      "Como prospectar novos clientes?",
      "O que postar no instagram?",
      "Como abordar cliente antigo?",
      "Rotina da manhã",
      "Rotina da noite"
  ];

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
};
