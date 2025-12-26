const Order = require('../models/Order');
const Client = require('../models/Client');
const Carrier = require('../models/Carrier');
const VehicleBodyType = require('../models/VehicleBodyType');
const PackageType = require('../models/PackageType');
const LoadingType = require('../models/LoadingType');
const Contact = require('../models/Contact');

// === КОНСТАНТЫ ВАЛИДАЦИИ (Фаза 1) ===
const VALID_STATUSES = [
    'draft', 'inquiry', 'carrier_quote', 'quotes_received', 'proposal_draft',
    'proposal_sent', 'client_approved', 'booking', 'confirmed', 'picked_up',
    'export_customs', 'departed', 'in_transit', 'arrived', 'import_customs',
    'partial', 'delivered', 'invoiced', 'paid', 'closed',
    'expired', 'declined', 'cancelled', 'hold', 'problem', 'returned', 'lost'
];

const VALID_TRANSPORT_MODES = ['auto', 'rail', 'sea', 'air', 'multimodal', 'tbd'];
const VALID_DIRECTIONS = ['import', 'export', 'domestic', 'transit'];

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
        // Валидация transportMode и direction
        if (req.body.transportMode && !VALID_TRANSPORT_MODES.includes(req.body.transportMode)) {
            return res.status(400).json({ message: `Недопустимый transportMode: ${req.body.transportMode}` });
        }
        if (req.body.direction && !VALID_DIRECTIONS.includes(req.body.direction)) {
            return res.status(400).json({ message: `Недопустимый direction: ${req.body.direction}` });
        }

        const newOrder = await Order.create(req.body);

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

        // Валидация transportMode и direction
        if (req.body.transportMode && !VALID_TRANSPORT_MODES.includes(req.body.transportMode)) {
            return res.status(400).json({ message: `Недопустимый transportMode: ${req.body.transportMode}` });
        }
        if (req.body.direction && !VALID_DIRECTIONS.includes(req.body.direction)) {
            return res.status(400).json({ message: `Недопустимый direction: ${req.body.direction}` });
        }

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

// === НОВЫЙ ENDPOINT (Фаза 1) ===
// Обновить статус заказа
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Валидация статуса
        if (!status) {
            return res.status(400).json({ message: 'Статус не указан' });
        }
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Недопустимый статус: ${status}` });
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        // Обновляем статус
        await order.update({ status });

        // Возвращаем обновлённый заказ
        await order.reload({
            include: [
                { model: Client, as: 'client' },
                { model: Carrier, as: 'carrier' },
                { model: VehicleBodyType, as: 'vehicleBodyType' },
                { model: Contact, as: 'clientContact' }
            ]
        });

        res.json(order);

    } catch (err) {
        console.error("❌ Ошибка при смене статуса:", err);
        res.status(400).json({ message: "Ошибка смены статуса: " + err.message });
    }
};

// Экспорт констант для использования в других местах
exports.VALID_STATUSES = VALID_STATUSES;
exports.VALID_TRANSPORT_MODES = VALID_TRANSPORT_MODES;
exports.VALID_DIRECTIONS = VALID_DIRECTIONS;