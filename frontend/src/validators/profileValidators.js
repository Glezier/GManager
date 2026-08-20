export function validarNomePerfil({ nome }) {
    if (!nome.trim()) {
        return 'Informe seu nome'
    }

    return null
}

export function validarEmailPerfil({ email, senha }) {
    if (!email.trim()) {
        return 'Informe seu email'
    }

    if(!senha.trim()){
        return 'Informe sua senha atual'
    }

    return null
}

export function validarSenhaPerfil({ senhaAtual, novaSenha, confirmarSenha }) {
    if (!senhaAtual.trim()) {
        return 'Informe sua senha atual'
    }

    if (!novaSenha.trim()) {
        return 'Informe a nova senha'
    }

    if (novaSenha.length < 8) {
        return 'A nova senha deve ter pelo menos 8 caracteres'
    }

    if (novaSenha.length > 50) {
        return 'A nova senha deve possuir no máximo 50 caracteres'
    }

    if (!confirmarSenha.trim()) {
        return 'Confirme a nova senha'
    }

    if (novaSenha !== confirmarSenha) {
        return 'As senhas não coincidem'
    }

    if (senhaAtual === novaSenha) {
        return "A nova senha deve ser diferente da senha atual"
    }

    return null
}