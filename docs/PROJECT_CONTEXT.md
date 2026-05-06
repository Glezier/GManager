# Projeto: My GManager

## Visao
Aplicacao full-stack de organizacao pessoal, com foco inicial em tarefas, dashboard, calendario e rotina diaria.

Objetivo do projeto:
- construir uma ferramenta real de uso pessoal
- evoluir o sistema com praticas profissionais de desenvolvimento full-stack
- manter seguranca, confiabilidade, deploy e banco de dados como partes centrais do aprendizado

## Stack
- Frontend: React + Vite + React Router + FullCalendar
- Backend: Node.js + Express
- Banco: PostgreSQL no Neon
- Autenticacao: JWT + refresh token em cookie `httpOnly`
- Email: Resend
- Deploy atual: Vercel para frontend e backend

## Estado atual resumido
O sistema ja possui autenticacao, verificacao de email, refresh token, rotas privadas, CRUD de tarefas, dashboard, calendario, pagina por dia, validacoes principais, rate limit, CORS, `helmet`, middleware global de erro e deploy inicial em producao.

O projeto agora esta na fase de estabilizacao pos-deploy: separar ambiente de desenvolvimento da producao, proteger dados, revisar performance do backend e preparar uma base mais profissional para evoluir com seguranca.

## Ambientes
### Producao
- Vercel para frontend e backend
- Neon para banco de producao
- variaveis reais configuradas apenas nos paineis dos provedores
- branch `main` deve representar o estado estavel publicado


## Proximo passo imediato
Criar um ambiente seguro de desenvolvimento com banco separado e dump/schema do banco atual.

Ordem:
1. criar banco ou branch dev no Neon
2. gerar dump/schema do banco atual
3. aplicar a estrutura no banco dev
4. ajustar `backend/.env` local para usar o banco dev
5. garantir que backups/dumps nao entrem no Git
6. testar login, tarefas e calendario localmente usando o banco dev

## Plano de execucao

### Fase 1: Banco dev e backup
- criar banco/branch dev no Neon
- gerar `schema.sql` do banco atual
- documentar comandos de backup e restore
- adicionar regras no `.gitignore` para dumps/backups
- validar que o ambiente local nao usa o banco de producao

### Fase 2: Performance do backend
- medir tempo das principais rotas
- investigar requisicoes acima de 1s
- revisar uso do pool PostgreSQL
- revisar consultas nos controllers
- identificar chamadas duplicadas no frontend
- separar lentidao causada por cold start da Vercel/Neon de lentidao causada pelo codigo

### Fase 3: Organizacao do backend
- separar controllers, services e repositories quando fizer sentido
- mover validacoes reutilizaveis para helpers ou validators
- reduzir SQL direto dentro dos controllers
- padronizar respostas de erro
- preparar base para testes automatizados

### Fase 4: Testes automatizados
- configurar ferramenta de testes do backend
- testar autenticacao, login, refresh token e rotas privadas
- testar CRUD de tarefas
- testar validacoes de data, limite diario e periodo permitido
- adicionar scripts de teste ao `package.json`

### Fase 5: Fluxo profissional de Git e deploy
- usar `main` apenas para producao
- desenvolver em `dev` ou `feature/*`
- usar preview deployments da Vercel para branches/PRs
- validar build, lint e testes antes de mergear na `main`
- documentar o fluxo no README

### Fase 6: CI/CD
- criar workflow no GitHub Actions
- rodar lint, build e testes automaticamente
- impedir merge quebrado para a branch principal
- avaliar deploy automatico apenas apos validacoes basicas

### Fase 7: Docker
- corrigir Dockerfiles se necessario
- validar `docker-compose.yml`
- rodar frontend e backend localmente via containers
- avaliar banco local em container para testes
- manter Docker como opcao de deploy fora da Vercel

### Fase 8: Produto
- melhorar responsividade
- adicionar filtros, busca, categorias e prioridades
- adicionar tarefas recorrentes
- adicionar recuperacao de senha
- criar area de perfil
- avaliar notas, checklists, financas e metas
- melhorar experiencia visual e acessibilidade

### Fase 9: Deploy avancado em AWS
- estudar EC2, RDS, S3, CloudWatch, IAM e Route 53
- avaliar deploy do backend em container
- avaliar PostgreSQL em RDS ou permanencia no Neon
- configurar logs, monitoramento e backups
- comparar custo, complexidade e ganho real em relacao a Vercel/Neon

## Acordo de trabalho
- quando o objetivo for aprendizado, explicar antes de alterar codigo
- editar arquivos diretamente apenas quando solicitado
- manter este documento como guia pratico de sequencia do projeto
