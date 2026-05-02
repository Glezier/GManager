# Guia de Identidade Visual do GManager

Este documento define a direção visual do GManager para a próxima fase de refatoração de interface.

Ele não descreve um produto novo do zero. Ele existe para orientar a evolução do projeto atual, aproveitando a estética inspirada no conceito **Obsidian Emerald** e adaptando essa linguagem ao que já foi implementado em:

- `Dashboard`
- `DayPage`
- `Calendar`
- `Login`
- `Register`
- `TaskForm`
- `TaskCard`
- `DayTasksPanel`
- `ConfirmBox`
- `LoadingState`

## 1. Objetivo do guia

O objetivo é criar uma identidade visual mais madura, consistente e reutilizável para o GManager sem trocar a stack atual e sem abrir uma refatoração estrutural desnecessária.

Este guia deve ajudar a:

- padronizar cores, espaçamentos, bordas e sombras
- alinhar as telas principais a uma mesma linguagem visual
- reduzir CSS improvisado ou espalhado demais
- melhorar a percepção de produto real
- preparar o terreno para áreas futuras como notas e finanças

## 2. Direção visual

### Conceito

O GManager deve transmitir:

- foco
- organização
- clareza
- sofisticação discreta

A referência visual principal é uma interface escura, elegante e funcional, com contraste confortável e uso controlado de verde como cor de ação e progresso.

### Tradução para o GManager

Essa estética não deve virar um dashboard genérico de produtividade. Ela precisa ser adaptada ao fluxo real do projeto:

- tarefas por dia
- visão semanal
- calendário mensal
- formulários simples
- confirmação de ações destrutivas

O foco deve ser uma experiência de organização pessoal com aparência coesa, não apenas “bonita”.

## 3. Princípios visuais

### 3.1. Superfícies claras ou escuras, mas coerentes

O projeto precisa escolher uma direção principal por ciclo visual. Se a linguagem `Obsidian Emerald` for adotada, as telas principais devem migrar para uma base escura consistente em vez de misturar blocos claros e escuros sem critério.

### 3.2. Verde como accent, não como excesso

O verde esmeralda deve destacar:

- botões principais
- progresso
- estados positivos
- foco visual em ações relevantes

Ele não deve dominar o layout inteiro.

### 3.3. Profundidade suave

Cards, painéis e modais devem usar:

- leve separação de superfície
- bordas sutis
- sombras macias
- contraste claro entre fundo geral e conteúdo

### 3.4. Tipografia com hierarquia forte

Os títulos precisam parecer parte de um sistema.

O ideal é diferenciar bem:

- título de tela
- subtítulo de seção
- texto auxiliar
- feedback
- microcopy

### 3.5. Interface funcional antes de ornamental

Todo recurso visual precisa ajudar:

- leitura
- navegação
- escaneabilidade
- sensação de controle

## 4. Sistema visual base

## 4.1. Paleta sugerida

Esta paleta serve como ponto de partida para a refatoração. Pode ser ajustada, mas deve manter a lógica funcional.

### Fundo e superfícies

- `--bg-app: #0f1115`
- `--bg-app-alt: #141820`
- `--bg-surface: #171b22`
- `--bg-surface-elevated: #1d232c`
- `--bg-surface-soft: #222936`

### Texto

- `--text-primary: #f3f5f7`
- `--text-secondary: #c7ced6`
- `--text-muted: #8f99a6`

### Bordas e divisões

- `--border-subtle: #2b3442`
- `--border-strong: #3a4657`

### Accent e feedback

- `--accent-primary: #10b981`
- `--accent-primary-hover: #0ea371`
- `--accent-info: #38bdf8`
- `--accent-warning: #f59e0b`
- `--accent-danger: #ef4444`
- `--accent-success-soft: rgba(16, 185, 129, 0.14)`
- `--accent-danger-soft: rgba(239, 68, 68, 0.14)`

### Sombras

- `--shadow-soft: 0 12px 32px rgba(0, 0, 0, 0.22)`
- `--shadow-elevated: 0 20px 48px rgba(0, 0, 0, 0.28)`

## 4.2. Radius

- `--radius-panel: 24px`
- `--radius-card: 18px`
- `--radius-input: 14px`
- `--radius-button: 14px`
- `--radius-pill: 999px`

## 4.3. Espaçamento

- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 20px`
- `--space-6: 24px`
- `--space-7: 32px`
- `--space-8: 40px`

## 4.4. Tipografia

Sem trocar a stack agora, o projeto pode continuar simples, mas deve padronizar pesos e tamanhos.

### Hierarquia sugerida

- título principal de tela: `clamp(2.4rem, 4vw, 3.8rem)`
- título de painel: `1.5rem` a `2rem`
- subtítulo/eyebrow: `0.78rem` a `0.9rem`, caixa alta, espaçamento entre letras
- texto base: `0.95rem` a `1rem`
- texto auxiliar: `0.85rem` a `0.92rem`

### Fonte

Se houver decisão de evoluir tipografia depois, a recomendação é testar primeiro:

- `Inter`
- `Manrope`
- `Space Grotesk` para títulos, combinada com uma sans mais neutra no corpo

Por enquanto, a prioridade é consistência, não troca imediata.

## 5. Componentes-base do GManager

## 5.1. Painel

Usado em:

- blocos do `Dashboard`
- conteúdo principal da `DayPage`
- shell do `Calendar`

Características:

- superfície destacada
- borda sutil
- sombra suave
- padding confortável
- radius amplo

## 5.2. Botões

### Primário

Para ações principais:

- nova tarefa
- confirmar ação
- enviar formulário

### Secundário

Para navegação e ações neutras:

- voltar
- trocar período
- cancelar

### Danger

Para:

- excluir
- confirmar ação destrutiva

## 5.3. Inputs e selects

Todos os campos devem compartilhar:

- altura semelhante
- radius semelhante
- borda consistente
- contraste adequado
- foco visível

## 5.4. Feedback

Mensagens de:

- erro
- sucesso
- loading
- vazio

devem seguir um padrão visual comum em todas as telas.

## 5.5. Empty state

Os estados vazios devem parecer intencionais, não apenas “sem conteúdo”.

Todo empty state deve ter:

- um título curto
- uma frase orientando o próximo passo
- opcionalmente uma ação clara

## 5.6. Modais

Inclui:

- `TaskForm`
- `ConfirmBox`

Devem compartilhar:

- overlay consistente
- profundidade clara
- boa leitura
- hierarquia visual simples

## 6. Aplicação por tela

## 6.1. Dashboard

O dashboard é a referência principal da linguagem visual.

Ele deve definir:

- padrão de topbar
- padrão de painel
- padrão de progresso
- padrão de estado vazio
- padrão de cards interativos

O que vier depois deve se alinhar a ele.

## 6.2. DayPage

Objetivo:

- herdar a linguagem do dashboard
- parecer continuação natural do fluxo, não outra aplicação

Deve receber atenção em:

- topo da página
- hierarquia da data e navegação
- consistência do painel principal
- clareza do empty state

## 6.3. Calendar

O calendário hoje é funcional, mas precisa parecer parte do produto.

Ele deve ganhar:

- shell visual consistente
- toolbar com melhor presença
- melhor integração com o restante das telas
- estados visuais mais refinados

## 6.4. Login e Register

Já receberam avanço visual e devem servir como base para:

- consistência de input
- consistência de botão
- consistência de card
- reforço de branding

## 7. Regras para implementação

- não trocar a stack do projeto nesta fase
- não migrar para Tailwind apenas por estética
- não introduzir biblioteca de UI grande sem necessidade real
- priorizar refatoração incremental do CSS atual
- extrair padrões compartilhados quando a repetição for real
- manter foco em acessibilidade, contraste e legibilidade
- evitar efeitos visuais que prejudiquem clareza

## 8. Fora de escopo por agora

Os itens abaixo podem ser revisitados depois, mas não são prioridade para a refatoração atual:

- light mode
- troca de framework CSS
- redesign completo da arquitetura frontend
- biblioteca nova de estado global
- reconstrução do projeto do zero
- animações sofisticadas como prioridade

## 9. Ordem recomendada de refatoração visual

1. corrigir textos visíveis e inconsistências pequenas
2. alinhar `DayPage` ao nível visual do `Dashboard`
3. revisar visual do `Calendar`
4. consolidar base compartilhada de CSS
5. revisar detalhes de `TaskCard`, `TaskForm`, `ConfirmBox` e `LoadingState`
6. depois expandir a linguagem para futuras áreas como notas e finanças

## 10. Como usar este guia

Antes de mexer visualmente em uma tela, verificar:

- ela está coerente com a paleta?
- ela reutiliza os padrões existentes?
- ela conversa com `Dashboard`, `DayPage` e `Calendar`?
- ela melhora legibilidade e clareza?
- ela aproxima o projeto da identidade visual escolhida?

Se a resposta for não, a implementação precisa ser simplificada ou reorientada.
