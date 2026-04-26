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
- ordenação de tarefas por horário refinada
- experiência de edição revisada
- base global inicial de tema criada com `tokens.css` e `base.css`
- build e lint já validados após a primeira passada de refatoração visual
- `.gitignore` e arquivos `.env.example` já existem para a estrutura atual
- tratamento global de erro no backend
- fluxo de verificação por email funcional com Resend, domínio próprio e validação por link
- página intermediária de orientação após cadastro (`ValidarEmail`) já iniciada

### Segurança já observada no código
- uso de `bcryptjs` para hash de senha
- uso de JWT para autenticação
- validações de entrada com `validator` e regex de hora/data
- queries SQL já usam parâmetros com `pool.query(..., [...])`, o que cobre proteção básica contra SQL injection

### Ambiente
#### Backend
- `DB_URL`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `PORT`

#### Frontend
- `VITE_API_URL`

## Foco atual
- iniciar a Fase 5 com foco em segurança básica de produção
- revisar a infraestrutura de autenticação agora que refresh token já está funcional
- evoluir segurança sem travar o avanço funcional

## Roadmap

### Fase 5: Segurança da aplicação
- revisar CORS para produção
- adicionar `helmet`
- adicionar rate limit nas rotas de autenticação
- revisar tratamento de erros para evitar vazamento desnecessário de detalhes internos
- revisar política de segredos e configuração para deploy público
- garantir ajuste de `NODE_ENV=production` no deploy
- garantir `COOKIE_SECURE=true` em produção com HTTPS
- revisar `FRONTEND_URL` e origem exata usada no CORS antes do deploy
- rotacionar segredos expostos em desenvolvimento antes de publicar
- usar cookie `httpOnly`, `secure` e `sameSite` para refresh token em ambiente de produção

### Fase 6: Testes
- criar checklist manual do fluxo principal
- preparar testes automatizados mínimos de autenticação
- preparar testes automatizados mínimos de tarefas
- validar rotas privadas e fluxo principal antes de deploy

### Fase 7: Deploy com Docker
- criar `Dockerfile` do backend
- criar `Dockerfile` do frontend
- criar `docker-compose` inicial
- definir estratégia de deploy público usando containers

### Fase 8: Notas e organização pessoal
- adicionar notas
- decidir se serão gerais, por dia ou ambas
- avaliar listas com checks
- avaliar observações ligadas a tarefas
- retomar social login com Google em momento posterior, fora do foco atual de segurança

### Fase 9: Base técnica madura
- separar melhor responsabilidades no backend
- reduzir SQL direto em controllers
- criar migrations ou scripts versionados
- revisar encoding e padronização textual

### Fase 10: Recursos avançados
- responsividade
- filtros por status e data
- busca de tarefas
- categorias e prioridade
- recorrência
- exportação
- métricas simples
- recuperação de senha via email
- área de perfil pra alterar dados (senha, email) e definir modo escuro ou claro
- área de gestão de gastos
- área para metas futuras
- integração com time de futebol

## Fragilidades atuais
- o backend ainda concentra SQL diretamente nos controllers
- ainda não há testes automatizados mínimos do fluxo principal
- ainda não há estrutura de Docker no repositório
- ainda faltam camadas de segurança importantes para produção, como `helmet`, rate limit e CORS restrito
- há variáveis de ambiente sensíveis que exigem revisão final antes do deploy, especialmente `NODE_ENV`, `COOKIE_SECURE`, `FRONTEND_URL` e segredos/autorizadores

## Próximo passo atual
- iniciar a revisão de CORS para produção

## Subfoco do ciclo atual
- revisar origens permitidas no backend
- alinhar `FRONTEND_URL`, `credentials` e cookies com o ambiente de produção
- reduzir risco de configuração insegura antes de adicionar novas camadas

## Próxima direção recomendada
- revisar CORS para produção
- depois adicionar `helmet`
- depois adicionar rate limit nas rotas de autenticação
- depois disso, estruturar testes mínimos
- só então preparar o deploy com Docker

## Critérios para o próximo commit
- Fase 3 concluída com ordenação por horário e experiência de edição revisadas
- a Fase 4 já conta com envio real, reenvio e consumo de token de verificação por email
- a Fase 4 já conta com refresh token funcional no backend e no frontend
- o próximo commit deve iniciar a Fase 5 com revisão de CORS para produção

## Acordo de trabalho atual
- mudanças de código dos arquivos da aplicação podem ser aplicadas diretamente por esta sessão quando alinhadas com o usuário
- o `PROJECT_CONTEXT.md` continua podendo ser atualizado diretamente por esta sessão
- este contexto deve ser atualizado a cada etapa relevante concluída
- alterações feitas por engano diretamente no código devem ser revertidas antes de seguir
