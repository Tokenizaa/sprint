import { SlideData } from './types';

export const SLIDES: SlideData[] = [
  {
    id: 1,
    layout: 'cover',
    title: 'SPRINT',
    subtitle: 'Telemetria de Vendas v2.5',
    points: []
  },
  {
    id: 2,
    layout: 'standard',
    title: 'OBJETIVO',
    subtitle: 'Transformar Dados em Vitórias',
    points: [
      {
        title: 'VISÃO EM TEMPO REAL',
        description: 'Acompanhe vendas oficiais e auto-reportadas em um único painel',
        highlight: true
      },
      {
        title: 'MÉTRICAS DE DESEMPENHO',
        description: 'Compare seu desempenho com o restante da equipe'
      },
      {
        title: 'CALCULADORA DE POTENCIAL',
        description: 'Projete seu faturamento restante com base no histórico'
      }
    ]
  },
  {
    id: 3,
    layout: 'columns',
    title: 'MÉTRICAS CHAVE',
    points: [
      {
        title: 'VENDAS OFICIAIS',
        description: 'Dados confirmados pelo administrador do sistema'
      },
      {
        title: 'AUTO-REPORTADAS',
        description: 'Dados inseridos diariamente pelos distribuidores'
      },
      {
        title: 'PROSPECTS',
        description: 'Contatos qualificados registrados na plataforma'
      },
      {
        title: 'ATIVAÇÕES',
        description: 'Novos clientes convertidos em compradores ativos'
      }
    ]
  },
  {
    id: 4,
    layout: 'standard',
    title: 'COMO FUNCIONA',
    points: [
      {
        title: 'CADASTRO DIÁRIO',
        description: 'Registre suas vendas auto-reportadas e atividades diárias',
        highlight: true
      },
      {
        title: 'SINCRONIZAÇÃO',
        description: 'O sistema cruza dados oficiais com auto-reportados'
      },
      {
        title: 'ANÁLISE',
        description: 'Algoritmos calculam desempenho e potencial restante'
      },
      {
        title: 'AÇÃO',
        description: 'Identifique gaps e otimize sua estratégia de vendas'
      }
    ]
  },
  {
    id: 5,
    layout: 'conclusion',
    title: 'PRONTO?',
    subtitle: 'Entre e assuma o controle da sua performance',
    points: []
  }
];

export const CAMPAIGN_START = new Date('2025-12-08T00:00:00');
export const CAMPAIGN_END = new Date('2025-12-22T23:59:59');

export const QUICK_ACTIONS = [
    { label: '💰 Potencial de Lucro', question: 'Qual é o meu potencial de lucro?', answer: 'Se você seguir o plano de 3 pares/dia por 14 dias, seu lucro total será de **R$ 10.269,00** (baseado em R$ 244,50 de lucro por par).' },
    { label: '👟 Estratégia Presencial', question: 'Como vender presencialmente?', answer: 'O segredo é a PROVA. Saia com o tênis. Aborde: "Posso te mostrar por que esse tênis virou febre? Só 10 segundos no pé". Quando o cliente sente o conforto, a venda fecha.' },
    { label: '📅 Minha Rotina', question: 'Qual deve ser minha rotina?', answer: '**Manhã:** Venda Presencial (Rua/Visitas).\n**Tarde:** Ativação de clientes antigos (WhatsApp).\n**Noite:** Digital (Stories e novos contatos).' },
    { label: '🏛️ Os 4 Pilares', question: 'Quais são os 4 pilares?', answer: '1. Ativação (Clientes Antigos)\n2. Prospecção (Novos)\n3. Rotina Digital\n4. Venda Presencial (O mais forte!).' }
];

export const LOCAL_KNOWLEDGE_BASE = `
# ESTRATÉGIA SPRINT FINAL ALL-IN

## Meta Financeira
- **Meta Diária:** 3 pares de tênis vendidos.
- **Lucro Unitário:** R$ 244,50 por par.
- **Duração:** 14 dias (08/12 a 22/12).
- **Lucro Total Projetado:** R$ 10.269,00.

## Os 4 Pilares da Venda
1. **Ativação (Clientes Antigos):** É mais fácil vender para quem já confia em você. Aborde individualmente no WhatsApp. "Lembrei de você com essa nova cor".
2. **Prospecção (Novos Clientes):** Meta de adicionar 5 novos contatos na agenda por dia. Use redes sociais e indicações.
3. **Rotina Digital:** Stories diários geram desejo. Mostre bastidores, prova social (clientes usando) e enquetes.
4. **Venda Presencial (O Acelerador):** Nada supera a experiência de calçar o tênis.
   - Ande sempre com um par demonstrativo.
   - Script: "Experimenta rapidinho, só 10 segundos".
   - O conforto vende o produto.

## Rotina Sugerida
- **Manhã:** Venda Presencial. Visite comércios locais, academias, salões. Foco em colocar o tênis no pé do cliente.
- **Tarde:** Ativação e Follow-up. Chame clientes antigos e cobre quem ficou de pensar.
- **Noite:** Organização e Digital. Poste stories de "estoque acabando", responda caixinhas de perguntas.

## Argumentos de Venda
- **Tecnologia Terapêutica:** Magnetoterapia e Infravermelho longo. Ajuda na circulação e dores.
- **Conforto:** Tecido Knit respirável e leve.
- **Exclusividade:** Modelo All-In com design moderno.

## Prêmio Extra
Distribuidores que atingirem 45 pares (ou R$ 11k em compras) ganham um produto lançamento na próxima convenção.
`;