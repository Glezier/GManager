import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarTarefas } from '../api/api'

function formatarDataLocal(data){
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const dia = String(data.getDate()).padStart(2, "0")

    return `${ano}-${mes}-${dia}`
}

export default function Calendar(){
    const [tarefas, setTarefas] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""
    const [periodo, setPeriodo] = useState({
        inicio: "",
        fim:""
    })

    useEffect(() => {
        async function carregar() {
            try{
                const data = await listarTarefas(token, periodo.inicio, periodo.fim)
                setTarefas(data)
            } catch (error){
                console.error(error)
                navigate("/")
            }
        }

        if(!token){
            navigate("/")
            return
        }

        if(!periodo.inicio || periodo.fim){
            return
        }

        carregar()
    },[token, navigate, periodo])

    const eventos = useMemo( ()=> {
        return tarefas.map((tarefas) => ({
            id: tarefas.id,
            tittle: tarefas.titulo,
            date: tarefas.data.toString().split("T")[0],
        }))
    }, [tarefas])

    function handleDate(info){
        navigate(`/dia/${info.dateStr}`)
    }

    return(
        <main style={{ margin: "35px"}}>
            <h1>
                Calendário
            </h1>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                locale='pt-br'
                events={eventos}
                dateClick={handleDate}
                dayMaxEvent={true}
                height="auto"
                datesSet={(info) => {
                    const inicio = formatarDataLocal(info.start)

                    const fimReal = new Date(info.end)
                    fimReal.setDate(fimReal.getDate() - 1)

                    const fim = formatarDataLocal(fimReal)

                    setPeriodo({ inicio, fim })
                }}
            />
        </main>
    )
}