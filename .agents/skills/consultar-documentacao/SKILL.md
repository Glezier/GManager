---
name: consultar-documentacao
description: Consultar documentação oficial ao explicar, implementar ou depurar integrações com OpenAI, Resend, Vercel ou Neon no GManager.
---

# Consultar documentação

Identifique o serviço e a dúvida concreta. Para implementação, leia os arquivos relacionados e confira as versões em `package.json` e no lockfile quando necessário.

Use ferramentas de documentação disponíveis; na ausência delas, consulte a documentação pública pela web. Fontes iniciais:

- OpenAI: https://developers.openai.com/ e https://platform.openai.com/docs/; para Codex e ChatGPT, https://learn.chatgpt.com/.
- Resend: https://resend.com/docs/introduction.
- Vercel: https://vercel.com/docs.
- Neon: https://neon.com/docs/introduction.

Pesquise o assunto específico e abra a página que sustenta a resposta. Prefira referências compatíveis com a versão instalada. Diferencie limitações do serviço, requisitos de plano e decisões da aplicação.

Relacione a orientação à stack real: Express, `resend`, `pg` com PostgreSQL no Neon e configurações de deploy em `vercel.json`. Documentação disponível não significa integração OpenAI implementada.

Inclua links das páginas utilizadas e explique a consequência prática. Se não houver acesso à documentação, declare a limitação e o que precisa de confirmação.

Esta skill orienta consultas; não instala conectores, concede acesso a contas ou autoriza alterações em serviços. Nunca envie credenciais ou conteúdo de `.env` em buscas.
