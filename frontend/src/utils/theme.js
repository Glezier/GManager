const TEMA_PADRAO = "dark"

export function temaValido(tema){
    if (tema === "dark" || tema === "light"){
        return true
    }
    return false
}

export function getTemaSalvo(){
    const tema = localStorage.getItem("tema")
    if (temaValido(tema)){
        return tema
    }
    return TEMA_PADRAO
}

export function aplicarTema(tema){
    const temaFinal = temaValido(tema) ? tema : TEMA_PADRAO
    document.documentElement.dataset.theme = temaFinal
} 

export function salvarTemaLocal(tema){
    const temaFinal = temaValido(tema) ? tema : TEMA_PADRAO
    localStorage.setItem("tema", temaFinal)
    aplicarTema(temaFinal)
}