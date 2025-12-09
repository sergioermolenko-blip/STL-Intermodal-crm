const Order = require('../models/Order');
const Client = require('../models/Client');
const Carrier = require('../models/Carrier');

// Получить все заказы (с подтягиванием имен клиентов и перевозчиков)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('client', 'name')   // Подставить имя клиента вместо ID
            .populate('carrier', 'name')  // Подставить имя перевозчика вместо ID
            .populate('vehicleBodyType', 'name')  // Подставить тип кузова
            .sort({ created_at: -1 });    // Сначала новые
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Создать новый заказ
exports.createOrder = async (req, res) => {
    console.log('📥 CREATE ORDER REQUEST BODY:', JSON.stringify(req.body, null, 2));

    try {
        // Создаем заказ напрямую из req.body
        // Фронтенд теперь отправляет client и carrier как ID
        const newOrder = await Order.create(req.body);

        // Подтягиваем связанные данные для ответа
        await newOrder.populate('client carrier vehicleBodyType');

        console.log(`✅ Заказ создан: ${newOrder.route.from} → ${newOrder.route.to}`);
        res.status(201).json(newOrder);

    } catch (error) {
        console.error('❌ ERROR SAVING ORDER:', error);
        console.error("❌ Ошибка при создании заказа:", error);
        res.status(400).json({ message: "Ошибка создания: " + error.message });
    }
};

// Получить заказ по ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client', 'name')
            .populate('carrier', 'name')
            .populate('vehicleBodyType', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновить заказ
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Обновляем заказ напрямую из req.body
        // Фронтенд отправляет данные в правильной структуре
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            req.body,
            { new: true, runValidators: true }
        ).populate('client carrier vehicleBodyType');

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        console.log(`✅ Заказ обновлен: ${updatedOrder.route.from} → ${updatedOrder.route.to}`);
        res.json(updatedOrder);

    } catch (err) {
        console.error("❌ Ошибка при обновлении заказа:", err);
        res.status(400).json({ message: "Ошибка обновления: " + err.message });
    }
};

// Удалить заказ
exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Заказ удален' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};