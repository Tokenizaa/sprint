# Objetivo
Construir um dashboard que consuma dados da API de distribuidores (compras) e permita ao usuário registrar suas próprias vendas diárias. O sistema deve identificar redundâncias entre tabelas, propor otimizações e recomendar KPIs adicionais com base nos dados da API.

# Contexto
- **Compras**: alimentadas pelo painel administrativo via API de distribuidores.
- **Vendas**: autodeclaradas pelo usuário no dashboard.
- **Dashboard**: deve ter 3 abas principais:
  1. Painel de Visão Geral (suas compras)
  2. Registro de Vendas Diárias (suas vendas)
  3. Relatórios e KPIs adicionais (dinâmicos via API)

# Tarefas
- Integrar API de distribuidores para capturar dados de compras.
- Permitir que o usuário registre vendas diárias.
- Verificar redundâncias entre tabelas de compras e vendas.
- Otimizar estrutura de dados para consistência.
- Avaliar front-end do dashboard e sugerir melhorias de UX/UI.
- Recomendar KPIs adicionais com base nos dados da API.

# KPIs sugeridos (fixos)
- **Usuário:**
  - Evolução diária de vendas
  - Total acumulado de vendas
  - Percentual de meta atingida
  - Comparativo entre compras (API) e vendas (usuário)

- **Administrador:**
  - Ranking de usuários por volume de vendas
  - Taxa de participação ativa
  - Volume total de compras validadas
  - Distribuição geográfica das vendas
  - Taxa de consistência entre compras (API) e vendas (usuário)

# KPIs sugeridos (dinâmicos via API)
- Indicadores de sazonalidade (picos semanais/mensais)
- Correlação entre compras e vendas
- Engajamento do usuário (frequência de registros)
- Qualidade dos dados (divergência entre API e autodeclaração)
- Taxa de recompra por distribuidor
