export function validarCadastro({ nome, email, senha, confirmarSenha }){
    if (!nome.trim()){
        return 'Informe seu nome'
    }

    if (!email.trim()){
        return 'Informe seu email'
    }

    if (!senha.trim()){
        return 'Informe sua senha'
    }

    if (senha.length < 8){
        return 'A senha deve ter pelo menos 8 caracteres'
    }

    if (!confirmarSenha.trim()) {
        return 'Confirme sua senha'
    }

    if (senha !== confirmarSenha) {
        return 'As senhas devem ser iguais'
    }

    return null
}

export function validarLogin({ email, senha }){
    if (!email.trim()){
        return 'Informe seu email'
    }

    if (!senha.trim()){
        return 'Informe sua senha'
    }

    return null
}

export function validarRecuperacaoSenha({ email }){
    if (!email.trim()){
        return 'Informe seu email'
    }

    return null
}

export function validarRedefinicaoSenha({ senha, confirmarSenha }){
    if (!senha.trim()) {
        return 'Informe a nova senha'
    }

    if (senha.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres'
    }

    if (!confirmarSenha.trim()) {
        return 'Confirme a nova senha'
    }

    if (senha !== confirmarSenha) {
        return 'As senhas não coincidem'
    }

    return null
}