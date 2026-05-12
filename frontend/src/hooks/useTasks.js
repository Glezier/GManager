import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { criarTarefa, deletarTarefa, concluirTarefa, atualizarTarefa, isAuthError } from '../api/api'
import { getDataLimiteAnos, getDataMinimaAnos } from '../utils/date'
import { useTarefas } from './useTarefas'
import { removeToken } from '../utils/auth'

export default function useTasks({token, inicio, fim, navigate, enabled = true}){
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

    const queryClient = useQueryClient()

    const {
        data: tarefas = [],
        isLoading,
        isFetching,
        error: erroBusca,
        refetch
    } = useTarefas({ token, inicio, fim, enabled})

    const loading = isLoading || isFetching
    const erroBuscaMensagem = erroBusca?.message || ''
    const erroPaginaExibido = erroPagina || erroBuscaMensagem

    async function carregarTarefas() {
        setErroPagina('')
        return refetch()
    }

    useEffect(() => {
        if (!enabled){
            return
        }

        if (!token){
            navigate('/')
            return
        }

        if (!erroBuscaMensagem){
            return
        }

        if(
            erroBuscaMensagem === 'Sessão expirada. Faça login novamente.' ||
            isAuthError(erroBuscaMensagem)
        ){
            removeToken()
            navigate('/')
        }
    }, [token, erroBuscaMensagem, navigate])

    async function salvarTarefa(tarefa){
        try{
            setErroForm('')
            setSucesso('')

            const dataMinima = getDataMinimaAnos(1)
            const dataMaxima = getDataLimiteAnos(3)

            if (tarefa.data < dataMinima){
                setErroForm('Só é permitido adicionar tarefa retroativas num período de até 1 ano.')
                return
            }

            if (tarefa.data > dataMaxima){
                setErroForm('Use a aba de tarefas sem data definida para datas distantes.')
                return
            }

            if (editando){
                await atualizarTarefa(editando.id, tarefa)
                setSucesso("Tarefa atualizada com sucesso")
            } else{
                await criarTarefa(tarefa)
                setSucesso("Tarefa cadastrada com sucesso")
            }

            setAddTarefa(false)
            setEditando(null)
            await queryClient.invalidateQueries({ queryKey: ['tarefas']})
            
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
            await queryClient.invalidateQueries({ queryKey: ['tarefas']})

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
            await queryClient.invalidateQueries({ queryKey: ['tarefas']})
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
        erroPagina: erroPaginaExibido,
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
