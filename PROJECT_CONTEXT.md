# Projeto: Gerenciador de Tarefas

## Visão do produto
Aplicação web de organização pessoal com foco em tarefas por dia, calendário mensal e acompanhamento rápido da rotina.

A proposta principal é:
- abrir o app e ver rapidamente o que precisa ser feito hoje
- navegar por datas com facilidade
- gerenciar tarefas de qualquer dia sem atrito
- evoluir depois para notas e outras áreas de organização pessoal

Este projeto tem dois objetivos:
1. ser uma ferramenta real de uso pessoal
2. servir como prática consistente de desenvolvimento full-stack

## Stack atual
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Autenticação: JWT
- Calendário: FullCalendar

## Estado atual do projeto

### Funcionalidades já existentes
- cadastro de usuário
- login com JWT
- proteção básica de rotas privadas no frontend
- criação de tarefas
- listagem de tarefas por intervalo
- conclusão de tarefas
- exclusão de tarefas
- dashboard com tarefas do dia
- resumo dos próximos dias
- visão semanal clicável para abrir o dia correspondente
- calendário mensal
- página dedicada para um dia específico
- criação de tarefa a partir do dia selecionado
- modal para criação de tarefa no dashboard
- página do dia com navegação entre datas e visual alinhado ao dashboard
- tratamento inicial de erro e loading no frontend
- feedback visual de sucesso nas ações principais de tarefa
- validação inicial de entrada no backend
- middleware global de erro no backend
- edição de tarefa no frontend

### Estado técnico atual
- frontend e backend já conversam com tratamento básico de erro
- o backend já possui `AppError` e `errorMiddleware`
- o frontend já usa `.env` para a URL da API
- há uma base inicial de padronização de datas no frontend
- ainda há espaço para reduzir repetição entre Dashboard, Calendar e DayPage

## Problemas atuais mais relevantes
- ainda falta feedback visual de sucesso nas ações
- ainda há duplicação de lógica de tarefas no frontend
- login e cadastro ainda precisam amadurecer visualmente
- o calendário ainda pode ganhar mais contexto visual
- ainda faltam edição de tarefas, testes e migrations
- o projeto ainda tem alguns sinais de encoding inconsistente em textos

## Roadmap oficial
Este é o roadmap principal a seguir daqui para frente.

### Fase 1: Consolidar o fluxo principal de tarefas
Objetivo: fechar o ciclo essencial do produto com feedback claro e navegação melhor.

- exibir confirmações visuais de sucesso para criar, concluir e excluir tarefas
- melhorar ordenação por horário
- adicionar confirmação visual antes de excluir

### Fase 2: Organizar melhor o frontend
Objetivo: reduzir repetição e deixar a base mais fácil de manter.

- extrair lógica repetida de tarefas
- centralizar tratamento de token
- padronizar melhor estados de erro, loading, vazio e sucesso
- avaliar criação de hooks para autenticação e tarefas
- padronizar navegação entre dashboard, calendário e página do dia

### Fase 3: Melhorar UX e identidade visual
Objetivo: transformar a aplicação em uma experiência mais consistente e agradável.

- estilizar login
- estilizar criar conta
- revisar layout do dashboard
- revisar e refinar o layout da página do dia conforme a evolução do uso real
- estilizar melhor o calendário
- melhorar visual do calendário
- melhorar feedback visual para ações do usuário
- revisar responsividade em mobile e desktop
- revisar consistência geral do CSS

### Fase 4: Evoluir calendário e dashboard
Objetivo: tornar essas telas realmente centrais no uso diário.

- destacar hoje com mais clareza
- melhorar resumo semanal
- exibir mais contexto das tarefas no calendário
- permitir navegação mais fluida entre datas
- adicionar mini calendário no dashboard, se ainda fizer sentido após a evolução da interface

### Fase 5: Notas e organização pessoal
Objetivo: ampliar o projeto além das tarefas.

- adicionar funcionalidade de notas
- decidir se notas serão gerais, por dia ou ambas
- integrar notas ao dashboard
- avaliar listas com checks
- avaliar observações vinculadas a tarefas

### Fase 6: Base técnica madura
Objetivo: preparar o projeto para crescer com menos retrabalho.

- separar melhor responsabilidades no backend
- reduzir SQL espalhado diretamente em controllers
- criar migrations ou scripts versionados do banco
- preparar testes iniciais no backend
- preparar testes iniciais no frontend
- revisar padronização textual e encoding dos arquivos

### Fase 7: Recursos avançados
Objetivo: expandir o produto quando a base estiver confiável.

- filtros por status
- filtros por data
- busca de tarefas
- categorias
- prioridade
- recorrência
- exportação em PDF
- exportação em imagem
- métricas simples de produtividade
- deploy da aplicação
- área de gestão de gastos

## Ordem prática recomendada
Se estivermos seguindo uma fila única de trabalho, a ordem ideal agora é:

1. edição de tarefa
2. organização do frontend
3. revisão visual de login, cadastro, dashboard, calendário e day page
4. notas
5. base técnica madura
6. filtros, busca, categorias e prioridade
7. recursos avançados e deploy

## Próximo passo atual
- organizar melhor o frontend, começando pela redução de repetição no fluxo de tarefas entre Dashboard e DayPage

### Detalhamento do próximo passo
- criar um hook para centralizar o fluxo de tarefas
- mover para esse hook a lógica de carregar tarefas por intervalo
- mover para esse hook a lógica de criar, editar, concluir e excluir tarefas
- mover para esse hook os estados de `loading`, `erroPagina`, `erroForm`, `sucesso`, `addTarefa` e `tarefaEditando`
- adaptar primeiro o `Dashboard` para usar o hook
- depois adaptar a `DayPage` para usar o mesmo hook


### O que ainda não entra nesta etapa
Para evitar abrir escopo demais, estes pontos ficam para depois:

- edição de tarefa
- confirmação antes de excluir
- refatoração para hook compartilhado de tarefas
- revisão visual completa da `DayPage`

## Forma de trabalho
- seguir este arquivo como referência principal de evolução
- atualizar este contexto sempre que uma etapa relevante for concluída
- remover do roadmap o que já foi entregue
- evitar abrir frentes muito fora da ordem definida aqui, salvo necessidade técnica real

## Critério de prioridade
Priorizar sempre nesta ordem:
1. corrigir fragilidade técnica real
2. melhorar o fluxo principal do usuário
3. reduzir repetição e dívida estrutural
4. melhorar UX e visual
5. adicionar novas funcionalidades
