import { VALIDATION_LIMITS, emailValido } from './validationRules'

export function validarNomePerfil({ nome }) {
    if (!nome.trim()) {
        return 'Informe seu nome'
    }

    if (nome.trim().length > VALIDATION_LIMITS.nomeMax) {
        return `O nome deve ter no máximo ${VALIDATION_LIMITS.nomeMax} caracteres`
    }

    return null
}

export function validarEmailPerfil({ email, senha }) {
    if (!email.trim()) {
        return 'Informe seu email'
    }

    if (!emailValido(email)) {
        return 'Informe um email válido'
    }

    if (email.trim().length > VALIDATION_LIMITS.emailMax) {
        return `O email deve ter no máximo ${VALIDATION_LIMITS.emailMax} caracteres`
    }

    if (!senha.trim()) {
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

    if (novaSenha.length < VALIDATION_LIMITS.senhaMin) {
        return `A nova senha deve ter pelo menos ${VALIDATION_LIMITS.senhaMin} caracteres`
    }

    if (novaSenha.length > VALIDATION_LIMITS.senhaMax) {
        return `A nova senha deve possuir no máximo ${VALIDATION_LIMITS.senhaMax} caracteres`
    }

    if (!confirmarSenha.trim()) {
        return 'Confirme a nova senha'
    }

    if (novaSenha !== confirmarSenha) {
        return 'As senhas não coincidem'
    }

    if (senhaAtual === novaSenha) {
        return 'A nova senha deve ser diferente da senha atual'
    }

    return null
}
