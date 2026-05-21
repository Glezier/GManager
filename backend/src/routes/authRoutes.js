const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const { authLimiter, loginLimiter, profileNameLimiter, emailLimiter, themeLimiter, passwordLimiter } = require('../middleswares/rateLimitMiddleware')
const authMiddleware = require('../middleswares/authMiddleware')

router.get('/me', authMiddleware, authController.me)
router.patch('/me', authMiddleware, profileNameLimiter, authController.atualizarPerfil)
router.patch('/me/email', authMiddleware, emailLimiter, authController.alterarEmail)
router.patch('/me/senha', authMiddleware, passwordLimiter, authController.atualizarSenha)
router.patch('/me/preferencias', authMiddleware, themeLimiter, authController.atualizarPreferencias)
router.post('/register', authLimiter, authController.registrar)
router.post('/login', loginLimiter, authController.login)
router.get('/verificar-email', authController.verificarEmail)
router.post('/reenviar-verificacao', authLimiter, authController.reenviarVerificacao)
router.post('/refresh', authLimiter, authController.refreshToken)
router.post('/logout', authController.logout)

module.exports = router