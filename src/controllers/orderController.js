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
            route_from, route_to, cargo_name, cargo_weight,
            vehicleBodyType,
            date_loading, date_unloading
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
            vehicleBodyType,
            date_loading,
            date_unloading,
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

// Получить заказ по ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client', 'name')
            .populate('carrier', 'name');

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
        const {
            clientName, carrierName,
            client_rate, carrier_rate,
            route_from, route_to, cargo_name, cargo_weight,
            vehicleBodyType,
            date_loading, date_unloading
        } = req.body;

        // 1. Найти заказ
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        // 2. Если пришли новые имена клиента/перевозчика - найти/создать их
        let clientId = order.client;
        let carrierId = order.carrier;

        if (clientName) {
            let clientDoc = await Client.findOne({ name: clientName });
            if (!clientDoc) {
                clientDoc = await Client.create({ name: clientName });
                console.log(`✅ Создан новый клиент: ${clientName}`);
            }
            clientId = clientDoc._id;
        }

        if (carrierName) {
            let carrierDoc = await Carrier.findOne({ name: carrierName });
            if (!carrierDoc) {
                carrierDoc = await Carrier.create({ name: carrierName });
                console.log(`✅ Создан новый перевозчик: ${carrierName}`);
            }
            carrierId = carrierDoc._id;
        }

        // 3. Пересчитать маржу
        const newClientRate = client_rate !== undefined ? Number(client_rate) : order.client_rate;
        const newCarrierRate = carrier_rate !== undefined ? Number(carrier_rate) : order.carrier_rate;
        const margin = newClientRate - newCarrierRate;

        // 4. Обновить поля
        order.client = clientId;
        order.carrier = carrierId;
        order.route_from = route_from || order.route_from;
        order.route_to = route_to || order.route_to;
        order.cargo_name = cargo_name || order.cargo_name;
        order.cargo_weight = cargo_weight !== undefined ? cargo_weight : order.cargo_weight;
        order.vehicleBodyType = vehicleBodyType || order.vehicleBodyType;
        order.date_loading = date_loading || order.date_loading;
        order.date_unloading = date_unloading || order.date_unloading;
        order.client_rate = newClientRate;
        order.carrier_rate = newCarrierRate;
        order.margin = margin;

        const updatedOrder = await order.save();
        await updatedOrder.populate('client carrier');

        console.log(`✅ Заказ обновлен: ${order.route_from} → ${order.route_to}`);
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