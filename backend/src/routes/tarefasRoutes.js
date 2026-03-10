const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleswares/authMiddleware')
const tarefasController = require('../controllers/tarefasController');

router.get('/', authMiddleware, tarefasController.listarTarefas);
router.post('/', authMiddleware, tarefasController.criarTarefa);
router.put('/:id', authMiddleware, tarefasController.atualizarTarefa);
router.delete('/:id', authMiddleware, tarefasController.deletarTarefa);
router.delete('/:id', authMiddleware, tarefasController.atualizarStatusTarefa)

module.exports = router