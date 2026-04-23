const express = require('express')
const router = express.Router()

const authController = require('../middleswares/authController')

router.post('/register', authController.registrar)
router.post('/login', authController.login)
router.get('/verificar-email', authController.verificarEmail)

module.exports = router