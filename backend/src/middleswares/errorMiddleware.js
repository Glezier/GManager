module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const code = err.code || "INTERNAL_ERROR"
    const isProduction = process.env.NODE_ENV === 'production'
    const isOperational = err.isOperational === true
    
    console.error({
        message: err.message,
        code,
        statusCode,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    })

    const message = !isProduction || isOperational
    ? err.message 
    : 'Erro interno no servidor'

    return res.status(statusCode).json({
        error: {
            code : !isProduction || isOperational ? code : 'INTERNAL_ERROR', 
            message,
        },
    })
}