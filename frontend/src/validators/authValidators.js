import { VALIDATION_LIMITS, emailValido } from './validationRules'

export function validarCadastro({ nome, email, senha, confirmarSenha }){
    if (!nome.trim()){
        return 'Informe seu nome'
    }

    if (nome.trim().length > VALIDATION_LIMITS.nomeMax) {
        return `O nome deve ter no máximo ${VALIDATION_LIMITS.nomeMax} caracteres`
    }

    if (!email.trim()){
        return 'Informe seu email'
    }

    if (!emailValido(email)) {
        return 'Informe um email válido'
    }

    if (email.trim().length > VALIDATION_LIMITS.emailMax) {
        return `O email deve ter no máximo ${VALIDATION_LIMITS.emailMax} caracteres`
    }

    if (!senha.trim()){
        return 'Informe sua senha'
    }

    if (senha.length < VALIDATION_LIMITS.senhaMin){
        return `A senha deve ter pelo menos ${VALIDATION_LIMITS.senhaMin} caracteres`
    }

    if (senha.length > VALIDATION_LIMITS.senhaMax) {
        return `A senha deve ter no máximo ${VALIDATION_LIMITS.senhaMax} caracteres`
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

    if (!emailValido(email)) {
        return 'Informe um email válido'
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

    if (!emailValido(email)) {
        return 'Informe um email válido'
    }

    return null
}

export function validarRedefinicaoSenha({ senha, confirmarSenha }){
    if (!senha.trim()) {
        return 'Informe a nova senha'
    }

    if (senha.length < VALIDATION_LIMITS.senhaMin) {
        return `A senha deve ter pelo menos ${VALIDATION_LIMITS.senhaMin} caracteres`
    }

    if (senha.length > VALIDATION_LIMITS.senhaMax) {
        return `A senha deve ter no máximo ${VALIDATION_LIMITS.senhaMax} caracteres`
    }

    if (!confirmarSenha.trim()) {
        return 'Confirme a nova senha'
    }

    if (senha !== confirmarSenha) {
        return 'As senhas não coincidem'
    }

    return null
}
