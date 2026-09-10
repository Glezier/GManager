# Feature: App Mobile do My GManager

## Objetivo

Avaliar e planejar a evolucao do My GManager para uso confortavel em celular, com possibilidade real de publicacao futura na Google Play Store e na Apple App Store.

O objetivo principal nao e apenas "caber na tela", mas transformar a experiencia atual em algo que pareca natural no uso diario pelo celular: abrir rapido, navegar com o polegar, criar tarefas com poucos toques, consultar calendario sem friccao e manter sessao de forma confiavel.

## Estado atual do projeto

O projeto ja tem uma base favoravel para mobile:

- frontend em React + Vite
- rotas separadas com React Router
- API modularizada por dominio
- backend em Node.js + Express expondo JSON
- autenticacao com access token + refresh token em cookie httpOnly
- telas principais ja com breakpoints responsivos
- calendario com modo compacto para telas menores
- deploy web em producao

Isso significa que nao parece necessario recomecar o frontend agora. O caminho mais eficiente e evoluir a web app atual para uma experiencia mobile/PWA forte e, depois, decidir se ela sera empacotada como app ou reescrita parcialmente em tecnologia nativa.

## Caminhos possiveis

### Caminho 1: PWA mobile-first

Transformar a aplicacao web atual em uma Progressive Web App.

Envolve:

- melhorar layout mobile das telas existentes
- criar manifest da aplicacao
- adicionar icones em tamanhos corretos
- definir cor de tema e splash behavior
- adicionar service worker
- permitir instalacao pela tela inicial do celular
- melhorar navegacao mobile com barra inferior
- revisar formularios e modais para uso por toque
- validar comportamento em Android e iOS via navegador

Vantagens:

- menor custo tecnico
- reaproveita quase todo o projeto atual
- entrega valor rapido para uso pessoal
- permite testar a experiencia real antes de entrar nas lojas
- prepara parte do trabalho visual e de produto para qualquer caminho futuro

Limites:

- nao aparece diretamente na Play Store/App Store
- notificacoes e recursos nativos sao mais limitados, especialmente no iOS
- experiencia pode continuar parecendo web se o acabamento mobile nao for bem feito

### Caminho 2: Empacotar a web app com Capacitor

Usar uma camada como Capacitor para empacotar o frontend atual como aplicativo Android/iOS.

Envolve:

- manter React/Vite como base
- criar projetos Android e iOS gerados pelo Capacitor
- configurar package/bundle id
- configurar icones e splash screen nativos
- ajustar storage/autenticacao onde necessario
- configurar deep links para verificacao de email e reset de senha
- gerar builds Android e iOS
- testar em dispositivo real
- preparar publicacao nas lojas

Vantagens:

- reaproveita grande parte do frontend atual
- permite publicar nas lojas
- menor custo do que React Native do zero
- pode acessar recursos nativos com plugins

Riscos:

- alguns fluxos web podem precisar de adaptacao
- login com Google pode exigir configuracao nativa
- cookies e armazenamento de sessao precisam ser testados com cuidado
- a experiencia ainda depende da qualidade da UI web mobile

### Caminho 3: React Native / Expo

Criar um app mobile com interface nativa usando React Native, provavelmente com Expo.

Envolve:

- criar um novo frontend mobile
- reaproveitar a API backend atual
- recriar telas: login, cadastro, dashboard, calendario, dia, perfil
- implementar storage seguro de token
- configurar Google login mobile
- configurar deep links
- configurar notificacoes locais/push
- gerar builds para Android/iOS
- manter dois frontends: web e mobile

Vantagens:

- melhor experiencia nativa
- acesso mais natural a notificacoes, biometria, armazenamento seguro e integracoes do aparelho
- melhor caminho caso o app cresca muito como produto mobile

Riscos:

- mais tempo de desenvolvimento
- mais manutencao
- duplicacao de UI e regras do frontend
- maior complexidade para publicar e atualizar

## Recomendacao inicial

A melhor estrategia para o momento parece ser:

1. Preparar a web app como mobile-first/PWA.
2. Usar no celular por alguns dias ou semanas.
3. Ajustar pontos reais de uso.
4. Depois empacotar com Capacitor para Android/iOS se a experiencia estiver boa.
5. Avaliar React Native/Expo apenas se os limites do app empacotado ficarem claros.

Essa abordagem evita reescrever cedo demais e transforma o proprio uso pessoal em teste de produto.

## Status da implementacao

### Ja implementado

