import { useMemo, useRef } from "react"
import { formatarDataCompletaBR, getData } from "../utils/date"
import './TaskScheduleDate.css'

function adicionarDias(dataBase, dias){
    const data = new Date(`${dataBase}T00:00:00`)
    data.setDate(data.getDate() + dias)
    return getData(data)
}

function abrir(ref){
    if (!ref.current){
        return
    }

    if (typeof ref.current.showPicker === 'function'){
        ref.current.showPicker()
        return
    }

    ref.current.click()
}

export default function TaskScheduleDate({
    data,
    hora,
    hoje,
    dataMinima,
    dataMaxima,
    onDataChange,
    onHoraChange,
}){
    const dataInputRef = useRef(null)
    const horaInputRef = useRef(null)

    const dataFormatada = formatarDataCompletaBR(data) || 'Escolha uma data'
    const horaFormatada = hora || 'Sem horário'

    return (
        <div className="task-schedule-picker">
            <div className="task-schedule-field">
                <span className="task-schedule-label">Data</span>

                <button
                    type="button"
                    className="task-schedule-display"
                    onClick={() => abrir(dataInputRef)}
                >
                    <span>{dataFormatada}</span>
                    <strong>Alterar</strong>
                </button>

                <input
                    ref={dataInputRef}
                    className="task-schedule-native"
                    type="date"
                    lang="pt-BR"
                    value={data}
                    min={dataMinima}
                    max={dataMaxima}
                    onChange={(event) => onDataChange(event.target.value)}
                    required
                />
            </div>

            <div className="task-schedule-field">
                <span className="task-schedule-label">Horário</span>

                <button
                    type="button"
                    className="task-schedule-display"
                    onClick={() => abrir(horaInputRef)}
                >
                    <span>{horaFormatada}</span>
                    <strong>{hora ? 'Alterar' : 'Definir'}</strong>
                </button>

                <input
                    ref={horaInputRef}
                    className="task-schedule-native"
                    type="time"
                    value={hora}
                    onChange={(event) => onHoraChange(event.target.value)}
                />
            </div>
        </div>
    )
}