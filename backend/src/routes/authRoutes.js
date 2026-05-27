const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const { authLimiter, loginLimiter, profileNameLimiter, emailLimiter, themeLimiter, passwordLimiter } = require('../middleswares/rateLimitMiddleware')
const authMiddleware = require('../middleswares/authMiddleware')




router.post('/register', authLimiter, authController.registrar)
router.post('/login', loginLimiter, authController.login)
router.get('/verificar-email', authController.verificarEmail)
router.post('/reenviar-verificacao', authLimiter, authController.reenviarVerificacao)
router.post('/refresh', authLimiter, authController.refreshToken)
router.post('/logout', authController.logout)

module.exports = router