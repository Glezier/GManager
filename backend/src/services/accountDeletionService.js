const AppError = require('../utils/AppError')
const userRepository = require('../repositories/userRepository')
const accountDeletionRepository = require('../repositories/accountDeletionRepository')

const { gerarTokenExclusao, gerarHashTokenExclusao, gerarExpiracaoExclusao } = require('../utils/AccountDeletion')
const { enviarEmailExclusaoConta } = require('../utils/EmailService')

exports.solicitarExclusao = async (usuarioId) => {
    const usuario = await userRepository.findPublicById(usuarioId)

    if (!usuario) {
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }

    const token = gerarTokenExclusao()
    const tokenHash = gerarHashTokenExclusao(token)
    const expiresAt = gerarExpiracaoExclusao()

    await accountDeletionRepository.registrarSolicitacao( usuario.id, usuario.email, tokenHash, expiresAt )

    try {
        await enviarEmailExclusaoConta({
            email: usuario.email,
            token
        })
    } catch (error) {
        try {
            await accountDeletionRepository.removerSolicitacaoPorToken(
                usuario.id,
                tokenHash
            )
        } catch {
            console.error('Falha ao limpar solicitação de exclusão de conta')
        }

        throw error
    }

    return {
        message: 'Enviamos um link de confirmação para o email da sua conta.'
    }
}