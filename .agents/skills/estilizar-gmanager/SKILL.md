---
name: estilizar-gmanager
description: Orientar ou implementar mudanças de CSS, layout e aparência do GManager seguindo seus guias visuais e tokens existentes.
---

# Estilizar o GManager

Antes de propor ou editar, leia `docs/guides/Guia Style.md`, `frontend/src/styles/tokens.css`, `frontend/src/styles/base.css` e os arquivos da tela envolvida. Para finanças, leia também `docs/guides/FINANCES_STYLE_GUIDE_DARK.txt`. Consulte as referências em `docs/pages_infos` quando relevantes à tela.

Use a linguagem Obsidian Emerald: superfícies discretas, verde como destaque, hierarquia legível e efeitos que ajudem a interação. Reaproveite tokens e padrões existentes, sem copiar valores isolados de um guia antigo.

Os guias descrevem fases diferentes. Preserve os temas claro e escuro já implementados, mesmo quando um documento antigo tratar o modo claro como futuro. Se houver divergência que exija mudar a direção visual, apresente-a ao desenvolvedor.

Priorize ajustes incrementais de CSS. Não introduza frameworks, bibliotecas de UI ou uma reformulação geral como consequência de um pedido pontual.

A exceção de autorização do `AGENTS.md` permite editar somente `.css` dentro da tarefa visual solicitada. Se precisar alterar marcação, lógica ou outros arquivos, explique a necessidade e obtenha autorização caso ela ainda não exista.

Confira responsividade, legibilidade, foco de teclado, contraste e estados de interação pertinentes. Verifique os dois temas e os efeitos de seletores compartilhados. Se não puder conferir no navegador, indique os cenários de verificação manual pendentes.
