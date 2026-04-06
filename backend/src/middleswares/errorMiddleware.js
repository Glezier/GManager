module.exports = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.statusCode || 500
    const code = err.code || "INTERNAL_ERROR"
    const message = err.message || "Erro interno no servidor"

    return res.status(statusCode).json({
        error: {
            code, 
            message,
        },
    })
}