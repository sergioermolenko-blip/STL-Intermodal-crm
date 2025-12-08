const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController');

// POST /api/carriers - Создать нового перевозчика
router.post('/', carrierController.create);

// GET /api/carriers - Получить всех перевозчиков
router.get('/', carrierController.getAll);

// PUT /api/carriers/:id - Обновить перевозчика
router.put('/:id', carrierController.update);

// DELETE /api/carriers/:id - Удалить перевозчика
router.delete('/:id', carrierController.delete);

module.exports = router;
