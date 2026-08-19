const { Resend } =  require('resend')

// Cria cliente autenticado
const resend = new Resend(process.env.RESEND_API_KEY)

// Produz url de verificação
function getVerificationUrl(token){
    const frontendUrl = process.env.FRONTEND_URL
    return `${frontendUrl}/verificar-email?token=${token}`
}

// Envia email de verificação ao usuário
async function enviarEmailVerificacao({ email, nome, token, motivo = "cadastro"}){
    const verificationUrl = getVerificationUrl(token)
    const mensagemPrincipal = motivo === "troca-email" 
        ? "Você solicitou a troca de email de acesso ao My GManager." 
        : "Sua conta foi criada com sucesso no My GManager."

    return resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verifique seu email no My GManager',
        html: `
            <div style="margin: 0; padding: 32px 16px; background-color: #0f141b;">
                <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(180deg, #161d26 0%, #10161d 100%); border: 1px solid #253142; border-radius: 20px; padding: 40px 32px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28); font-family: Arial, sans-serif; color: #e8eef5; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #7f93a8; font-weight: 700;">
                        My GManager
                    </p>

                    <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2; color: #ffffff;">
                        Olá, ${nome}!
                    </h1>

                    <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.7; color: #c8d3df;">
                        ${mensagemPrincipal}
                    </p>
                    
                    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.7; color: #c8d3df;">
                        Clique no botão abaixo para verificar seu email.
                    </p>

                    <a
                        href="${verificationUrl}"
                        style="display: inline-block; padding: 14px 24px; background: #22c55e; color: #08110c; text-decoration: none; font-weight: 700; border-radius: 12px; font-size: 15px;"
                    >
                        Verificar email
                    </a>

                    <p style="margin: 28px 0 0; font-size: 14px; line-height: 1.7; color: #94a6b8;">
                        Este link de verificação expira em 10 minutos.
                    </p>

                    <p style="margin: 16px 0 0; font-size: 13px; line-height: 1.6; color: #6f8193;">
                        Se o botão não funcionar, copie e cole este link no navegador:
                    </p>

                    <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.6; word-break: break-word;">
                        <a href="${verificationUrl}" style="color: #7dd3fc; text-decoration: none;">
                            ${verificationUrl}
                        </a>
                    </p>
                </div>
            </div>
        `,
    })
}

async function enviarEmailRecuperacaoSenha({ email, nome, token }){
    const resetUrl = `${process.env.FRONTEND_URL}/resetar-senha?token=${token}`
    const minutosExpiracao = process.env.PASSWORD_RESET_EXPIRES_MINUTES || 15

    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Redefinição de senha - My Gmanager',
        html: `
            <div style="margin: 0; padding: 32px 16px; background-color: #0f141b;">
                <div style="max-width: 560px; margin: 0 auto; background: linear-gradient(180deg, #161d26 0%, #10161d 100%); border: 1px solid #253142; border-radius: 20px; padding: 40px 32px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28); font-family: Arial, sans-serif; color: #e8eef5; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #7f93a8; font-weight: 700;">
                        My GManager
                    </p>

                    <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2; color: #ffffff;">
                        Redefinição de senha
                    </h1>

                    <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.7; color: #c8d3df;">
                        Olá, ${nome}.
                    </p>

                    <p style="margin: 0 0 12px; font-size: 16px; line-height: 1.7; color: #c8d3df;">
                        Recebemos uma solicitação para redefinir a senha da sua conta no My GManager.
                    </p>
                    
                    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.7; color: #c8d3df;">
                        Clique no botão abaixo para criar uma nova senha.
                    </p>

                    <a
                        href="${resetUrl}"
                        style="display: inline-block; padding: 14px 24px; background: #22c55e; color: #111827; text-decoration: none; font-weight: 700; border-radius: 12px; font-size: 15px;"
                    >
                        Redefinir senha
                    </a>

                    <p style="margin: 28px 0 0; font-size: 14px; line-height: 1.7; color: #94a6b8;">
                        Este link expira em ${minutosExpiracao} minutos.
                    </p>

                    <p style="margin: 16px 0 0; font-size: 13px; line-height: 1.6; color: #6f8193;">
                        Se você não solicitou essa alteração, ignore este email.
                    </p>

                    <p style="margin: 16px 0 0; font-size: 13px; line-height: 1.6; color: #6f8193;">
                        Se o botão não funcionar, copie e cole este link no navegador:
                    </p>

                    <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.6; word-break: break-word;">
                        <a href="${resetUrl}" style="color: #7dd3fc; text-decoration: none;">
                            ${resetUrl}
                        </a>
                    </p>
                </div>
            </div>
        `
    })
}

// Enviar email para mudança de email

module.exports={enviarEmailVerificacao, enviarEmailRecuperacaoSenha}