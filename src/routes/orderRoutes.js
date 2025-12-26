const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, updateOrderStatus } = require('../controllers/orderController');

// GET /api/orders - Получение всех заявок
router.get('/', getAllOrders);

// GET /api/orders/:id - Получение заявки по ID
router.get('/:id', getOrderById);

// POST /api/orders - Создание новой заявки
router.post('/', createOrder);

// PUT /api/orders/:id - Обновление заказа
router.put('/:id', updateOrder);

// PATCH /api/orders/:id/status - Обновление статуса (Фаза 1)
router.patch('/:id/status', updateOrderStatus);

// DELETE /api/orders/:id - Удаление заказа
router.delete('/:id', deleteOrder);

module.exports = router;
