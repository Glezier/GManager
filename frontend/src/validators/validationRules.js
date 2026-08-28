export const VALIDATION_LIMITS = {
    nomeMax: 100,
    emailMax: 120,
    senhaMin: 8,
    senhaMax: 50,
    tituloMax: 60,
    descricaoMax: 120,
}

export function emailValido(email) {
    const emailCorrigido = email.trim()
    const arrobaIndex = emailCorrigido.indexOf('@')
    const ultimoArrobaIndex = emailCorrigido.lastIndexOf('@')
    const pontoIndex = emailCorrigido.lastIndexOf('.')

    if (emailCorrigido.includes(' ')) {
        return false
    }

    if (arrobaIndex <= 0 || arrobaIndex !== ultimoArrobaIndex) {
        return false
    }

    if (pontoIndex <= arrobaIndex + 1) {
        return false
    }

    return pontoIndex < emailCorrigido.length - 1
}