- Manifest PWA criado em `frontend/public/manifest.webmanifest`.
- Metatags mobile/PWA adicionadas em `frontend/index.html`.
- Icone principal reaproveitado em `frontend/public/icon_logo.png`.
- Service worker inicial criado em `frontend/public/sw.js`.
- Registro do service worker criado em `frontend/src/utils/registerServiceWorker.js`.
- Canal basico de mensagem do service worker criado em `frontend/src/utils/serviceWorkerMessages.js`.
- Service worker configurado para nao registrar em ambiente de desenvolvimento.
- Service worker validado em producao sem interferir no fluxo principal.
- Cache inicial limitado ao shell da aplicacao.
- Filtro preventivo para nao cachear rotas sensiveis como auth, tarefas e perfil quando estiverem na mesma origem.
- Icones PWA 192x192, 512x512, 1024x1024 e apple touch icon adicionados em `frontend/public/icons`.
- Manifest atualizado para usar os icones finais.
- Favicon e apple touch icon atualizados em `frontend/index.html`.
- Navegacao inferior mobile criada em `frontend/src/components/mobile/MobileNav.jsx`.
- Estilos da navegacao inferior criados em `frontend/src/components/mobile/MobileNav.css`.
- Navegacao inferior conectada em Dashboard, Calendar, DayPage e Profile.
- Botao central de nova tarefa abre o modal direto no Dashboard e no DayPage.
- Botao central vindo de Calendar/Profile navega para Dashboard solicitando abertura do modal.
- Estado ativo da navegacao considera Dashboard e rotas `/dia/:data` como area de tarefas.
- Ajuste de respiro inferior para a barra fixa em telas mobile.
- Dashboard mobile com topbar antiga escondida para reduzir navegacao duplicada.
- Formulario de tarefa ajustado como bottom sheet no mobile.
- ConfirmBox ajustado para uso mobile.
- Checklist mobile criado em `docs/CHECKLIST_MOBILE.md`.

### Ainda falta para encerrar a fase mobile/PWA inicial

- Validar visualmente as telas principais em larguras reais de celular.
- Testar a barra inferior em Dashboard, Calendar, DayPage e Profile.
- Testar o fluxo do botao `+` vindo de todas as telas.
- Validar instalacao em Android Chrome.
- Validar "Adicionar a Tela de Inicio" no iOS Safari.
- Corrigir ambiente local de build, pois o Vite atual exige Node 20.19+ ou 22.12+.
- Rodar build de producao apos ajuste do Node.
- Testar o deploy publicado em celular real.
- Marcar os itens validados em `docs/CHECKLIST_MOBILE.md`.

### Fora do escopo desta fase

- Publicacao na Play Store.
- Publicacao na App Store.
- Empacotamento com Capacitor.
- Notificacoes push.
- Offline completo com fila local e sincronizacao.
- Login Google nativo para Android/iOS.
- Deep links nativos para verificacao de email e reset de senha.

## Escopo sugerido da primeira etapa

### Interface e experiencia mobile

- Criar uma navegacao inferior fixa para rotas principais:
  - Dashboard
  - Calendario
  - Perfil
  - Nova tarefa
- Reduzir elementos com cara de pagina desktop nas telas internas.
- Priorizar a tarefa do dia como primeira experiencia.
- Transformar o modal de tarefa em bottom sheet no mobile.
- Revisar tamanhos de botoes para toque confortavel.
- Garantir que inputs de data/hora sejam confortaveis no celular.
- Revisar textos longos em cards e botoes pequenos.
- Melhorar tela de carregamento de sessao em rotas privadas.

### PWA

- Criar `manifest.webmanifest`.
- Adicionar icones:
  - 192x192
  - 512x512
  - mascara/adaptive quando fizer sentido
  - apple touch icon
