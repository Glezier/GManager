# Projeto: Gerenciador de Tarefas

## Projeto
Aplicacao web de organizacao pessoal com foco em tarefas por dia, calendario mensal e navegacao simples entre datas.

Objetivos:
1. ser uma ferramenta real de uso pessoal
2. servir como pratica consistente de desenvolvimento full-stack

## Stack atual
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Autenticacao: JWT
- Calendario: FullCalendar

## Estado atual

### Ja implementado
- cadastro e login de usuario
- autenticacao com JWT
- rotas privadas no frontend
- criacao, edicao, conclusao e exclusao de tarefas
- busca de tarefas por intervalo
- dashboard com tarefas do dia
- visao semanal clicavel
- calendario mensal
- pagina dedicada para um dia
- criacao e edicao de tarefa via modal
- confirmacao visual reutilizavel para exclusao de tarefa
- feedbacks visuais de erro, sucesso, vazio e loading nas telas principais
- loading reutilizavel em `components/ui`
- padronizacao de token e navegacao no frontend
- clique em eventos do calendario levando para a `DayPage`
- barra de mes/ano do calendario mais enxuta
- base visual compartilhada para login e cadastro
- botao de mostrar/ocultar senha no login
- ordenacao de tarefas por horario refinada
- experiencia de edicao revisada
- base global inicial de tema criada com `tokens.css` e `base.css`
- build e lint ja validados apos a primeira passada de refatoracao visual
- `.gitignore` e arquivos `.env.example` ja existem para a estrutura atual
- tratamento global de erro no backend
- fluxo de verificacao por email funcional com Resend, dominio proprio e validacao por link
- pagina intermediaria de orientacao apos cadastro (`ValidarEmail`) ja iniciada
- CORS revisado com origens permitidas por ambiente
- `helmet` aplicado no backend
- rate limit nas rotas de autenticacao
- rate limit nas operacoes de escrita de tarefas
- rota `GET /auth/me` para dados basicos do usuario logado
- calendario limitado por data de criacao da conta e horizonte futuro

### Seguranca ja observada no codigo
- uso de `bcryptjs` para hash de senha
- uso de JWT para autenticacao
- validacoes de entrada com `validator` e regex de hora/data
- queries SQL ja usam parametros com `pool.query(..., [...])`, o que cobre protecao basica contra SQL injection
- CORS restrito por lista de origens permitidas
- headers de seguranca basicos aplicados com `helmet`
- rate limit aplicado nas rotas sensiveis de autenticacao e escrita de tarefas

