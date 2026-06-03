const userValidators = require("./userValidators")
const AppError = require("../utils/AppError")

exports.validarRegistro = ({ nome, email, senha}) => {
    if (!nome || !email || !senha){
        throw new AppError("Todos os campos são obrigatórios", 400, "VALIDATION_ERROR")
    }

    const nomeCorrigido = userValidators.validarNome(nome)
    const emailCorrigido = userValidators.validarEmail(email)
    userValidators.validarSenha(senha)

    return { nomeCorrigido, emailCorrigido}
}

exports.validarLogin = ({ email, senha}) => {
    if (!email || !senha){
        throw new AppError("Email e senha são origatórios", 400, "VALIDATION_ERROR")
    }

    const emailCorrigido = userValidators.validarEmail(email)
    userValidators.validarSenha(senha)

    return { emailCorrigido }
}

exports.validarTrocaSenha = ({ senhaAtual, novaSenha, confirmarSenha }) => {
    if (!senhaAtual){
        throw new AppError("Senha atual é obrigatória", 400, "VALIDATION_ERROR")
    }

    userValidators.validarSenha(senhaAtual)
    userValidators.validarSenha(novaSenha)
    userValidators.confirmarSenha(novaSenha, confirmarSenha)
}

exports.validarTrocaEmail = ({ email, senhaAtual }) => {
    if (!email || !senhaAtual){
        throw new AppError("Novo email e senha atual são obrigatórios", 400, 'VALIDATION_ERROR')  
    }

    const emailCorrigido = userValidators.validarEmail(email)

    userValidators.validarSenha(senhaAtual)

    return {
        emailCorrigido
    }
}