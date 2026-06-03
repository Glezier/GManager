const userRepository = require("../repositories/userRepository")
const emailVerificationRepository = require("../repositories/emailVerificationRepository")
const emailVerificationService = require("../services/emailVerificationService")

// Verificação de email
exports.verificarEmail = async(req, res, next) => {
    try{
        const {token} = req.query

        if (!token){
            return next(new AppError(
                'Token de verificação não informado',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const tokenHash = gerarHashToken(token)

        // Busca token não usado nem expirado
        const tokenData = await emailVerificationRepository.getToken(tokenHash)

        if (tokenData == null){
            return next(new AppError(
                'Token inválido ou expirado',
                400,
                'INVALID_TOKEN'
            ))
        }

        // Verifica o tipo de email (cadastro ou mudança)
        // Mudança de email
        if (tokenData.tipo === 'troca-email') {
            const emailExist = await userRepository.findByEmailExceptUser(tokenData.novo_email, tokenData.usuario_id)

            if (emailExist) {
                return next(new AppError(
                    'Este email já está em uso',
                    400,
                    'EMAIL_ALREADY_EXISTS'
                ))
            }

            // Registra o novo email no banco
            await userRepository.setNovoEmailVerificado(tokenData.usuario_id, tokenData.novo_email)

        } else { // Cadastro inicial de email 
            await userRepository.setEmailVerificado(tokenData.usuario_id)
        }

        // Atualiza token para usado
        await emailVerificationRepository.setTokenEmailUsado(tokenData.id)

        res.json({
            message: 'Email verificado com sucesso'
        })

    } catch(error){
        next(error)
    }
}

// Reenviar email de verificação
exports.reenviarVerificacao = async(req,res,next) => {
    try{
        const { email } = req.body

        if(!email){
            return next(new AppError(
                'Email é obrigatório',
                400,
                'VALIDATION_ERROR'
            ))
        }

        if(!isValidEmail(email)){
            return next(new AppError(
                'Email inválido',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const emailCorrigido = email.trim().toLowerCase()

        if (emailCorrigido.length > LIMITES_USUARIO.email){
            return next(new AppError(
                `O email deve possuir no máximo ${LIMITES_USUARIO.email} caracteres`,
                400,
                'VALIDATION_ERROR'
            ))
        }

        const result = await pool.query(
            `SELECT id, nome, email, email_verificado
            FROM usuarios
            WHERE email = $1`,
            [emailCorrigido]
        )

        if (result.rows.length === 0){
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        const usuario = result.rows[0]

        if (usuario.email_verificado){
            return next(new AppError(
                'Este email já foi verificado',
                400,
                'EMAIL_ALREADY_VERIFIED'
            ))
        }

        const tokenEmail = gerarTokenEmail()
        const tokenHash = gerarHashToken(tokenEmail)

        await pool.query(
            `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' + INTERVAL '10 minutes')`,
            [usuario.id, tokenHash]
        )

        await enviarEmailVerificacao({
            email: usuario.email,
            nome: usuario.nome,
            token: tokenEmail,
            motivo: "cadastro"
        })

        res.json({message: 'Um novo email de verificação foi enviado'})
    } catch(error){
        next(error)
    }
}