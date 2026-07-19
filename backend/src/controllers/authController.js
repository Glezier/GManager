const authService = require("../services/authService")

// Define as regras do refresh token
function getRefreshTokenOptions(){
    return {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        path: '/'
    }
}

// Registro
exports.registrar = async (req, res, next) => {
    try{
        const response = await authService.registrar(req.body)
        
        res.status(201).json(response)
    }catch(error){
        next(error)
    }
}

// Login
exports.login = async (req, res, next) => {
    try{
        const response = await authService.login(req.body)

        // Adicionar cookie na resposta
        res.cookie(
            'refreshToken', 
            response.refreshToken, 
            getRefreshTokenOptions()
        )

        res.json({
            token: response.accessToken,
            usuario: response.usuario 
        })

    }catch(error){
        next(error)
    }
}

// Refresh token
exports.refreshToken = async (req,res,next) => {
    try{
        const response = await authService.refreshToken(req.cookies.refreshToken)
        
        res.cookie(
            'refreshToken', 
            response.refreshToken, 
            getRefreshTokenOptions()
        )

        res.json(
            {token: response.accessToken}
        )
    } catch(error){
        next(error)
    }
}

// Logout
exports.logout = async(req,res,next) => {
    try{
        const response = await authService.logout(req.cookies.refreshToken)

        // Retira cookie
        res.clearCookie(
            'refreshToken', 
            getRefreshTokenOptions()
        )

        res.json(response)
    } catch(error){
        next(error)
    }
}