# Checklist Manual do Fluxo Principal

Use este checklist antes de commits importantes, antes de deploy e depois de alteracoes em autenticacao, tarefas, calendario ou configuracoes de seguranca.

## Preparacao
- [x] Backend inicia sem erro com `npm run dev`
- [x] Frontend inicia sem erro com `npm run dev`
- [x] Banco de dados esta conectado
- [x] `backend/.env` possui variaveis reais apenas localmente
- [x] `frontend/.env` aponta para a API correta
- [x] `backend/.env.example` nao possui segredos reais
- [x] `frontend/.env.example` nao possui segredos reais
- [x] `.gitignore` ignora arquivos `.env`

## Cadastro
- [x] Abrir pagina de cadastro
- [x] Tentar cadastrar sem nome
- [x] Tentar cadastrar sem email
- [x] Tentar cadastrar sem senha
- [x] Tentar cadastrar com email invalido
- [x] Tentar cadastrar com senha menor que 8 caracteres
- [x] Cadastrar usuario valido
- [x] Ver mensagem/tela orientando validacao de email
- [x] Confirmar que usuario foi criado no banco com `email_verificado = false`
- [x] Confirmar que `created_at` e `updated_at` foram preenchidos corretamente
- [x] Tentar cadastrar novamente com o mesmo email

## Verificacao de Email
- [x] Receber email real de verificacao
- [x] Abrir link de verificacao valido
- [x] Confirmar mensagem de sucesso
- [x] Confirmar no banco `email_verificado = true`
- [x] Confirmar no banco `email_verificado_em` preenchido 
- [x] Confirmar no banco `updated_at` atualizado 
- [x] Tentar usar token de verificacao invalido
- [x] Tentar usar token de verificacao expirado
- [x] Tentar usar token ja utilizado

obs: se nao velidado, a unica opcao é voltar para login, poderia ter logo um reenviar email
e a mensagem de email verificado com sucesso ou reenviado nao sai ao clicar na tela como outros erros
adicionar logo do MYgmanager nessa tela de verificacao tambem
## Reenvio de Verificacao
- [ ] Tentar reenviar email para usuario nao verificado
- [ ] Confirmar mensagem de sucesso
- [ ] Confirmar recebimento do novo email
- [ ] Tentar reenviar para email inexistente
- [ ] Tentar reenviar para usuario ja verificado
- [ ] Testar rate limit do reenvio de verificacao

## Login
- [ ] Login com email vazio
- [ ] Login com senha vazia
- [ ] Login com email invalido
- [ ] Login com credenciais incorretas
- [ ] Login com usuario nao verificado
- [ ] Botao de reenviar verificacao aparece para usuario nao verificado
- [ ] Login com usuario verificado e senha correta
- [ ] Usuario autenticado vai para o dashboard
- [ ] Token de acesso e salvo no frontend
- [ ] Cookie de refresh token e criado
- [ ] Botao de mostrar/ocultar senha funciona
- [ ] Erro comum some ao clicar na tela
- [ ] Backend desligado mostra erro amigavel de conexao

## Rate Limit de Autenticacao
- [ ] Exceder tentativas de login
- [ ] Ver mensagem de rate limit no login
- [ ] Botao de login fica bloqueado
- [ ] Rate limit nao vaza stack trace ou erro interno
- [ ] Apos janela configurada, login volta a funcionar
- [ ] Exceder tentativas de cadastro
- [ ] Exceder tentativas de reenvio de verificacao
- [ ] Exceder tentativas de refresh, se aplicavel

## Refresh Token e Sessao
- [ ] Acessar rota privada com access token valido
- [ ] Expirar access token e confirmar tentativa de refresh automatico
- [ ] Confirmar que novo access token substitui o antigo
- [ ] Confirmar que refresh token antigo e revogado no banco
- [ ] Confirmar que refresh token novo e criado no banco
- [ ] Remover/invalidar refresh token e tentar acessar rota privada
- [ ] Usuario e redirecionado para login quando sessao expira
- [ ] Backend desligado durante refresh mostra erro amigavel quando aplicavel