### Ambiente
#### Backend
- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `COOKIE_SECURE`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRES_DAYS`
- `RESEND_API_KEY`
- `EMAIL_FROM`

#### Frontend
- `VITE_API_URL`

## Foco atual
- continuar a Fase 5 com foco em seguranca basica de producao
- revisar tratamento de erros para evitar vazamento desnecessario de detalhes internos
- evoluir seguranca sem travar o avanco funcional

## Roadmap

### Fase 5: Seguranca da aplicacao
- revisar politica de segredos e configuracao para deploy publico
- garantir ajuste de `NODE_ENV=production` no deploy
- garantir `COOKIE_SECURE=true` em producao com HTTPS
- revisar `FRONTEND_URL` e origem exata usada no CORS antes do deploy
- configurar `trust proxy` no deploy antes de confiar no IP real para rate limit
- rotacionar segredos expostos em desenvolvimento antes de publicar
- usar cookie `httpOnly`, `secure` e `sameSite` para refresh token em ambiente de producao
- criar apenas sombras com em breve(similar ao notes) para finanças, listas, metas futuras...

### Fase 6: Testes
- criar checklist manual do fluxo principal
- preparar testes automatizados minimos de autenticacao
- preparar testes automatizados minimos de tarefas
- validar rotas privadas e fluxo principal antes de deploy

### Fase 7: Deploy com Docker
- criar `Dockerfile` do backend
- criar `Dockerfile` do frontend
- criar `docker-compose` inicial
- definir estrategia de deploy publico usando containers

### Fase 8: Notas e organizacao pessoal
- Tarefas com datas contínuas ou frequência definida
- Página inicial antes de login
- adicionar notas
- decidir se serao gerais, por dia ou ambas
- avaliar listas com checks
- avaliar observacoes ligadas a tarefas
- retomar social login com Google em momento posterior, fora do foco atual de seguranca

### Fase 9: Base tecnica madura
- separar melhor responsabilidades no backend
- reduzir SQL direto em controllers
- criar migrations ou scripts versionados
- revisar encoding e padronizacao textual

### Fase 10: Recursos avancados
- responsividade
- filtros por status e data
- busca de tarefas
- categorias e prioridade
- recorrencia
- exportacao
- metricas simples
- recuperacao de senha via email
- confirmacao de senha no cadastrar
- area de perfil para alterar dados (senha, email) e definir modo escuro ou claro
- area de gestao de gastos
- area para metas futuras
- integracao com time de futebol

## Fragilidades atuais
- o backend ainda concentra SQL diretamente nos controllers
- ainda nao ha testes automatizados minimos do fluxo principal
- ainda nao ha estrutura de Docker no repositorio
- ainda faltam revisoes de tratamento de erros, segredos e configuracao final de producao
- ha variaveis de ambiente sensiveis que exigem revisao final antes do deploy, especialmente `NODE_ENV`, `COOKIE_SECURE`, `FRONTEND_URL` e segredos/autorizadores

## Diretrizes de deploy e repositorio publico
- o deploy publico deve ser conectado ao GitHub apenas quando a revisao basica de seguranca estiver concluida
- a branch `main` deve representar o estado estavel/de producao
- uma branch `dev` pode ser usada para desenvolvimento antes de mergear na `main`
- o deploy automatico deve apontar preferencialmente para a `main`
- alteracoes devem ser testadas localmente antes de chegar na `main`
- para trabalho solo, o fluxo recomendado e: desenvolver em `dev`, testar, mergear em `main`, deixar o provedor publicar
- se o repositorio ficar publico, nenhum `.env` real deve estar versionado
- segredos antigos que ja apareceram no historico, prints, README, chat ou commits devem ser rotacionados antes de publicar
- backend e frontend podem ficar publicos se nao houver segredos hardcoded, endpoints desprotegidos ou configuracao insegura
- o README deve conter link do site no ar, screenshots, stack, recursos implementados, roadmap e instrucoes de execucao local
- o README deve usar `.env.example` como referencia e nunca expor valores reais
- caso o projeto vire produto com logica proprietaria sensivel, reavaliar se o repositorio deve continuar publico

## Proximo passo atual
- revisar tratamento de erros para evitar vazamento desnecessario de detalhes internos

## Subfoco do ciclo atual
- revisar o `errorMiddleware`
- separar mensagens seguras para resposta HTTP de detalhes internos usados apenas em log
- manter formato padronizado `{ error: { code, message } }`

## Proxima direcao recomendada
- revisar tratamento de erros
- depois revisar politica de segredos e configuracao para deploy publico
- depois estruturar testes minimos
- so entao preparar o deploy com Docker

## Criterios para o proximo commit
- Fase 3 concluida com ordenacao por horario e experiencia de edicao revisadas
- a Fase 4 ja conta com envio real, reenvio e consumo de token de verificacao por email
- a Fase 4 ja conta com refresh token funcional no backend e no frontend
- a Fase 5 ja conta com CORS revisado, `helmet` e rate limit inicial
- o proximo commit deve consolidar a Fase 5 com revisao de tratamento de erros e configuracao de producao

## Acordo de trabalho atual
- mudancas de codigo dos arquivos da aplicacao podem ser aplicadas diretamente por esta sessao quando alinhadas com o usuario
- o `PROJECT_CONTEXT.md` continua podendo ser atualizado diretamente por esta sessao
- este contexto deve ser atualizado a cada etapa relevante concluida
- alteracoes feitas por engano diretamente no codigo devem ser revertidas antes de seguir
