const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrder } = require('../controllers/orderController');

// GET /api/orders - Получение всех заявок
router.get('/', getAllOrders);

// POST /api/orders - Создание новой заявки
router.post('/', createOrder);

// PUT /api/orders/:id - Обновление заказа
router.put('/:id', updateOrder);

module.exports = router;
