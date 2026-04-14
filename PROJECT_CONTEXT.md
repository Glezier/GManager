# Projeto: Gerenciador de Tarefas

## Visão do produto
Aplicação web de organização pessoal com foco em tarefas por dia, calendário mensal e navegação simples entre datas.

Objetivos do projeto:
1. ser uma ferramenta real de uso pessoal
2. servir como prática consistente de desenvolvimento full-stack

## Stack atual
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Autenticação: JWT
- Calendário: FullCalendar

## Estado atual

### Já implementado
- cadastro e login de usuário
- autenticação com JWT
- rotas privadas no frontend
- criação, edição, conclusão e exclusão de tarefas
- busca de tarefas por intervalo
- dashboard com tarefas do dia
- visão semanal clicável
- calendário mensal
- página dedicada para um dia
- criação e edição de tarefa via modal
- feedback visual básico de erro, loading e sucesso
- padronização inicial de datas no frontend
- tratamento global de erro no backend

### Decisões técnicas já tomadas
- tarefas devem ser buscadas por intervalo
- `data` segue o padrão `YYYY-MM-DD`
- `hora` segue o padrão `HH:MM`
- formatação humana em `pt-BR` acontece apenas na interface
- `created_at` pode continuar como timestamp
- modal é o padrão atual para criação e edição de tarefa
- componentes visuais reutilizáveis devem morar em `components` ou `components/ui`, e não em `utils`

### Ambiente

#### Backend
- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `PORT`

#### Frontend
- `VITE_API_URL`

## Situação atual
O fluxo principal do produto já existe e está funcional. O foco agora deve sair de "criar mais telas" e passar para:
- reduzir repetição no frontend
- melhorar manutenção do código
- amadurecer a interface
- preparar novas funcionalidades com menos retrabalho

## Roadmap oficial

### Fase 1: Organização do frontend
- padronizar melhor o tratamento de token e navegação

### Fase 2: UX e identidade visual
- revisar visual de login e cadastro
- revisar visual do dashboard
- revisar visual da página do dia
- estilizar melhor o calendário
- revisar consistência geral do CSS
- revisar responsividade

### Fase 3: Fluxo principal mais completo
- melhorar ordenação por horário
- revisar a experiência de edição
- melhorar estados vazios e mensagens da interface

### Fase 4: Notas e organização pessoal
- adicionar notas
- decidir se serão gerais, por dia ou ambas
- avaliar listas com checks
- avaliar observações ligadas a tarefas

### Fase 5: Base técnica madura
- separar melhor responsabilidades no backend
- reduzir SQL direto em controllers
- criar migrations ou scripts versionados
- preparar testes iniciais
- revisar encoding e padronização textual

### Fase 6: Recursos avançados
- filtros por status e data
- busca de tarefas
- categorias e prioridade
- recorrência
- exportação
- métricas simples
- deploy
- área de gestão de gastos (a definir melhor)
- área para metas futuras, a longo prazo (a definir melhor)

## Próximo passo atual
- refinar a experiência do calendário com feedback visual mais claro e navegação mais consistente

## Direção de arquitetura para confirmação
- a confirmação deve nascer como componente reutilizável, não como solução específica de tarefas
- o padrão precisa ser reaproveitável para exclusão e ações sensíveis em tarefas, notas, finanças e futuras áreas do produto
- a API do componente deve aceitar título, mensagem, rótulos de ação, variante visual e callbacks de confirmar/cancelar
- a primeira integração será no fluxo de remoção de tarefa, mantendo a base pronta para outras integrações futuras
- futuros estados visuais compartilhados, como loading, devem nascer como componentes reutilizáveis em `components/ui`

## Status desta etapa
- o fluxo de confirmação visual reutilizável já foi integrado ao frontend para remoção de tarefa
- a API do componente de confirmação foi alinhada entre hook e páginas
- a etapa foi validada no fluxo principal e pode ser considerada concluída para commit
- a leitura, persistência e remoção de token no frontend foram padronizadas em util próprio
- o acesso a rotas privadas e o redirecionamento por sessão inválida ficaram mais consistentes
- Dashboard e DayPage passaram a compartilhar melhor estados de loading, erro, sucesso e vazio via hooks e componentes reutilizáveis
- criação e edição de tarefa via modal ficaram mais consistentes entre as telas principais
- a direção para o calendário já foi definida: feedbacks mais claros, barra de mês/ano mais enxuta e clique em eventos levando ao dia correspondente

## Próxima direção recomendada
- criar um loading reutilizável para a interface, começando pelo calendário
- ajustar a barra de seleção de mês e ano para ocupar apenas o tamanho do conteúdo alinhado à direita
- permitir que clicar em uma tarefa no FullCalendar também abra a DayPage do dia correspondente
- depois disso, partir para revisão visual de login e cadastro

## Critérios para o próximo commit
- este ciclo pode ser commitado após validação local do fluxo de autenticação, logout e rotas privadas
- o próximo commit deve cobrir a melhoria dos feedbacks visuais do calendário e a correção de pequenas fragilidades restantes no hook de tarefas

## Acordo de trabalho atual
- mudanças de código dos arquivos da aplicação serão propostas no chat para o usuário aplicar manualmente
- o único arquivo que pode ser atualizado diretamente por esta sessão é `PROJECT_CONTEXT.md`
- este contexto deve ser atualizado a cada etapa relevante concluída
- alterações feitas por engano diretamente no código devem ser revertidas antes de seguir

## Forma de trabalho
- seguir este arquivo como referência principal
- atualizar o contexto ao concluir etapas relevantes
- evitar abrir frentes muito fora da ordem definida aqui

## Critério de prioridade
1. corrigir fragilidade técnica real
2. melhorar o fluxo principal do usuário
3. reduzir repetição e dívida estrutural
4. melhorar UX e visual
5. adicionar novas funcionalidades
