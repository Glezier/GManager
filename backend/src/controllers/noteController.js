const noteService = require("../services/noteService")

exports.criarNota = async (req, res, next) => {
    try {
        const nota = await noteService.criarNota(req.userId, req.body)

        res.status(201).json(nota)
    } catch (error) {
        next(error)
    }
}

exports.listarNotas = async (req, res, next) => {
    try {
        const notas = await noteService.listarNotas(req.userId)

        res.json(notas)
    } catch (error) {
        next(error)
    }
}

exports.buscarNotaPorId = async (req, res, next) => {
    try {
        const nota = await noteService.buscarNotaPorId(
            req.userId,
            req.params.id
        )

        res.json(nota)
    } catch (error) {
        next(error)
    }
}

exports.atualizarNota = async (req, res, next) => {
    try {
        const nota = await noteService.atualizarNota(
            req.userId,
            req.params.id,
            req.body
        )

        res.json(nota)
    } catch (error) {
        next(error)
    }
}

exports.deletarNota = async (req, res, next) => {
    try {
        const resposta = await noteService.deletarNota(
            req.userId,
            req.params.id
        )

        res.json(resposta)
    } catch (error) {
        next(error)
    }
}