const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

router.post('/register', authController.registrar)
router.post('/login', authController.login)
router.get('/verificar-email', authController.verificarEmail)
router.post('/reenviar-verificacao', authController.reenviarVerificacao)

module.exports = router