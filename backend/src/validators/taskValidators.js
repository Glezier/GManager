const validator = require('validator')
const AppError = require("../utils/AppError")

exports.LIMITES_TAREFA = {
    titulo: 60,
    descricao: 120
}

exports.validateTitle = (title) => {
    if (title !== undefined){
        if(title !== null && title.trim()){
            if (title.trim().length > exports.LIMITES_TAREFA.titulo){
                throw new AppError(
                    `O título deve possuir no máximo ${exports.LIMITES_TAREFA.titulo} caracteres`,
                    400,
                    'VALIDATION_ERROR'
                )
            }
        return title.trim()
        }
    } 
    throw new AppError(
        'Título é obrigatório',
        400,
        'VALIDATION_ERROR'
    )
}

exports.validateDesc = (desc) => {
    if (desc !== undefined){
        if (desc !== null && desc.trim()){
            if (desc.trim().length > exports.LIMITES_TAREFA.descricao){
                throw new AppError(
                    `A descrição deve possuir no máximo ${exports.LIMITES_TAREFA.descricao} caracteres`,
                    400,
                    'VALIDATION_ERROR'
                )
            }
            return desc.trim()
        }
    }
    return null // Descrição é opcional
}

exports.validateStatus = (status) => {
    if (status !== null && status !== undefined){
        const validate = validator.isIn(status, ['pendente', 'concluida'])
        if (!validate){
            throw new AppError(
                'Status inválido',
                400,
                'VALIDATION_ERROR'
            )
        }
        return status
    }
    throw new AppError(
        'Status é obrigatório',
        400,
        'VALIDATION_ERROR'
    )
}


exports.validateDate = (date) => {
    if (date !== undefined){
        if (date !== null){
            const validate = validator.isDate(date, {
                format: 'YYYY-MM-DD',
                strictMode: true,
                delimiters: ['-'],
            })
            if (!validate){
                throw new AppError(
                    'A data deve estar no formato YYYY-MM-DD',
                    400,
                    'VALIDATION_ERROR'
                )
            }
            return date
        }
    }
    throw new AppError(
        'Data é obrigatória',
        400,
        'VALIDATION_ERROR'
    )
}

exports.validateTime = (time) => {
    if (time === undefined || time === ''){
        return null
    }

    const validate =  /^([01]\d|2[0-3]):([0-5]\d)$/.test(time)
    if (!validate){
        throw new AppError(
            'A hora deve estar no formato HH:MM',
            400,
            'VALIDATION_ERROR'
        )
    }
    return time
}
