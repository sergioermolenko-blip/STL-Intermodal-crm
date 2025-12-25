const Order = require('../models/Order');
const Client = require('../models/Client');
const Carrier = require('../models/Carrier');
const VehicleBodyType = require('../models/VehicleBodyType');
const PackageType = require('../models/PackageType');
const LoadingType = require('../models/LoadingType');
const Contact = require('../models/Contact');

// Получить все заказы (с подтягиванием имен клиентов и перевозчиков)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: Client, as: 'client', attributes: ['name'] },
                { model: Carrier, as: 'carrier', attributes: ['name'] },
                { model: VehicleBodyType, as: 'vehicleBodyType', attributes: ['name'] },
                { model: Contact, as: 'clientContact', attributes: ['fullName', 'phones', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Создать новый заказ
exports.createOrder = async (req, res) => {
    try {
        // Создаем заказ напрямую из req.body
        // Фронтенд теперь отправляет client и carrier как ID
        const newOrder = await Order.create(req.body);

        // Подтягиваем связанные данные для ответа
        await newOrder.reload({
            include: [
                { model: Client, as: 'client' },
                { model: Carrier, as: 'carrier' },
                { model: VehicleBodyType, as: 'vehicleBodyType' },
                { model: Contact, as: 'clientContact' }
            ]
        });

        res.status(201).json(newOrder);

    } catch (error) {
        console.error("❌ Ошибка при создании заказа:", error);
        res.status(400).json({ message: "Ошибка создания: " + error.message });
    }
};

// Получить заказ по ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: Client, as: 'client', attributes: ['name'] },
                { model: Carrier, as: 'carrier', attributes: ['name'] },
                { model: VehicleBodyType, as: 'vehicleBodyType', attributes: ['name'] },
                { model: Contact, as: 'clientContact', attributes: ['fullName', 'phones', 'email'] }
            ]
        });

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
        const [updatedCount] = await Order.update(req.body, {
            where: { id: orderId }
        });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const updatedOrder = await Order.findByPk(orderId, {
            include: [
                { model: Client, as: 'client' },
                { model: Carrier, as: 'carrier' },
                { model: VehicleBodyType, as: 'vehicleBodyType' },
                { model: Contact, as: 'clientContact' }
            ]
        });

        res.json(updatedOrder);

    } catch (err) {
        console.error("❌ Ошибка при обновлении заказа:", err);
        res.status(400).json({ message: "Ошибка обновления: " + err.message });
    }
};

// Удалить заказ
exports.deleteOrder = async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Заказ удален' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};