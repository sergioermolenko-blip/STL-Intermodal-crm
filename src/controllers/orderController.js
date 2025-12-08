const Order = require('../models/Order');

// Создание новой заявки
const createOrder = async (req, res) => {
    try {
        // Получаем данные из тела запроса
        const orderData = req.body;

        // Создаём новый экземпляр модели Order
        const order = new Order(orderData);

        // Сохраняем в базу данных
        await order.save();

        // Возвращаем успешный ответ со статусом 201 (Created)
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        // Обработка ошибок валидации
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Ошибка валидации данных',
                details: error.message
            });
        }

        // Обработка ошибок дублирования (например, уникальный номер заявки)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Заявка с таким номером уже существует'
            });
        }

        // Общая обработка других ошибок
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера при создании заявки',
            details: error.message
        });
    }
};

// Получение всех заявок
const getAllOrders = async (req, res) => {
    try {
        // Получаем все заказы из базы данных, сортируем по дате создания (новые первые)
        const orders = await Order.find().sort({ createdAt: -1 });

        // Возвращаем успешный ответ
        res.status(200).json(orders);
    } catch (error) {
        // Обработка ошибок
        res.status(500).json({
            success: false,
            error: 'Ошибка сервера при получении заявок',
            details: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders
};
