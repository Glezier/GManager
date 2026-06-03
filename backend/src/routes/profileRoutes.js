const express = require('express')
const router = express.Router()

const profileController = require('../controllers/profileController')
const rateLimitMiddleware =  require('../middleswares/rateLimitMiddleware')
const authMiddleware = require('../middleswares/authMiddleware')

router.get("/me", authMiddleware, profileController.me)
router.patch('/nome', authMiddleware, rateLimitMiddleware.profileNameLimiter, profileController.atualizarNome)
router.patch('/email', authMiddleware, rateLimitMiddleware.emailLimiter, profileController.atualizarEmail)
router.patch('/senha', authMiddleware, rateLimitMiddleware.passwordLimiter, profileController.atualizarSenha)
router.patch('/tema', authMiddleware, rateLimitMiddleware.themeLimiter, profileController.atualizarTema)

module.exports = router