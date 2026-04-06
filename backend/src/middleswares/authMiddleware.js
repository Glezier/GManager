const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

module.exports = (req, res, next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader){
        return next(new AppError("Token não fornecido", 401, "TOKEN_MISSING"))
    }

    const token = authHeader.split(' ')[1] // Recebe no formato 'Bearer token'

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.userId = decoded.id

        next()

    }catch(error){
        return next(new AppError("Token inválido", 401, "TOKEN_INVALID"))
    }
}