- Adicionar `theme-color`.
- Adicionar metadados para iOS:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-title`
  - `apple-mobile-web-app-status-bar-style`
- Criar service worker.
- Definir estrategia de cache:
  - assets estaticos
  - shell da aplicacao
  - evitar cache indevido de dados privados
- Validar instalacao em Android Chrome.
- Validar comportamento em iPhone Safari.

### Qualidade

- Criar checklist manual mobile.
- Testar larguras:
  - 360px
  - 390px
  - 430px
  - tablet pequeno
- Testar:
  - login
  - refresh de sessao
  - criar tarefa
  - editar tarefa
  - concluir tarefa
  - excluir tarefa
  - calendario
  - pagina do dia
  - perfil
  - troca de tema
  - exportacao por WhatsApp/PDF

## Pontos tecnicos importantes

### Autenticacao

Hoje o frontend salva o access token em `localStorage` e usa refresh token em cookie `httpOnly`.

Para PWA, esse fluxo pode continuar funcionando, desde que:

- HTTPS esteja correto em producao
- CORS esteja configurado para o dominio real
- cookie seguro esteja ativo em producao
- refresh token funcione em navegador mobile

Para app empacotado ou nativo, sera necessario validar:

- suporte a cookies no WebView/app
- armazenamento seguro de access token
- renovacao de sessao
- logout
- troca de senha revogando tokens
- deep links de email/reset

### Google Login

O login Google atual usa biblioteca web. Em app publicado nas lojas, pode ser necessario configurar clientes OAuth separados para Android e iOS.

Pontos a avaliar:

- package name Android
- SHA-1/SHA-256 do app
- bundle id iOS
- URL schemes/deep links
- fluxo de retorno para o app

### Notificacoes

Notificacoes nao precisam entrar na primeira etapa, mas fazem muito sentido para o produto.

Possiveis tipos:

- lembrete de tarefa com hora definida
- resumo do dia pela manha
- tarefas pendentes no fim do dia
- lembretes recorrentes quando recorrencia existir

Para PWA, notificacoes precisam ser avaliadas por plataforma. Para app nativo/Capacitor, o caminho costuma ser mais controlavel.

### Offline

Offline completo nao parece prioridade inicial, porque tarefas dependem de sincronizacao com backend.

Uma evolucao gradual seria:

1. app abre mesmo com conexao ruim
2. mostra ultimo estado carregado com aviso
3. permite criar tarefa offline em fila local
4. sincroniza depois

Essa etapa aumenta complexidade e deve vir depois da experiencia mobile basica.

## Requisitos para publicacao nas lojas

Observacao: regras de loja mudam com frequencia. Esta secao deve ser reconferida antes da publicacao.

### Google Play Store

Pontos atuais a considerar:

- A partir de 31/08/2026, novos apps e updates enviados ao Google Play precisam mirar Android 16/API 36 ou superior, salvo excecoes especificas.
- Novos apps na Play Store usam Android App Bundle e Play App Signing.
- O app precisa ser assinado com chave de upload.
- E preciso criar conta no Google Play Console.
- Sera necessario preparar ficha da loja:
  - nome do app
  - descricao curta
  - descricao completa
  - icone
  - screenshots
  - categoria
  - politica de privacidade
  - formulario de seguranca de dados
  - classificacao indicativa

Fontes oficiais para reconferir:

- Google Play target API: https://developer.android.com/google/play/requirements/target-sdk
- Android app signing: https://developer.android.com/studio/publish/app-signing
- Preparar app Android para release: https://developer.android.com/studio/publish/preparing

### Apple App Store

Pontos atuais a considerar:

- Apps enviados ao App Store Connect precisam seguir os requisitos de SDK vigentes da Apple.
- Segundo pagina oficial de submissao da Apple, a partir de 28/04/2026 apps iOS/iPadOS enviados precisam ser criados com iOS & iPadOS 26 SDK ou posterior.
- E preciso ter conta no Apple Developer Program.
- O app passa por revisao humana.
- A Apple costuma ser mais rigorosa com qualidade, privacidade, login, pagamentos e apps que parecem apenas um site embrulhado.
- Sera necessario preparar:
  - bundle id
  - certificados/profiles
  - icone
  - screenshots
  - descricao
  - categoria
  - politica de privacidade
  - detalhes de privacidade do app
  - informacoes de login de teste, se o app exigir conta

Fontes oficiais para reconferir:

- Submissao App Store: https://developer.apple.com/app-store/submitting/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Riscos e cuidados

- Publicar cedo demais pode gerar retrabalho se a experiencia mobile ainda parecer web.
- Login Google e refresh token precisam ser testados em dispositivo real.
- App Store pode questionar apps que sao apenas websites empacotados sem experiencia adequada.
- Notificacoes, offline e deep links aumentam bastante o escopo.
- Manter web e app nativo separados pode dobrar trabalho de UI.
- Antes de publicar, e importante ter politica de privacidade clara por causa de dados de conta, tarefas e possiveis financas futuras.

## Plano sugerido

### Fase 1: Preparacao mobile web

- [x] Criar barra inferior mobile.
- [x] Conectar barra inferior nas telas privadas principais.
- [x] Ajustar modal de tarefas como bottom sheet.
- [x] Ajustar ConfirmBox para mobile.
- [x] Criar checklist manual mobile.
- [ ] Revisar UI mobile das telas principais em navegador.
- [ ] Corrigir build local e ambiente Node.
- [ ] Validar em celular real.

### Fase 2: PWA instalavel

- [x] Criar manifest.
- [x] Adicionar metatags mobile/iOS.
- [x] Configurar service worker inicial.
- [x] Criar canal basico de atualizacao do service worker.
- [x] Criar icones nos tamanhos recomendados.
- [ ] Testar instalacao e sessao em Android/iOS.

### Fase 3: Preparacao para loja

- [ ] Avaliar Capacitor.
- [ ] Gerar build Android de teste.
- [ ] Validar login, tarefas, calendario e refresh token em aparelho real.
- [ ] Resolver deep links.
- [ ] Criar politica de privacidade.
- [ ] Preparar assets de loja.

### Fase 4: Publicacao Android

- [ ] Criar app no Play Console.
- [ ] Configurar assinatura.
- [ ] Gerar AAB.
- [ ] Preencher ficha da loja.
- [ ] Publicar em teste interno.
- [ ] Testar instalacao via Play Store.
- [ ] Promover para producao quando estiver estavel.

### Fase 5: Publicacao iOS

- [ ] Configurar Apple Developer.
- [ ] Gerar app iOS.
- [ ] Testar em dispositivo real/TestFlight.
- [ ] Preencher App Store Connect.
- [ ] Enviar para review.
- [ ] Ajustar eventuais pontos levantados pela revisao.

## Decisao recomendada agora

Comecar pela Fase 1 e Fase 2.

So depois de usar o app instalado como PWA e validar a experiencia mobile real vale decidir entre:

- publicar uma versao empacotada com Capacitor
- ou criar um app React Native/Expo

Para o estado atual do My GManager, a rota PWA -> Capacitor parece o melhor equilibrio entre velocidade, aprendizado e chance real de publicacao.
