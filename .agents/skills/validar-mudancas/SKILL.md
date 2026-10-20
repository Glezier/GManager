---
name: validar-mudancas
description: Validar implementações ou sugestões de código no GManager com os scripts e regras existentes, incluindo a investigação de diagnósticos do VS Code.
---

# Validar mudanças

Identifique arquivos afetados e seus consumidores, os `package.json` pertinentes e configurações de análise existentes. Quando disponíveis, consulte diagnósticos do editor e configurações de workspace e extensões para descobrir a origem dos avisos.

Use verificações proporcionais ao efeito da mudança:

- Frontend JavaScript e JSX: execute `npm run lint` em `frontend`, seguindo `frontend/eslint.config.js`, incluindo regras de React Hooks, React Refresh e variáveis não utilizadas.
- Mudanças que afetem compilação, imports ou integração do frontend: execute também `npm run build` em `frontend`.
- Backend JavaScript: use `node --check caminho/do/arquivo.js` nos arquivos afetados. Isso verifica sintaxe, não lógica, banco ou execução.
- O `npm test` atual do backend é um placeholder que falha; não o apresente como suíte de testes. Confira novamente os scripts caso o projeto tenha evoluído.
- CSS: procure um validador configurado antes de escolher comandos. Atualmente não há Stylelint versionado; lint de JavaScript e build não equivalem aos diagnósticos de CSS do VS Code. Faça a revisão visual pertinente.
- Apenas instruções e documentação: confira estrutura, caminhos, links e consistência. Para skills, use um validador de skills disponível. Não rode build da aplicação sem motivo.

Em fluxos funcionais, selecione cenários relevantes em `docs/guides/CHECKLIST_MANUAL.md`; para Android, consulte também `docs/CHECKLIST_MOBILE.md`. Respeite a autorização antes de testes que alterem dados ou enviem emails reais.

Para sugestões ainda não aplicadas, revise compatibilidade, imports e regras pertinentes antes de entregar. Não altere código apenas para testar uma sugestão sem autorização. Não declare que um trecho passou pelo lint sem análise pela ferramenta.

Não use `--fix`, desative regras ou instale validadores como parte implícita da conferência. Diferencie erros anteriores dos introduzidos pela mudança, sem corrigi-los fora do escopo.

Informe verificações executadas, resultados e pendências. Sem acesso ao VS Code, declare essa limitação. Se persistir um aviso exclusivo do editor, peça a mensagem e a origem exibidas no painel Problemas para reproduzi-lo.
