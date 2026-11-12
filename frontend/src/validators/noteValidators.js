export const LIMITES_NOTA = {
    titulo: 150,
    conteudo: 20000,
    quantidade: 20
}

export function validarNota({ titulo, conteudo }) {
    if (typeof titulo !== 'string') {
        return 'O título deve ser um texto'
    }

    if ([...titulo.trim()].length > LIMITES_NOTA.titulo) {
        return `O título deve ter no máximo ${LIMITES_NOTA.titulo} caracteres`
    }

    if (typeof conteudo !== 'string' || !conteudo.trim()) {
        return 'Escreva o conteúdo da nota'
    }

    if ([...conteudo].length > LIMITES_NOTA.conteudo) {
        return `O conteúdo deve ter no máximo ${LIMITES_NOTA.conteudo} caracteres`
    }

    return null
}