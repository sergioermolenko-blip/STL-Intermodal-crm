const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');

// GET /api/orders - Получение всех заявок
router.get('/', getAllOrders);

// GET /api/orders/:id - Получение заявки по ID
router.get('/:id', getOrderById);

// POST /api/orders - Создание новой заявки
router.post('/', createOrder);

// PUT /api/orders/:id - Обновление заказа
router.put('/:id', updateOrder);

// DELETE /api/orders/:id - Удаление заказа
router.delete('/:id', deleteOrder);

module.exports = router;
