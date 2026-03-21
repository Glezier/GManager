import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarTarefas } from '../api/api'


export default function Calendar(){
    const [tarefas, setTarefas] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""

    useEffect(() => {
        async function carregar() {
            try{
                const data = await listarTarefas(token)
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

        carregar()
    },[token, navigate])

    const eventos = useMemo( ()=> {
        return tarefas.map((tarefas) => ({
            id: tarefas.id,
            titulo: tarefas.titulo,
            data: tarefas.data.toString().split("T")[0],
        }))
    }, [tarefas])

    function handleDate(info){
        navigate(`dia/${info.dateStr}`)
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
            />
        </main>
    )
}