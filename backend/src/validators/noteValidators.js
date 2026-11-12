const AppError = require("../utils/AppError")

exports.LIMITES_NOTA = {
    titulo: 150,
    conteudo: 20000
}

exports.validarTitulo = (titulo) => {
    if (titulo === undefined || titulo === null) {
        return null
    }

    if (typeof titulo !== 'string') {
        throw new AppError(
            'Título deve ser um texto',
            400,
            'VALIDATION_ERROR'
        )
    }

    const tituloNormalizado = titulo.trim()

    if (!tituloNormalizado) {
        return null
    }

    // Por conta de emojis que podem contar como mais de um caractere
    if ([...tituloNormalizado].length > exports.LIMITES_NOTA.titulo) {
        throw new AppError(
            `O título deve possuir no máximo ${exports.LIMITES_NOTA.titulo} caracteres`,
            400,
            'VALIDATION_ERROR'
        )
    }

    return tituloNormalizado
}

exports.validarConteudo = (conteudo) => {
    if (typeof conteudo !== 'string' || !conteudo.trim()) {
        throw new AppError(
            'Conteúdo é obrigatório e deve ser um texto',
            400,
            'VALIDATION_ERROR'
        )
    }

    if ([...conteudo].length > exports.LIMITES_NOTA.conteudo) {
        throw new AppError(
            `O conteúdo deve possuir no máximo ${exports.LIMITES_NOTA.conteudo} caracteres`,
            400,
            'VALIDATION_ERROR'
        )
    }

    return conteudo
}

exports.validarIdNota = (id) => {
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
        throw new AppError(
            'ID da nota inválido',
            400,
            'VALIDATION_ERROR'
        )
    }

    const idNumerico = Number(id)

    if (!Number.isSafeInteger(idNumerico) || idNumerico > 2147483647) {
        throw new AppError(
            'ID da nota inválido',
            400,
            'VALIDATION_ERROR'
        )
    }

    return idNumerico
}

exports.validarDadosNota = (dados) => {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new AppError(
            'Dados da nota inválidos',
            400,
            'VALIDATION_ERROR'
        )
    }

    return {
        titulo: exports.validarTitulo(dados.titulo),
        conteudo: exports.validarConteudo(dados.conteudo)
    }
}