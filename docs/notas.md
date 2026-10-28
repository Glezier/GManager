# Sistema de notas

## Escopo inicial
- Notas independentes, inspiradas na experiência do Samsung Notes.
- Criar, visualizar, editar e excluir várias notas por usuário.
- Título opcional; exibir “Sem título” quando vazio.
- Conteúdo em texto simples, preservando espaços e quebras de linha.
- Página privada `/notas`, com cartões contendo título, prévia e última alteração.
- Dashboard com notas recentes, “Nova nota” e “Ver todas”.
- Acesso pela navegação desktop e mobile.
- Botão “Salvar” e aviso ao sair com alterações pendentes.

## Modelo de dados
Tabela `notas` já criada:

| Campo | Regra |
|---|---|
| `id` | Chave primária |
| `usuario_id` | Chave estrangeira para `usuarios.id` |
| `titulo` | Opcional |
| `conteudo` | Obrigatório, com algum caractere visível |
| `created_at` | Data de criação |
| `updated_at` | Atualizado a cada edição |

## Regras
- Notas são independentes de tarefas: sem data obrigatória, status ou limite diário de tarefas.
- Obter o usuário por `req.userId`, nunca pelo corpo da requisição.
- Consultar, editar e excluir sempre filtrando por nota e usuário autenticado.
- Validar tipos antes de usar `.trim()`; não remover a formatação do conteúdo salvo.
- Definir limites de tamanho coerentes no frontend, backend e banco.
- Listar por `updated_at DESC, id DESC`.
- Confirmar exclusão e apresentar estados de carregamento, erro e lista vazia.
- Compartilhar dados entre página e dashboard via React Query.
- Seguir os tokens de tema e ajustar a navegação mobile.
- A primeira versão depende de conexão para salvar; o service worker atual não salva notas offline.

## Organização
- Backend: `notasRoutes.js` → `notasController.js` → `noteService.js` → `noteRepository.js`.
- Validações do backend: `noteValidators.js`.
- Frontend: `notesApi.js`, `useNotas.js`, `Notes.jsx` e `Notes.css`.
- Componentes reutilizáveis: `notes/NoteCard.jsx` e `notes/NoteForm.jsx`.
- Reutilizar `fetchAutenticado`, `PrivateRoute`, `ConfirmBox` e `LoadingState`.
- Controllers cuidam de HTTP; services, das regras; repositories, do SQL.

## Sequência de implementação
1. Definir limites e criar a tabela com alteração de banco versionada.
2. Implementar repository, validators e service.
3. Implementar controller e rotas autenticadas em `/notas`.
4. Validar CRUD, entradas inválidas e isolamento entre duas contas.
5. Implementar API frontend, hook, página e editor.
6. Integrar dashboard e navegação desktop/mobile.
7. Verificar temas, alterações pendentes, falhas de conexão e executar lint.

## Evoluções futuras
Pastas, formatação rica, imagens, escrita à mão, salvamento automático e suporte offline.

## Acordo de trabalho
Orientar e revisar a implementação. Alterar código somente mediante solicitação expressa.