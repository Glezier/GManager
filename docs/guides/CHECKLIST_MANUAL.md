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

## Reenvio de Verificacao
- [x] Tentar reenviar email para usuario nao verificado
- [x] Confirmar mensagem de sucesso
- [x] Confirmar recebimento do novo email
- [x] Tentar reenviar para email inexistente
- [x] Tentar reenviar para usuario ja verificado
- [x] Testar rate limit do reenvio de verificacao

## Login
- [x] Login com email vazio
- [x] Login com senha vazia
- [x] Login com email invalido
- [x] Login com credenciais incorretas
- [x] Login com usuario nao verificado
- [x] Botao de reenviar verificacao aparece para usuario nao verificado
- [x] Login com usuario verificado e senha correta
- [x] Usuario autenticado vai para o dashboard
- [x] Token de acesso e salvo no frontend
- [x] Cookie de refresh token e criado
- [x] Botao de mostrar/ocultar senha funciona
- [x] Erro comum some ao clicar na tela
- [x] Backend desligado mostra erro amigavel de conexao

## Rate Limit de Autenticacao
- [x] Exceder tentativas de login
- [x] Ver mensagem de rate limit no login
- [x] Botao de login fica bloqueado
- [x] Rate limit nao vaza stack trace ou erro interno
- [x] Apos janela configurada, login volta a funcionar
- [x] Exceder tentativas de cadastro
- [x] Exceder tentativas de reenvio de verificacao
- [x] Exceder tentativas de refresh, se aplicavel

## Refresh Token e Sessao
- [x] Acessar rota privada com access token valido
- [x] Expirar access token e confirmar tentativa de refresh automatico
- [x] Confirmar que novo access token substitui o antigo
- [x] Confirmar que refresh token antigo e revogado no banco
- [x] Confirmar que refresh token novo e criado no banco
- [x] Remover/invalidar refresh token e tentar acessar rota privada
- [x] Usuario e redirecionado para login quando sessao expira
- [x] Backend desligado durante refresh mostra erro amigavel quando aplicavel

## Logout
- [x] Clicar em sair no dashboard
- [x] Token local e removido
- [x] Cookie de refresh token e limpo
- [x] Refresh token e revogado no banco
- [x] Usuario volta para login
- [x] Tentar acessar dashboard apos logout

## Rotas Privadas
- [x] Acessar `/dashboard` sem token
- [x] Acessar `/calendario` sem token
- [x] Acessar `/dia/:data` sem token
- [x] Confirmar redirecionamento para login
- [x] Acessar rotas privadas com token valido
- [x] Acessar rotas privadas com token invalido
- [x] Acessar rotas privadas com token expirado e refresh valido
- [x] Acessar rotas privadas com token expirado e refresh invalido

## Dashboard
- [x] Dashboard carrega tarefas de hoje
- [x] Estado de loading aparece durante carregamento
- [x] Estado vazio aparece quando nao ha tarefas
- [x] Feedback de sucesso aparece apos acao bem-sucedida
- [x] Feedback de erro aparece apos erro
- [x] Feedback de sucesso some automaticamente
- [x] Semana mostra dias corretos
- [x] Clique em dia da semana abre pagina do dia
- [x] Mini calendario abre calendario mensal

## Criacao de Tarefas
- [x] Abrir modal de nova tarefa no dashboard
- [x] Abrir modal de nova tarefa na pagina do dia
- [x] Campo titulo recebe foco
- [x] Tentar salvar sem titulo
- [x] Tentar salvar sem data
- [x] Criar tarefa valida sem hora
- [x] Criar tarefa valida com hora
- [x] Criar tarefa com descricao
- [x] Confirmar tarefa criada no banco
- [x] Confirmar tarefa aparece no dashboard quando for de hoje
- [x] Confirmar tarefa aparece no calendario
- [x] Confirmar modal fecha apos sucesso
- [x] Confirmar formulario limpa apos criacao

## Validacao de Datas de Tarefas
- [x] Input de data impede data fora do limite inferior
- [x] Input de data impede data fora do limite superior
- [x] Backend recusa data invalida mesmo se frontend for burlado
- [x] Backend recusa formato de data invalido
- [x] Backend recusa hora invalida
- [x] Criar tarefa dentro do limite permitido
- [x] Editar tarefa dentro do limite permitido
- [x] Tentar acessar manualmente `/dia/:data` fora do limite e validar comportamento

## Edicao de Tarefas
- [x] Abrir modal de edicao
- [x] Campos aparecem preenchidos com dados da tarefa
- [x] Alterar titulo
- [x] Alterar descricao
- [x] Alterar data
- [x] Alterar hora
- [x] Alterar status, se disponivel
- [x] Salvar alteracoes
- [x] Confirmar atualizacao na lista
- [x] Confirmar atualizacao no banco
- [x] Cancelar edicao sem alterar tarefa

