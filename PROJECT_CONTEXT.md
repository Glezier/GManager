# Projeto: Plataforma de Organização

## Visão do produto
Aplicação web de organização pessoal com foco em agenda, calendário e acompanhamento das tarefas do dia.

A proposta principal é simples e forte: ao entrar no app, o usuário deve enxergar rapidamente o que precisa fazer hoje, navegar pelo calendário com facilidade e gerenciar tarefas de qualquer data sem esforço.

Este projeto tem dois objetivos:
1. servir como produto real de uso pessoal
2. servir como projeto de aprendizado prático em desenvolvimento full-stack

## Stack atual
- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Autenticação: JWT

## Estado atual do projeto

### O que já existe
- cadastro de usuário
- login com JWT
- proteção básica de rotas privadas no frontend
- criação de tarefas
- listagem de tarefas por intervalo
- conclusão de tarefas
- exclusão de tarefas
- dashboard com tarefas do dia
- visão dos próximos dias
- calendário mensal
- página dedicada para um dia específico
- criação de tarefa a partir do dia selecionado

### O que já saiu do roadmap inicial
Estes pontos já deixaram de ser prioridade porque já existem em algum nível funcional:
- dashboard inicial mostrando tarefas do dia
- calendário mensal interativo
- criação de tarefas a partir do dia selecionado
- tarefas com data e hora
- mostrar tarefas do dia ao entrar no dashboard
- proteger rotas privadas no frontend
- construir componente de calendário
- navegar entre meses
- selecionar um dia
- exibir tarefas do dia selecionado
- destacar dias com tarefas
- visão semanal inicial

## Diagnóstico atual
O projeto já tem uma boa base funcional e um recorte de produto claro. O próximo passo mais importante não é adicionar várias features novas de uma vez, e sim consolidar a fundação da aplicação para que a evolução fique mais rápida, segura e organizada.

Hoje as maiores oportunidades estão em:
- tratamento de erros no frontend e backend
- padronização da comunicação com a API
- validação de entrada no backend
- remoção de duplicação de lógica no frontend
- organização melhor da arquitetura
- preparação do ambiente para deploy e manutenção
- evolução da UX das tarefas

## Direção do produto
O sistema deve evoluir para um organizador pessoal com:
- dashboard realmente útil no uso diário
- calendário agradável e fácil de navegar
- tarefas com edição, ordenação e filtros
- notas rápidas utilizáveis de verdade
- listas com checks para organização rápida
- experiência visual consistente
- base técnica confiável para crescer sem retrabalho

## Roadmap atualizado

### Fase 1: Base técnica e confiabilidade
Objetivo: estabilizar o projeto e remover fragilidades que hoje atrapalham evolução, debug e deploy.

- definir um padrão único de formatação e manipulação de datas para todo o projeto
- revisar formatação e consistência de datas
- corrigir inconsistências de nomenclatura e estrutura
- revisar encoding e padronização textual dos arquivos

### Fase 2: Organização do frontend
Objetivo: reduzir repetição e deixar a interface mais fácil de manter.

- criar hooks para autenticação e tarefas
- centralizar leitura e escrita de token
- melhorar o comportamento das rotas privadas para token inválido ou expirado
- extrair lógica repetida de carregamento, criação, exclusão e conclusão de tarefas
- padronizar estados de loading, erro e vazio
- organizar melhor navegação entre login, dashboard, calendário e página do dia

### Fase 3: Fluxo principal de tarefas
Objetivo: fechar o ciclo principal do produto com uma experiência mais completa.

- permitir edição de tarefa no frontend
- melhorar ordenação por horário
- permitir atualizar título, descrição, data, hora e status
- criar confirmação visual antes de excluir
- melhorar feedback após criar, concluir, editar ou remover tarefa
- exibir confirmações visuais de sucesso para ações como criar, concluir, editar e excluir tarefas
- preparar navegação entre dias de forma mais natural
- tornar a página do dia mais completa e agradável de usar

### Fase 4: UX e identidade visual
Objetivo: sair de uma interface funcional para uma interface agradável e consistente.

