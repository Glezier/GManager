# Projeto: My GManager

## Visao
Aplicacao full-stack de organizacao pessoal, com foco em tarefas, planejamento diario, visao semanal e calendario mensal.

O objetivo e manter uma ferramenta real de uso pessoal enquanto o projeto evolui com praticas profissionais de desenvolvimento full-stack. Seguranca, confiabilidade, deploy, banco de dados e organizacao de codigo fazem parte central do aprendizado.

## Stack
- Frontend: React + Vite + React Router + FullCalendar
- Backend: Node.js + Express
- Banco: PostgreSQL no Neon
- Autenticacao: JWT + refresh token em cookie `httpOnly`
- Email: Resend
- Deploy atual: Vercel para frontend e backend

## Estado atual resumido
O sistema ja possui:
- autenticacao local com JWT e refresh token
- login com Google
- verificacao de email
- recuperacao de senha
- rotas privadas
- CRUD de tarefas
- dashboard diario
- visao semanal
- calendario mensal
- pagina individual por dia
- exportacao de tarefas por dia e por periodo
- tema claro/escuro por usuario
- validacoes no frontend e no backend
- rate limit
- CORS e `helmet`
- middleware global de erro
- backend organizado em controllers, services, repositories e validators
- API frontend modularizada por dominio
- deploy em producao

O projeto esta em fase de evolucao pos-deploy, com foco em estabilidade, organizacao, seguranca e preparacao para funcionalidades maiores.

## Estrutura principal
- `frontend/src/pages`: paginas principais da aplicacao
- `frontend/src/components`: componentes reutilizaveis
- `frontend/src/api`: chamadas para a API organizadas por dominio
- `frontend/src/hooks`: hooks de dados e regras compartilhadas
- `frontend/src/validators`: validacoes reutilizaveis do frontend
- `frontend/src/utils`: funcoes auxiliares
- `backend/src/controllers`: entrada e saida HTTP
- `backend/src/services`: regras de negocio
- `backend/src/repositories`: acesso ao banco e SQL
- `backend/src/validators`: validacoes reutilizaveis do backend
- `backend/src/middleswares`: middlewares de autenticacao, erro e rate limit
- `backend/src/utils`: utilitarios de email, tokens e erros
- `docs`: contexto, guias, checklist manual e informacoes do banco

## Ambientes
### Producao
- Vercel para frontend e backend
- Neon para banco de producao
- variaveis reais configuradas apenas nos paineis dos provedores
- branch `main` deve representar o estado estavel publicado

### Desenvolvimento local
- Backend: `cd backend` e `npm run dev`
- Frontend: `cd frontend` e `npm run dev`
- Antes de commit importante, rodar ao menos `npm run lint` no frontend
- Testes manuais principais estao em `docs/guides/CHECKLIST_MANUAL.md`
- Variaveis reais devem ficar apenas em `.env` local ou nos provedores

### Fase 1: Detalhes pontuais
- pagina inicial antes de login
- upload de foto pra aba perfil
- analisar se a forma de implementação de tema é a melhor possível
- Revisão geral de nomes e contratos dos repositories.
Garantir que todos retornam dado limpo ou null, e não result do pg
- implementar skills e infos de agentes IA

### Fase 2: Produto
- filtros por status e data
- busca de tarefas
- tarefas com datas continuas ou frequencia definida
- categorias e prioridade
- recorrencia
- importar tarefas de outros apps
- metricas simples
- implementar migrations
- não deixar api exposta
- colocar anuncios

### Fase 3: Testes
- testes de carga
- testes de segurança

### Fase 4: Recursos
- avaliar notas (por dia e uma aba só pra ela com várias)
- avaliar checklists
- avaliar financas
- avaliar metas
- avaliar notas de pesos de academia
- avaliar gerenciamento de senhas
- integracao com time de futebol
- IA que da dicas e ajuda a fazer as tarefas cadastradas

### Fase 5: Docker
- corrigir Dockerfiles se necessario
- validar `docker-compose.yml`
- rodar frontend e backend localmente via containers
- avaliar banco local em container para testes
- manter Docker como opcao de deploy fora da Vercel

### Fase 7: Deploy avancado em AWS
- estudar EC2, RDS, S3, CloudWatch, IAM e Route 53
- avaliar deploy do backend em container
- avaliar PostgreSQL em RDS ou permanencia no Neon
- configurar logs, monitoramento e backups
- comparar custo, complexidade e ganho real em relacao a Vercel/Neon

## Acordo de trabalho
- Quando o objetivo for aprendizado, explicar antes de alterar codigo.
- Editar arquivos diretamente apenas quando solicitado.
- Antes de implementar, observar os arquivos relacionados e seguir os padroes ja usados no projeto.
- Preferir mudancas pequenas, testaveis e alinhadas com a arquitetura atual.
- Controllers devem ficar focados em HTTP; regras de negocio ficam nos services; SQL fica nos repositories; validacoes reutilizaveis ficam nos validators.
- No frontend, preferir componentes, hooks, validators e funcoes de API reutilizaveis quando isso reduzir repeticao real.
- Manter este documento como guia pratico para continuar o projeto em qualquer computador.
- Ao finalizar uma etapa, atualizar README, checklist ou este contexto quando fizer sentido.
