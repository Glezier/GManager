import { useState, useEffect, useCallback } from 'react'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa, atualizarTarefa} from '../api/api'
import { removeToken } from '../utils/auth'

export default function useTasks({token, inicio, fim, navigate}){
    const [tarefas, setTarefas] = useState([])
    const [loading, setLoading] = useState(true)
    const [erroPagina, setErroPagina] = useState("")
    const [erroForm, setErroForm] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [addTarefa, setAddTarefa] = useState(false)
    const [editando, setEditando] = useState(null)
    const [confirmacao, setConfirmacao] = useState({
        open: false,
        title: '',
        message: '',
        confirmLabel: 'Confirmar',
        cancelLabel: 'Cancelar',
        variant: 'danger',
        tarefa: null,
        loading: false
    })

    const carregarTarefas = useCallback(async () => {
         try {
            setErroPagina("")
            setLoading(true)

            const data = await listarTarefas(inicio, fim);
            setTarefas(data);
        } catch (error) {
            setErroPagina(error.message)
            if(error.message === 'Sessão expirada. Faça login novamente.'){
                removeToken()
                navigate("/")
            }            
        } finally{
            setLoading(false)
        }
    }, [ navigate, inicio, fim])

    async function salvarTarefa(tarefa){
        try{
            setErroForm('')
            setSucesso('')
            if (editando){
                await atualizarTarefa(editando.id, tarefa)
                setSucesso("Tarefa atualizada com sucesso")
            } else{
                await criarTarefa(tarefa)
                setSucesso("Tarefa cadastrada com sucesso")
            }

            setAddTarefa(false)
            setEditando(null)
            await carregarTarefas()
            
        }catch(error){
            setErroForm(error.message)
        }
    }

    function solicitarRemocao(tarefa) {
        setErroPagina('')
        setSucesso('')
        setConfirmacao({
            open: true,
            title: 'Excluir tarefa?',
            message: `Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"? Essa ação não poderá ser desfeita.`,
            confirmLabel: 'Excluir tarefa',
            cancelLabel: 'Cancelar',
            variant: 'danger',
            tarefa,
            loading: false,
        })
    }

    function fecharConfirmacao() {
        setConfirmacao((estadoAtual) => ({
            ...estadoAtual,
            open: false,
            loading: false,
            tarefa: null,
        }))
    }

    async function confirmarRemocao() {
        if (!confirmacao.tarefa) {
            return
        }

        try {
            setErroPagina('')
            setSucesso('')
            setConfirmacao((estadoAtual) => ({
                ...estadoAtual,
                loading: true,
            }))

            await deletarTarefa(confirmacao.tarefa.id)
            await carregarTarefas()

            setSucesso('Tarefa excluída com sucesso')
            fecharConfirmacao()
        } catch (error) {
            setErroPagina(error.message)
            setConfirmacao((estadoAtual) => ({
                ...estadoAtual,
                loading: false,
            }))
        }
    }


    async function finalizarTarefa(id){
        try{
            setErroPagina('')
            setSucesso('')
            await concluirTarefa(id)
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
        if (addTarefa || confirmacao.open) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }

        return () => {
          document.body.style.overflow = ''
        }
    }, [addTarefa, confirmacao.open])

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
        confirmacao,
        solicitarRemocao,
        confirmarRemocao,
        fecharConfirmacao,
        finalizarTarefa,
        abrirCriacao,
        abrirEdicao,
        fecharModal,
    }
}
