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
- confirmação visual reutilizável para exclusão de tarefa
- feedbacks visuais de erro, sucesso, vazio e loading nas telas principais
- loading reutilizável em `components/ui`
- padronização de token e navegação no frontend
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
- estados visuais compartilhados, como loading e confirmação, devem nascer como componentes reutilizáveis

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
- corrigir fragilidades visuais e textuais antes de abrir novas frentes grandes

## Roadmap oficial

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

## Etapas concluídas recentemente
- o fluxo de confirmação visual reutilizável foi integrado ao frontend para remoção de tarefa
- a API do componente de confirmação foi alinhada entre hook e páginas
- a leitura, persistência e remoção de token no frontend foram padronizadas em util próprio
- o acesso a rotas privadas e o redirecionamento por sessão inválida ficaram mais consistentes
- Dashboard e DayPage passaram a compartilhar melhor estados de loading, erro, sucesso e vazio via hooks e componentes reutilizáveis
- criação e edição de tarefa via modal ficaram mais consistentes entre as telas principais
- o loading visual foi extraído para componente reutilizável em `components/ui`
- o calendário recebeu feedback visual mais claro, barra de mês/ano mais enxuta e navegação por clique em eventos

## Fragilidades percebidas no estado atual
- ainda há textos com encoding quebrado visíveis em vários arquivos do frontend e do backend
- há pequenos erros textuais em mensagens de interface, como "Carregano"
- login e cadastro ainda estão visuais e estruturalmente bem crus em comparação ao restante do fluxo principal
- o backend ainda concentra SQL diretamente nos controllers

## Próximo passo atual
- revisar visual e experiência de login e cadastro, já corrigindo textos visíveis quebrados nessas telas

## Próxima direção recomendada
- depois de login e cadastro, revisar consistência visual do dashboard, da página do dia e do calendário
- em seguida, atacar a revisão de encoding e padronização textual no restante da aplicação
- depois disso, voltar para a base técnica madura no backend

## Critérios para o próximo commit
- este ciclo já pode ser commitado após validação local de autenticação, rotas privadas, loading reutilizável e navegação do calendário
- o próximo commit deve cobrir a primeira revisão visual de login e cadastro com textos consistentes

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