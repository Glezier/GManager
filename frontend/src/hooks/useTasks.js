import { useState, useEffect, useCallback } from 'react'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa, atualizarTarefa } from '../api/api'

export default function useTasks({token, inicio, fim, navigate}){
    const [tarefas, setTarefas] = useState([])
    const [loading, setLoading] = useState(true)
    const [erroPagina, setErroPagina] = useState("")
    const [erroForm, setErroForm] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [addTarefa, setAddTarefa] = useState(false)
    const [editando, setEditando] = useState(null)

    const carregarTarefas = useCallback(async () => {
         try {
            setErroPagina("")
            setLoading(true)

            const data = await listarTarefas(token, inicio, fim);
            setTarefas(data);
        } catch (error) {
            setErroPagina(error.message)
            if(
                error.message === "Token inválido" ||
                error.message === "Token não fornecido"
            ){
                localStorage.removeItem("token")
                navigate("/")
            }            
        } finally{
            setLoading(false)
        }
    }, [token, navigate, inicio, fim])

    async function salvarTarefa(tarefa){
        try{
            setErroForm('')
            setSucesso('')
            if (editando){
                await atualizarTarefa(token, editando.id, tarefa)
                setSucesso("Tarefa atualizada com sucesso")
            } else{
                await criarTarefa(token, tarefa)
                setSucesso("Tarefa cadastrada com sucesso")
            }

            setAddTarefa(false)
            setEditando(null)
            await carregarTarefas()
            
        }catch(error){
            setErroForm(error.message)
        }
    }

    async function removerTarefa(id){
        try{
            setErroPagina('')
            setSucesso('')

            await deletarTarefa(token, id)
            await carregarTarefas()
            setSucesso("Tarefa excluída com sucesso")
        }catch(error){
            setErroPagina(error.message)
        }
    }

    async function finalizarTarefa(id){
        try{
            setErroPagina('')
            setSucesso('')
            await concluirTarefa(token, id)
            await carregarTarefas()
            setSucesso("Tarefa concluída com sucesso")
        } catch(error){
            setErroPagina(error.message)
        }
    }
    
    function abrirCriacao(){
        setErroForm('')
        setEditando(null)
        setAddTarefa(true)
    }
    
    function abrirEdicao(tarefa){
        setErroForm('')
        setEditando(tarefa)
        setAddTarefa(true)
    }

    function fecharModal() {
        setErroForm('')
        setEditando(null)
        setAddTarefa(false)
    }

    useEffect(() => {
        if (!token){
            navigate('/')
            return
        }

        carregarTarefas()
    }, [token, navigate, carregarTarefas])

    useEffect(() => {
        if (sucesso){
            const timer = setTimeout(()=>{
                setSucesso('')
            },2500)
            return ()=>clearTimeout(timer)
        }
        return
    }, [sucesso])

    // Bloqueio do scroll ao adicionar tarefa
    useEffect(() => {
        if (addTarefa) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }

        return () => {
          document.body.style.overflow = ''
        }
    }, [addTarefa])

    return {
        tarefas,
        loading,
        erroPagina,
        erroForm,
        sucesso,
        addTarefa,
        setAddTarefa,
        editando,
        carregarTarefas,
        salvarTarefa,
        removerTarefa,
        finalizarTarefa,
        abrirCriacao,
        abrirEdicao,
        fecharModal,
    }
}