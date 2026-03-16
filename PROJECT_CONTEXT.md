# Projeto: Plataforma de Organização

## Visão do produto
Aplicação web de organização pessoal com foco em agenda e calendário.

A proposta principal é que, ao entrar no app, o usuário veja imediatamente as tarefas do dia atual e consiga navegar por um calendário visual para selecionar qualquer dia, visualizar suas tarefas e adicionar novas tarefas diretamente naquela data.

Este projeto tem dois objetivos:
1. servir como produto real de uso pessoal
2. servir como projeto de aprendizado prático em desenvolvimento full-stack

## Stack atual
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Autenticação: JWT

## Funcionalidades atuais
- cadastro de usuário
- login com JWT
- criação de tarefas
- listagem de tarefas
- conclusão de tarefas
- exclusão de tarefas
- agrupamento de tarefas por data

## Visão de produto
O sistema deve evoluir para um organizador pessoal com:
- dashboard inicial mostrando tarefas do dia
- calendário mensal interativo
- criação de tarefas a partir do dia selecionado
- tarefas com data e hora
- experiência agradável visualmente
- uso prático no dia a dia

## Roadmap

### Fase 1: Base sólida
- documentar o projeto no README
- criar `.env.example`
- proteger rotas privadas no frontend
- padronizar estrutura e nomenclatura
- corrigir encoding de arquivos
- melhorar tratamento de erros e carregamento

### Fase 2: Fluxo principal do produto
- mostrar tarefas do dia ao entrar no dashboard
- permitir edição de tarefas
- melhorar ordenação por horário
- criar estados vazios e feedback visual
- preparar navegação entre dias

### Fase 3: Calendário mensal
- construir componente de calendário
- navegar entre meses
- selecionar um dia
- exibir tarefas do dia selecionado
- destacar hoje
- destacar dias com tarefas
- criar tarefa já vinculada ao dia clicado

### Fase 4: Evolução de tarefas
- prioridade
- categorias
- observações
- filtros por status
- filtros por data
- busca de tarefas
- preparação para recorrência

### Fase 5: UX/UI
- aplicar identidade visual consistente
- melhorar layout geral
- tornar calendário mais bonito e intuitivo
- responsividade mobile e desktop
- feedback visual para ações do usuário

### Fase 6: Backend mais maduro
- validação de entrada
- melhor separação de responsabilidades
- padronização das respostas da API
- migrations ou scripts versionados do banco
- base inicial de testes

### Fase 7: Recursos avançados
- visão semanal
- exportação em PDF
- exportação em imagem
- métricas simples de produtividade
- deploy da aplicação

## Próximo passo atual
Implementar a Fase 1 começando por:
1. reforço da documentação
2. proteção de rotas
3. evolução do dashboard para visão do dia