## Logout
- [ ] Clicar em sair no dashboard
- [ ] Token local e removido
- [ ] Cookie de refresh token e limpo
- [ ] Refresh token e revogado no banco
- [ ] Usuario volta para login
- [ ] Tentar acessar dashboard apos logout

## Rotas Privadas
- [ ] Acessar `/dashboard` sem token
- [ ] Acessar `/calendario` sem token
- [ ] Acessar `/dia/:data` sem token
- [ ] Confirmar redirecionamento para login
- [ ] Acessar rotas privadas com token valido
- [ ] Acessar rotas privadas com token invalido
- [ ] Acessar rotas privadas com token expirado e refresh valido
- [ ] Acessar rotas privadas com token expirado e refresh invalido

## Dashboard
- [ ] Dashboard carrega tarefas de hoje
- [ ] Estado de loading aparece durante carregamento
- [ ] Estado vazio aparece quando nao ha tarefas
- [ ] Feedback de sucesso aparece apos acao bem-sucedida
- [ ] Feedback de erro aparece apos erro
- [ ] Feedback de sucesso some automaticamente
- [ ] Semana mostra dias corretos
- [ ] Clique em dia da semana abre pagina do dia
- [ ] Mini calendario abre calendario mensal

## Criacao de Tarefas
- [ ] Abrir modal de nova tarefa no dashboard
- [ ] Abrir modal de nova tarefa na pagina do dia
- [ ] Campo titulo recebe foco
- [ ] Tentar salvar sem titulo
- [ ] Tentar salvar sem data
- [ ] Criar tarefa valida sem hora
- [ ] Criar tarefa valida com hora
- [ ] Criar tarefa com descricao
- [ ] Confirmar tarefa criada no banco
- [ ] Confirmar tarefa aparece no dashboard quando for de hoje
- [ ] Confirmar tarefa aparece no calendario
- [ ] Confirmar modal fecha apos sucesso
- [ ] Confirmar formulario limpa apos criacao

## Validacao de Datas de Tarefas
- [ ] Input de data impede data fora do limite inferior
- [ ] Input de data impede data fora do limite superior
- [ ] Backend recusa data invalida mesmo se frontend for burlado
- [ ] Backend recusa formato de data invalido
- [ ] Backend recusa hora invalida
- [ ] Criar tarefa dentro do limite permitido
- [ ] Editar tarefa dentro do limite permitido
- [ ] Tentar acessar manualmente `/dia/:data` fora do limite e validar comportamento

## Edicao de Tarefas
- [ ] Abrir modal de edicao
- [ ] Campos aparecem preenchidos com dados da tarefa
- [ ] Alterar titulo
- [ ] Alterar descricao
- [ ] Alterar data
- [ ] Alterar hora
- [ ] Alterar status, se disponivel
- [ ] Salvar alteracoes
- [ ] Confirmar atualizacao na lista
- [ ] Confirmar atualizacao no banco
- [ ] Cancelar edicao sem alterar tarefa

## Conclusao de Tarefas
- [ ] Concluir tarefa pendente
- [ ] Status muda para concluida
- [ ] Botao de concluir desaparece ou fica indisponivel
- [ ] Progresso do dia atualiza
- [ ] Calendario reflete status correto
- [ ] Tentar concluir tarefa inexistente ou de outro usuario via API

## Exclusao de Tarefas
- [ ] Clicar em excluir tarefa
- [ ] ConfirmBox abre com titulo e mensagem corretos
- [ ] Cancelar exclusao
- [ ] Confirmar exclusao
- [ ] Tarefa some da lista
- [ ] Tarefa some do calendario
- [ ] Confirmar exclusao no banco
- [ ] Tentar excluir tarefa inexistente ou de outro usuario via API