## Conclusao de Tarefas
- [x] Concluir tarefa pendente
- [x] Status muda para concluida
- [x] Botao de concluir desaparece ou fica indisponivel
- [x] Progresso do dia atualiza
- [x] Calendario reflete status correto
- [x] Tentar concluir tarefa inexistente ou de outro usuario via API

## Exclusao de Tarefas
- [x] Clicar em excluir tarefa
- [x] ConfirmBox abre com titulo e mensagem corretos
- [x] Cancelar exclusao
- [x] Confirmar exclusao
- [x] Tarefa some da lista
- [x] Tarefa some do calendario
- [x] Confirmar exclusao no banco
- [x] Tentar excluir tarefa inexistente ou de outro usuario via API

## Rate Limit de Tarefas
- [x] Exceder limite de criacao/edicao/conclusao/exclusao
- [x] Ver mensagem de limite de alteracoes em tarefas
- [x] Confirmar que GET de tarefas continua funcionando
- [x] Confirmar que limite volta ao normal apos janela configurada

## Calendario
- [x] Calendario mensal abre corretamente
- [x] Mes e ano selecionados refletem mes visivel
- [x] Trocar mes pelo select
- [x] Trocar ano pelo select
- [x] Navegar pelas setas do FullCalendar
- [x] Eventos aparecem nos dias corretos
- [x] Clique em dia abre `DayPage`
- [x] Clique em evento abre `DayPage`
- [x] Calendario respeita data minima baseada na criacao da conta
- [x] Calendario respeita horizonte futuro configurado
- [x] `validRange` impede navegacao visual fora do intervalo
- [x] Estado vazio aparece quando nao ha tarefas no periodo
- [x] Estado de erro aparece quando a API falha

## Pagina do Dia
- [x] Abrir pagina do dia pelo dashboard
- [x] Abrir pagina do dia pelo calendario
- [x] Titulo mostra data correta
- [x] Botao de voltar respeita origem
- [x] Botao dia anterior funciona
- [x] Botao proximo dia funciona
- [x] Lista tarefas do dia correto
- [x] Criar tarefa preenche data do dia aberto
- [x] Editar tarefa do dia
- [x] Concluir tarefa do dia
- [x] Excluir tarefa do dia
- [x] Tarefas concluídas ao final da lista

## API e Seguranca Basica
- [x] CORS permite origem local configurada
- [x] CORS bloqueia origem nao permitida
- [x] `helmet` adiciona headers de seguranca
- [x] `errorMiddleware` mantem formato `{ error: { code, message } }`
- [x] Erros esperados retornam mensagem especifica
- [x] Erros inesperados em producao retornam mensagem generica
- [x] Logs internos ainda mostram detalhes suficientes para debug
- [x] `COOKIE_SECURE=false` em desenvolvimento
- [x] `COOKIE_SECURE=true` validado em producao
- [ ] `FRONTEND_URL` usa HTTPS em producao
- [x] `trust proxy` configurado apenas quando necessario para deploy

## Banco de Dados
- [x] Usuarios tem `created_at` correto
- [x] Usuarios tem `updated_at` correto
- [x] Tarefas usam `usuario_id` correto
- [x] Tarefas de um usuario nao aparecem para outro
- [x] Refresh tokens sao gravados com hash
- [x] Refresh tokens expirados nao renovam sessao
- [x] Refresh tokens revogados nao renovam sessao

## Regressao Visual Basica
- [x] Login sem quebras visuais
- [x] Cadastro sem quebras visuais
- [x] Validacao de email sem quebras visuais
- [x] Dashboard sem sobreposicao de textos
- [x] Modal de tarefa centralizado
- [x] ConfirmBox centralizado
- [x] Calendario sem quebras visuais
- [x] Pagina do dia sem quebras visuais
- [x] Layout funciona em largura desktop comum
- [x] Layout funciona em largura mobile basica

## Observacoes Para Antes Do Deploy
- [x] Rotacionar segredos finais antes de publicar
- [x] Confirmar que nenhum `.env` real esta versionado
- [x] Confirmar variaveis reais no provedor de deploy
- [x] Confirmar `NODE_ENV=production`
- [x] Confirmar `COOKIE_SECURE=true`
- [x] Confirmar `FRONTEND_URL` exata do frontend publicado
- [x] Confirmar politica de `sameSite` adequada ao dominio escolhido
- [x] Confirmar `trust proxy` conforme provedor de deploy