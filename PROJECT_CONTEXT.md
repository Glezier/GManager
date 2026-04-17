# Projeto: Gerenciador de Tarefas

## Projeto
Aplicação web de organização pessoal com foco em tarefas por dia, calendário mensal e navegação simples entre datas.

Objetivos:
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
- clique em eventos do calendário levando para a `DayPage`
- barra de mês/ano do calendário mais enxuta
- base visual compartilhada para login e cadastro
- botão de mostrar/ocultar senha no login
- tratamento global de erro no backend
- base global inicial de tema criada com `tokens.css` e `base.css`
- `Dashboard`, `DayPage`, `Calendar` e telas de autenticação migrados para a nova direção visual base
- `TaskCard`, `TaskForm`, `ConfirmBox` e `LoadingState` alinhados aos tokens visuais compartilhados
- build e lint validados após a primeira passada de refatoração visual

### Ambiente
#### Backend
- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `PORT`

#### Frontend
- `VITE_API_URL`

## Roadmap

### Fase 2: UX e identidade visual
- em andamento: revisão geral da estilização para seguir o `Guia Style.md`
- concluído: revisar visual do dashboard
- em andamento: revisar visual da página do dia
- revisar visual do calendário
- revisar responsividade
- concluído: consolidar CSS global/base compartilhada
- revisar consistência geral do CSS
- revisar acabamento fino após a migração inicial do tema

### Fase 3: Fluxo principal mais completo
- melhorar ordenação por horário
- revisar a experiência de edição
- em andamento: melhorar estados vazios e mensagens da interface

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
- recuperação de senha via email
- área de gestão de gastos
- área para metas futuras
- integração com time de futebol

## Apoio de design
- para as próximas revisões visuais, vale estruturar referências e componentes em uma ferramenta de design antes de codar
- a prioridade é organizar tokens visuais, componentes-base e variações das telas principais
- esse apoio de design deve servir para acelerar a implementação do frontend, não para substituir o roadmap atual
- o projeto agora conta com um guia de identidade visual voltado à refatoração incremental do frontend existente

## Papel do Guia Style
- o `Guia Style.md` passa a ser a principal referência visual para a Fase 2
- ele deve orientar cores, superfícies, feedbacks, componentes-base e consistência entre telas
- a implementação deve adaptar o guia ao GManager real, evitando copiar referências externas de forma literal
- agora que a base visual inicial já foi criada, o guia passa a servir principalmente como referência de validação, ajuste fino e coerência entre telas
- ele continua útil para evitar regressões visuais e para orientar o refinamento da `DayPage`, do `Calendar` e da consistência geral do frontend

## Foco atual
- fazer uma revisão guiada da `DayPage` com base no uso real da tela
- corrigir desequilíbrios visuais, espaçamentos e transições entre superfícies
- melhorar a leitura do topo, da área de progresso e da lista de tarefas
- preparar o mesmo tipo de revisão guiada para o `Calendar` logo em seguida

## Próximo passo atual
- revisar a `DayPage` em detalhes após a primeira passada de tema global
- corrigir problemas visuais percebidos no uso, como transição de fundo, proporção da hero e composição da área principal
- fechar um padrão visual mais maduro para a tela antes de avançar para o `Calendar`

## Subfoco deste ciclo
- revisar o fundo global versus o conteúdo da `DayPage`
- ajustar altura útil da página e distribuição vertical do layout
- refinar a hero, os botões de navegação, o bloco de progresso e a lista de tarefas
- validar a coerência entre `DayPage` e `Dashboard` antes de migrar o mesmo nível de acabamento para o `Calendar`

## Acordo de trabalho atual
- mudanças de código dos arquivos da aplicação podem ser aplicadas diretamente por esta sessão quando alinhadas com o usuário
- o `PROJECT_CONTEXT.md` continua podendo ser atualizado diretamente por esta sessão
- este contexto deve ser atualizado a cada etapa relevante concluída
- alterações feitas por engano diretamente no código devem ser revertidas antes de seguir
