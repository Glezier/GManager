# Orientações do GManager

Leia `docs/PROJECT_CONTEXT.md` antes de trabalhar para conhecer a stack, a arquitetura e o estado do projeto.

## Autorização e aprendizado

- O desenvolvedor estuda Ciência da Computação e usa este projeto para aprender. Explique o problema, o motivo da proposta e suas implicações antes de implementar.
- Altere arquivos somente quando houver autorização expressa do desenvolvedor para a tarefa. Pedidos de explicação, consulta, revisão ou sugestão não autorizam edição.
- Exceção: em uma tarefa de estilização solicitada, pode editar arquivos `.css` diretamente, dentro do escopo pedido. Isso não autoriza alterações em JSX, JavaScript, configurações ou outros arquivos.
- Uma autorização já concedida vale para os passos necessários dentro do escopo. Não peça confirmação repetidamente.
- Pode consultar arquivos, documentação pública e executar verificações locais sem edição. Correções automáticas, instalações e testes com efeitos externos devem respeitar a autorização da tarefa.
- Preserve alterações do desenvolvedor. Não faça commit, push ou deploy sem solicitação expressa.

## Qualidade e arquitetura

- Busque práticas profissionais: clareza, segurança, acessibilidade, contratos consistentes, testes proporcionais e mudanças fáceis de revisar.
- Explique os critérios e os custos das escolhas. Adote práticas de grandes equipes quando resolverem uma necessidade real, evitando complexidade apenas para imitar empresas maiores.
- Siga os padrões existentes: controllers tratam HTTP, services concentram regras de negócio, repositories contêm SQL e validators validam entradas.
- No frontend, aproveite componentes, hooks, funções de API e tokens existentes. Extraia abstrações quando houver repetição real.
- Consulte as versões instaladas e a documentação oficial antes de sugerir APIs ou configurações de serviços.

## Estilo e documentação

- Siga a identidade visual e os guias em `docs`, especialmente `docs/guides/Guia Style.md`. Use a skill `estilizar-gmanager` em tarefas visuais.
- Escreva comentários curtos, diretos e suficientes para explicar intenção, restrições ou decisões pouco evidentes. Evite narrar código óbvio ou comentar cada linha.
- Em código e documentos novos ou alterados, evite separadores decorativos como sequências de `=` ou `#`. Use títulos Markdown simples quando ajudarem a leitura.
- Não reformate documentos ou comentários fora do escopo apenas para aplicar essa regra.

## Verificação e encerramento

- Use a skill `validar-mudancas` ao revisar uma implementação ou preparar sugestões de código. Respeite as regras dos validadores existentes; não as desative para ocultar erros.
- Informe o que foi verificado, o resultado e as limitações. Não afirme que o VS Code está sem avisos sem ter acesso aos seus diagnósticos.
- Ao concluir uma feature ou um conjunto coerente de mudanças, sugira uma mensagem de commit no formato `tipo: descrição`, com descrição em inglês.
- Escolha o tipo pelo efeito da mudança: `feat` para funcionalidade, `fix` para correção, `refactor` para reorganização sem mudar comportamento, `style` para formatação sem efeito funcional, `docs` para documentação, `test` para testes e `chore` para manutenção e ferramentas. Mudança visual pode ser `feat` ou `fix`; não use `style` automaticamente por envolver CSS.
- Sugira o commit sem executá-lo. Se houver pendências, descreva-as antes de considerar o ciclo concluído.

## Skills do projeto

- `consultar-documentacao`: consultar fontes oficiais de OpenAI, Resend, Vercel e Neon.
- `estilizar-gmanager`: aplicar a identidade visual aos trabalhos de interface.
- `validar-mudancas`: verificar código e sugestões usando as ferramentas disponíveis no projeto.