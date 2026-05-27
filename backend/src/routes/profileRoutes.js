const express = require('express')
const router = express.Router()

const profileController = require('../controllers/profileController')
const {  profileNameLimiter, emailLimiter, passwordLimiter, themeLimiter } =  require('../middleswares/rateLimitMiddleware')
const authMiddleware = require('../middleswares/authMiddleware')

router.get("/me", authMiddleware, profileController.me)
router.patch('/nome', authMiddleware, profileNameLimiter, profileController.atualizarNome)
router.patch('/email', authMiddleware, emailLimiter, profileController.atualizarEmail)
router.patch('/senha', authMiddleware, passwordLimiter, profileController.atualizarSenha)
router.patch('/tema', authMiddleware, themeLimiter, profileController.atualizarTema)

module.exports = router