## Rate Limit de Tarefas
- [ ] Exceder limite de criacao/edicao/conclusao/exclusao
- [ ] Ver mensagem de limite de alteracoes em tarefas
- [ ] Confirmar que GET de tarefas continua funcionando
- [ ] Confirmar que limite volta ao normal apos janela configurada

## Calendario
- [ ] Calendario mensal abre corretamente
- [ ] Mes e ano selecionados refletem mes visivel
- [ ] Trocar mes pelo select
- [ ] Trocar ano pelo select
- [ ] Navegar pelas setas do FullCalendar
- [ ] Eventos aparecem nos dias corretos
- [ ] Clique em dia abre `DayPage`
- [ ] Clique em evento abre `DayPage`
- [ ] Calendario respeita data minima baseada na criacao da conta
- [ ] Calendario respeita horizonte futuro configurado
- [ ] `validRange` impede navegacao visual fora do intervalo
- [ ] Estado vazio aparece quando nao ha tarefas no periodo
- [ ] Estado de erro aparece quando a API falha

## Pagina do Dia
- [ ] Abrir pagina do dia pelo dashboard
- [ ] Abrir pagina do dia pelo calendario
- [ ] Titulo mostra data correta
- [ ] Botao de voltar respeita origem
- [ ] Botao dia anterior funciona
- [ ] Botao proximo dia funciona
- [ ] Lista tarefas do dia correto
- [ ] Criar tarefa preenche data do dia aberto
- [ ] Editar tarefa do dia
- [ ] Concluir tarefa do dia
- [ ] Excluir tarefa do dia

## API e Seguranca Basica
- [ ] CORS permite origem local configurada
- [ ] CORS bloqueia origem nao permitida
- [ ] `helmet` adiciona headers de seguranca
- [ ] `errorMiddleware` mantem formato `{ error: { code, message } }`
- [ ] Erros esperados retornam mensagem especifica
- [ ] Erros inesperados em producao retornam mensagem generica
- [ ] Logs internos ainda mostram detalhes suficientes para debug
- [ ] `COOKIE_SECURE=false` em desenvolvimento
- [ ] `COOKIE_SECURE=true` validado em producao
- [ ] `FRONTEND_URL` usa HTTPS em producao
- [ ] `trust proxy` configurado apenas quando necessario para deploy

## Banco de Dados
- [ ] Usuarios tem `created_at` correto
- [ ] Usuarios tem `updated_at` correto
- [ ] Tarefas usam `usuario_id` correto
- [ ] Tarefas de um usuario nao aparecem para outro
- [ ] Refresh tokens sao gravados com hash
- [ ] Refresh tokens expirados nao renovam sessao
- [ ] Refresh tokens revogados nao renovam sessao

## Regressao Visual Basica
- [ ] Login sem quebras visuais
- [ ] Cadastro sem quebras visuais
- [ ] Validacao de email sem quebras visuais
- [ ] Dashboard sem sobreposicao de textos
- [ ] Modal de tarefa centralizado
- [ ] ConfirmBox centralizado
- [ ] Calendario sem quebras visuais
- [ ] Pagina do dia sem quebras visuais
- [ ] Layout funciona em largura desktop comum
- [ ] Layout funciona em largura mobile basica

## Observacoes Para Antes Do Deploy
- [ ] Rotacionar segredos finais antes de publicar
- [ ] Confirmar que nenhum `.env` real esta versionado
- [ ] Confirmar variaveis reais no provedor de deploy
- [ ] Confirmar `NODE_ENV=production`
- [ ] Confirmar `COOKIE_SECURE=true`
- [ ] Confirmar `FRONTEND_URL` exata do frontend publicado
- [ ] Confirmar politica de `sameSite` adequada ao dominio escolhido
- [ ] Confirmar `trust proxy` conforme provedor de deploy
