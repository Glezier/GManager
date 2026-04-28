const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleswares/authMiddleware')
const tarefasController = require('../controllers/tarefasController');
const { tasksWriterLimiter } = require('../middleswares/rateLimitMiddleware')

router.get('/', authMiddleware, tarefasController.listarTarefas);
router.post('/', authMiddleware, tasksWriterLimiter, tarefasController.criarTarefa);
router.put('/:id', authMiddleware, tasksWriterLimiter, tarefasController.atualizarTarefa);
router.delete('/:id', authMiddleware, tasksWriterLimiter, tarefasController.deletarTarefa);
router.patch('/:id/concluir', authMiddleware, tasksWriterLimiter, tarefasController.concluirTarefa)

module.exports = router