const express = require("express")
const router = express.Router()

const authMiddleware = require('../middleswares/authMiddleware')
const noteController = require('../controllers/noteController')
const {
    notesWriterLimiter
} = require('../middleswares/rateLimitMiddleware')

router.use(authMiddleware)

router.get('/', noteController.listarNotas)
router.get('/:id', noteController.buscarNotaPorId)
router.post('/', notesWriterLimiter, noteController.criarNota)
router.put('/:id', notesWriterLimiter, noteController.atualizarNota)
router.delete('/:id', notesWriterLimiter, noteController.deletarNota)

module.exports = router