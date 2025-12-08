const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// POST /api/clients - Создать нового клиента
router.post('/', clientController.create);

// GET /api/clients - Получить всех клиентов
router.get('/', clientController.getAll);

// PUT /api/clients/:id - Обновить клиента
router.put('/:id', clientController.update);

// DELETE /api/clients/:id - Удалить клиента
router.delete('/:id', clientController.delete);

module.exports = router;
