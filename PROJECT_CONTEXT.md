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

## Roadmap

### Fase 2: UX e identidade visual
- revisar visual do dashboard
- revisar visual da página do dia
- revisar visual do calendário
- revisar responsividade
- consolidar CSS global/base compartilhada
- revisar consistência geral do CSS

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
- recuperação de senha via email
- área de gestão de gastos
- área para metas futuras

## Fragilidades atuais
- ainda há pequenos erros textuais em mensagens da interface
- a organização de estilos ainda depende demais de regras espalhadas por páginas
- o backend ainda concentra SQL diretamente nos controllers

## Etapas concluídas recentemente
- login e cadastro receberam base visual compartilhada
- login ganhou botão de mostrar/ocultar senha
- o fluxo de autenticação no frontend ficou visualmente mais maduro

## Próximo passo atual
- revisar visual do dashboard

## Próxima direção recomendada
- depois do dashboard, revisar página do dia e calendário
- em seguida, consolidar CSS global/base compartilhada
- depois disso, voltar para a padronização textual e evolução técnica do backend

## Critérios para o próximo commit
- este ciclo já pode ser commitado após validação local de autenticação, rotas privadas, loading reutilizável e navegação do calendário
- o próximo commit deve cobrir a primeira revisão visual do dashboard

## Acordo de trabalho atual
- mudanças de código dos arquivos da aplicação serão propostas no chat para o usuário aplicar manualmente
- o único arquivo que pode ser atualizado diretamente por esta sessão é `PROJECT_CONTEXT.md`
- este contexto deve ser atualizado a cada etapa relevante concluída
- alterações feitas por engano diretamente no código devem ser revertidas antes de seguir