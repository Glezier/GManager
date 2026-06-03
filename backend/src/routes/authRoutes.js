const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const rateLimitMiddleware = require('../middleswares/rateLimitMiddleware')
const authMiddleware = require('../middleswares/authMiddleware')

router.post('/register', rateLimitMiddleware.authLimiter, authController.registrar)
router.post('/login', rateLimitMiddleware.loginLimiter, authController.login)
router.get('/verificar-email', authController.verificarEmail)
router.post('/reenviar-verificacao', rateLimitMiddleware.authLimiter, authController.reenviarVerificacao)
router.post('/refresh', rateLimitMiddleware.authLimiter, authController.refreshToken)
router.post('/logout', authController.logout)

module.exports = router