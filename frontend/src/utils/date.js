// Formatar dias com 0 a esquerda quando necessário
export function padZero(valor){
    return String(valor).padStart(2, "0")
}

// Retorna a data em formato ISO com a data de hoje por padrão
export function getData(data = new Date()){
    const ano = data.getFullYear()
    const mes = padZero(data.getMonth()+1)
    const dia = padZero(data.getDate())

    return `${ano}-${mes}-${dia}`
}

// Formatar a data
export function formatarData(data) {
    if (data){
        return String(data).split("T")[0]
    }
    return ""
}

// Formatar hora
export function formatarHora(hora) {
    if (hora) {
        return String(hora).slice(0, 5)
    }
    return ""
}

// Data em formato BR
export function formatarDataBR(data) {
    const dataFormatada = formatarData(data)
    if (dataFormatada) {
        return new Date(`${dataFormatada}T00:00:00`).toLocaleDateString("pt-BR")
    }
    return ""
}

// Data BR completa
export function formatarDataCompletaBR(data) {
    const dataFormatada = formatarData(data)
    if (dataFormatada) {
        return new Date(`${dataFormatada}T00:00:00`).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }
    return ""
}