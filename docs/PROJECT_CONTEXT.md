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

### Fase 3: Detalhes importantes
- pagina inicial antes de login
- upload de foto pra aba perfil
- analisar se a forma de implementação de tema é a melhor possível
- aprender hackear tentando hackear o proprio site

### Fase 4: Produto
- filtros por status e data
- busca de tarefas
- tarefas com datas continuas ou frequencia definida
- categorias e prioridade
- recorrencia
- exportacao em PDF
- importar tarefas de outros apps
- metricas simples
- colocar anuncios
- não deixar api exposta
- implementar migrations

### Fase 5: Recursos em breve
- avaliar notas (por dia e uma aba só pra ela com várias)
- avaliar checklists
- avaliar financas
- avaliar metas
- avaliar notas de pesos de academia
- avaliar gerenciamento de senhas
- integracao com time de futebol
- IA que da dicas e ajuda a fazer as tarefas cadastradas

### Fase 6: Docker
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

### pulados
- Revisão geral de nomes e contratos dos repositories.
Garantir que todos retornam dado limpo ou null, e não result do pg

## Acordo de trabalho
- quando o objetivo for aprendizado, explicar antes de alterar codigo
- editar arquivos diretamente apenas quando solicitado
- manter este documento como guia pratico de sequencia do projeto
- ajustar rate limit pra mostrar o tempo que falta pra fazer algo ao invés de algo estático
- preparar base para testes automatizados
