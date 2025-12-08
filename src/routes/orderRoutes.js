const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');

// GET /api/orders - Получение всех заявок
router.get('/', getAllOrders);

// POST /api/orders - Создание новой заявки
router.post('/', createOrder);

module.exports = router;
