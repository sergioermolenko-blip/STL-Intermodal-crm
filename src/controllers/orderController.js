const Order = require('../models/Order');
const Client = require('../models/Client');
const Carrier = require('../models/Carrier');

// Получить все заказы (с подтягиванием имен клиентов и перевозчиков)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('client', 'name')   // Подставить имя клиента вместо ID
            .populate('carrier', 'name')  // Подставить имя перевозчика вместо ID
            .sort({ created_at: -1 });    // Сначала новые
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Создать новый заказ (Умная логика Find or Create)
exports.createOrder = async (req, res) => {
    try {
        const {
            clientName, carrierName,
            client_rate, carrier_rate,
            route_from, route_to, cargo_name, cargo_weight
        } = req.body;

        // 1. Ищем или создаем КЛИЕНТА
        let clientDoc = await Client.findOne({ name: clientName });
        if (!clientDoc) {
            clientDoc = await Client.create({ name: clientName });
            console.log(`✅ Создан новый клиент: ${clientName}`);
        } else {
            console.log(`ℹ️  Найден существующий клиент: ${clientName}`);
        }

        // 2. Ищем или создаем ПЕРЕВОЗЧИКА
        let carrierDoc = await Carrier.findOne({ name: carrierName });
        if (!carrierDoc) {
            carrierDoc = await Carrier.create({ name: carrierName });
            console.log(`✅ Создан новый перевозчик: ${carrierName}`);
        } else {
            console.log(`ℹ️  Найден существующий перевозчик: ${carrierName}`);
        }

        // 3. Вычисляем маржу
        const margin = Number(client_rate) - Number(carrier_rate);

        // 4. Создаем сам ЗАКАЗ
        const newOrder = new Order({
            client: clientDoc._id,
            carrier: carrierDoc._id,
            route_from,
            route_to,
            cargo_name,
            cargo_weight,
            client_rate: Number(client_rate),
            carrier_rate: Number(carrier_rate),
            margin,
            status: 'new'
        });

        const savedOrder = await newOrder.save();

        // Подтягиваем имена для ответа
        await savedOrder.populate('client carrier');

        console.log(`✅ Заказ создан: ${route_from} → ${route_to}, Маржа: ${margin}`);
        res.status(201).json(savedOrder);

    } catch (err) {
        console.error("❌ Ошибка при создании заказа:", err);
        res.status(400).json({ message: "Ошибка создания: " + err.message });
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