- estilizar login
- estilizar criar conta
- revisar todo o CSS com consistência visual
- aplicar identidade visual unificada
- melhorar layout geral do dashboard
- melhorar layout da página de dia
- tornar o calendário mais bonito e intuitivo
- adicionar estados vazios com mais contexto
- melhorar feedback visual para ações do usuário
- garantir boa experiência em mobile e desktop

### Fase 5: Evolução do calendário e do dashboard
Objetivo: transformar calendário e dashboard em ferramentas realmente centrais do produto.

- melhorar navegação de mês com setas e seleção mais refinada
- destacar hoje com mais clareza
- adicionar mini calendário no dashboard
- permitir navegação rápida entre datas
- melhorar resumo semanal
- tornar os itens da visão semanal clicáveis para abrir o dia correspondente
- exibir tarefas com mais contexto dentro da visão mensal

### Fase 6: Notas e organização pessoal
Objetivo: ampliar o projeto além de tarefas simples e aproximar do uso real diário.

- adicionar função de notas
- definir se notas serão gerais, por dia ou ambas
- integrar notas ao dashboard
- criar funcionalidade de lista com checks
- definir se a lista com checks será geral, por dia ou vinculada a notas
- permitir marcar e desmarcar itens com rapidez
- pensar em observações associadas às tarefas
- avaliar categorias e prioridade

### Fase 7: Backend maduro e persistência sustentável
Objetivo: preparar o projeto para crescer sem depender de ajustes manuais.

- separar responsabilidades em rotas, controllers, services e camada de acesso a dados
- reduzir SQL espalhado diretamente nos controllers
- criar migrations ou scripts versionados do banco
- documentar estrutura mínima do banco de forma reproduzível
- preparar base inicial de testes no backend
- preparar base inicial de testes no frontend

### Fase 8: Recursos avançados
Objetivo: expandir o produto depois que a base estiver confiável.

- criar uma aba de gestão de gastos
- registrar data da compra
- registrar forma de pagamento
- registrar valor da compra
- visualizar gastos por forma de pagamento
- visualizar gastos semanais
- visualizar gastos mensais
- avaliar filtros por período
- avaliar resumo financeiro simples no dashboard
- filtros por status
- filtros por data
- busca de tarefas
- categorias
- prioridade
- preparação para recorrência
- exportação em PDF
- exportação em imagem
- métricas simples de produtividade
- deploy da aplicação

## Ordem prática recomendada
Se a execução for seguir uma fila única, esta é a ordem mais saudável agora:

1. tratamento de erros e respostas da API
2. variáveis de ambiente e preparação de ambiente
3. validação de entrada no backend
4. hooks e organização do frontend
5. edição de tarefas
6. revisão visual de login, cadastro, dashboard e calendário
7. notas e listas com checks
8. migrations e testes
9. filtros, busca, categorias e prioridade
10. recursos avançados e deploy

## Próximos passos imediatos
O melhor foco agora é atacar primeiro o que melhora qualidade de base e destrava o restante.

### Sprint sugerida 1
- melhorar tratamento de erro no frontend
- padronizar respostas da API
- validar entrada no backend
- mover configurações para `.env`

### Sprint sugerida 2
- criar hooks
- reorganizar autenticação no frontend
- extrair fluxo de tarefas para camada reutilizável
- implementar edição de tarefa

### Sprint sugerida 3
- estilizar login
- estilizar criar conta
- revisar dashboard
- revisar calendário
- rever todo o CSS

### Sprint sugerida 4
- adicionar função de notas
- adicionar função de lista com checks
- adicionar mini calendário no dashboard
- melhorar navegação entre dias
- iniciar migrations e testes

## Forma de execução
Para seguir o roadmap com clareza:

- avançar item por item
- conversar antes de mudanças relevantes
- remover do roadmap os itens concluídos
- manter sempre visível qual é o próximo item da fila

### Item atual
- Fase 1: definir um padrão único de formatação e manipulação de datas para todo o projeto

## Critério de prioridade
Sempre priorizar nesta ordem:
1. corrigir fragilidade técnica
2. melhorar fluxo principal do usuário
3. reduzir repetição e dívida estrutural
4. melhorar UX e visual
5. adicionar novas funcionalidades
