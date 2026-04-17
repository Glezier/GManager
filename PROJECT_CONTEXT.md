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

### Ambiente
#### Backend
- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `PORT`

#### Frontend
- `VITE_API_URL`

## Foco atual
- amadurecer a interface
- corrigir fragilidades visuais e textuais
- preparar a base para crescer sem retrabalho
- aplicar a nova direção de identidade visual de forma incremental nas telas principais

## Roadmap

### Fase 2: UX e identidade visual
- concluído: revisar visual do dashboard
- próximo passo: revisar visual da página do dia
- próximo passo: revisar visual do calendário
- revisar responsividade
- consolidar CSS global/base compartilhada
- revisar consistência geral do CSS

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

## Fragilidades atuais
- ainda há pequenos erros textuais em mensagens da interface, como textos de loading
- a `DayPage` e o calendário ainda precisam alcançar o mesmo nível de acabamento visual do dashboard
- a organização de estilos ainda depende demais de regras espalhadas por páginas
- o backend ainda concentra SQL diretamente nos controllers

## Etapas concluídas recentemente
- login e cadastro receberam base visual compartilhada
- login ganhou botão de mostrar/ocultar senha
- o fluxo de autenticação no frontend ficou visualmente mais maduro
- dashboard recebeu revisão visual inicial
- estados vazios, loading reutilizável e confirmação visual já estão integrados no fluxo principal
- `Guia Style.md` foi reescrito como guia de identidade visual do GManager focado na refatoração incremental do projeto atual

## Próximo passo atual
- revisar visual da `DayPage` e do calendário, junto com correções textuais visíveis da interface

## Subfoco deste ciclo
- alinhar a `DayPage` ao mesmo nível visual do dashboard
- retirar estilos inline do calendário e dar uma estrutura visual própria para a página
- corrigir textos visíveis com erro, principalmente mensagens de loading
- aplicar a direção do `Guia Style.md` sem trocar stack e sem abrir uma refatoração estrutural fora do escopo atual

## Próxima direção recomendada
- depois da `DayPage` e do calendário, consolidar CSS global/base compartilhada
- depois disso, voltar para a padronização textual e evolução técnica do backend

## Apoio de design
- para as próximas revisões visuais, vale estruturar referências e componentes em uma ferramenta de design antes de codar
- a prioridade é organizar tokens visuais, componentes-base e variações das telas principais
- esse apoio de design deve servir para acelerar a implementação do frontend, não para substituir o roadmap atual
- o projeto agora conta com um guia de identidade visual voltado à refatoração incremental do frontend existente

## Papel do Guia Style
- o `Guia Style.md` passa a ser a principal referência visual para a Fase 2
- ele deve orientar cores, superfícies, feedbacks, componentes-base e consistência entre telas
- a implementação deve adaptar o guia ao GManager real, evitando copiar referências externas de forma literal

## Critérios para o próximo commit
- este ciclo já pode ser commitado após validação local de autenticação, rotas privadas, loading reutilizável e navegação do calendário
- o próximo commit deve cobrir a primeira revisão visual da `DayPage` e do calendário, além de correções textuais visíveis

## Acordo de trabalho atual
- mudanças de código dos arquivos da aplicação serão propostas no chat para o usuário aplicar manualmente
- o único arquivo que pode ser atualizado diretamente por esta sessão é `PROJECT_CONTEXT.md`
- este contexto deve ser atualizado a cada etapa relevante concluída
- alterações feitas por engano diretamente no código devem ser revertidas antes de seguir
