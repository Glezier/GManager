const AppError = require("../utils/AppError")
const noteRepository = require("../repositories/noteRepository")
const noteValidators = require("../validators/noteValidators")

const LIMITE_NOTAS_USUARIO = 20

function validarNota (nota) {
    if (!nota) {
        throw new AppError(
            'Nota não encontrada',
            404,
            'NOTE_NOT_FOUND'
        )
    }
}

exports.criarNota = async (usuarioId, dados) => {
    const nota = noteValidators.validarDadosNota(dados)

    const total = await noteRepository.contarNotasDoUsuario(usuarioId)

    if (total >= LIMITE_NOTAS_USUARIO) {
        throw new AppError(
            `Limite de ${LIMITE_NOTAS_USUARIO} notas atingido`,
            400,
            'NOTE_LIMIT_REACHED'
        )
    }

    return noteRepository.criarNota(
        usuarioId,
        nota.titulo,
        nota.conteudo
    )
}

exports.listarNotas = async (usuarioId) => {
    return noteRepository.listarNotas(usuarioId)
}

exports.buscarNotaPorId = async (usuarioId, id) => {
    const notaId = noteValidators.validarIdNota(id)

    const nota = await noteRepository.buscarNotaPorId(
        usuarioId,
        notaId
    )

    validarNota(nota)

    return nota
}

exports.atualizarNota = async (usuarioId, id, dados) => {
    const notaId = noteValidators.validarIdNota(id)
    const nota = noteValidators.validarDadosNota(dados)

    const notaAtualizada = await noteRepository.atualizarNota(
        usuarioId,
        notaId,
        nota.titulo,
        nota.conteudo
    )

    validarNota(notaAtualizada)

    return notaAtualizada
}

exports.deletarNota = async (usuarioId, id) => {
    const notaId = noteValidators.validarIdNota(id)

    const notaDeletada = await noteRepository.deletarNota(
        usuarioId,
        notaId
    )

    validarNota(notaDeletada)

    return {
        message: 'Nota excluída com sucesso'
    }
}