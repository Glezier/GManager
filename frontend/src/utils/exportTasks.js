import { jsPDF } from 'jspdf'

function formatarDataExportacao(data){
    if (!data){
        return ''
    }

    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
}

function formatarLinhaTarefa(tarefa){
    const hora = tarefa.hora ? `[${tarefa.hora.slice(0, 5)}] ` : ''
    const descricao = tarefa.descricao ? ` - ${tarefa.descricao}` : ''

    return `- ${hora}${tarefa.titulo}${descricao}`
}

function formatarGrupo(titulo, tarefas){
    if (tarefas.length === 0){
        return [`${titulo}:`, '- Nenhuma tarefa']
    }

    return [
        `${titulo}:`,
        ...tarefas.map((t) => formatarLinhaTarefa(t))
    ]
}

export function formatarTarefasDoDiaParaTexto({ data, tarefas }){
    const dataFormatada = formatarDataExportacao(data)

    const tarefasPendentes = tarefas.filter((t) => t.status === "pendente")
    const tarefasConcluidas = tarefas.filter((t) => t.status === "concluida")

    const linhas = [
        `My GManager - Tarefas ${dataFormatada}`,
        `Total: ${tarefas.length}`,
        `Pendentes: ${tarefasPendentes.length}`,
        `Concluídas: ${tarefasConcluidas.length}`,
        '',
        ...formatarGrupo('Pendentes', tarefasPendentes),
        "",
        ...formatarGrupo("Concluídas", tarefasConcluidas),
        "",
        "Gerado por My GManager"
    ]

    return linhas.join('\n')
}

export function compartilharTextoWhatsapp(texto){
    // Tranformar o texto em formato seguro para enviar 
    const textoCodificado = encodeURIComponent(texto)
    const url = `https://wa.me/?text=${textoCodificado}`

    // Abre nova janela e sem enviar origem de acesso
    window.open(url, '_blank', 'noopener,noreferrer')
}

function escreverGrupoPdf({ pdf, titulo, tarefas, margemX, posicaoY }) {
    pdf.setTextColor(20)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.text(titulo, margemX, posicaoY)

    posicaoY += 7

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)

    if (tarefas.length === 0) {
        pdf.text('- Nenhuma tarefa', margemX, posicaoY)
        return posicaoY + 8
    }

    tarefas.forEach((tarefa) => {
        const hora = tarefa.hora ? `[${tarefa.hora.slice(0, 5)}] ` : ''
        const descricao = tarefa.descricao ? ` - ${tarefa.descricao}` : ''
        const linha = `- ${hora}${tarefa.titulo}${descricao}`

        const linhasQuebradas = pdf.splitTextToSize(linha, 178)

        pdf.text(linhasQuebradas, margemX, posicaoY)
        posicaoY += linhasQuebradas.length * 6

        if (posicaoY > 270) {
            pdf.addPage()
            posicaoY = 18
        }
    })

    return posicaoY + 4
}

export function baixarPdfTarefasDoDia({ data, tarefas }) {
    const dataFormatada = formatarDataExportacao(data)

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const margemX = 16
    let posicaoY = 18

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.text('My GManager', margemX, posicaoY)

    posicaoY += 9

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.text(`Tarefas ${dataFormatada}`, margemX, posicaoY)

    posicaoY += 10

    const tarefasPendentes = tarefas.filter((tarefa) => tarefa.status === 'pendente')
    const tarefasConcluidas = tarefas.filter((tarefa) => tarefa.status === 'concluida')

    posicaoY = escreverGrupoPdf({
        pdf,
        titulo: 'Pendentes',
        tarefas: tarefasPendentes,
        margemX,
        posicaoY
    })

    posicaoY += 4

    escreverGrupoPdf({
        pdf,
        titulo: 'Concluídas',
        tarefas: tarefasConcluidas,
        margemX,
        posicaoY
    })

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(120)
    pdf.text('Gerado pelo My GManager', margemX, 287)

    pdf.save(`tarefas-${data}.pdf`)
}
