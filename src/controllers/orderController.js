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
        // 1. Обработка клиента
        let client;
        if (req.body.client && req.body.client.name) {
            const clientName = req.body.client.name;
            console.log(`🔍 Ищу клиента: "${clientName}"`);

            // Ищем клиента по имени
            client = await Client.findOne({ name: clientName });

            if (!client) {
                // Если не найден - создаем нового
                console.log(`➕ Клиент не найден, создаю нового: "${clientName}"`);
                client = await Client.create({ name: clientName });
                console.log(`✅ Клиент создан с ID: ${client._id}`);
            } else {
                console.log(`✅ Клиент найден с ID: ${client._id}`);
            }
        }

        // 2. Обработка перевозчика
        let carrier;
        if (req.body.carrier && req.body.carrier.name) {
            const carrierName = req.body.carrier.name;
            console.log(`🔍 Ищу перевозчика: "${carrierName}"`);

            // Ищем перевозчика по имени
            carrier = await Carrier.findOne({ name: carrierName });

            if (!carrier) {
                // Если не найден - создаем нового
                console.log(`➕ Перевозчик не найден, создаю нового: "${carrierName}"`);
                carrier = await Carrier.create({ name: carrierName });
                console.log(`✅ Перевозчик создан с ID: ${carrier._id}`);
            } else {
                console.log(`✅ Перевозчик найден с ID: ${carrier._id}`);
            }
        }

        // 3. Формируем данные заказа с ObjectId вместо объектов
        const orderData = {
            ...req.body,
            client: client ? client._id : null,
            carrier: carrier ? carrier._id : null
        };

        console.log('📦 Финальные данные заказа:', JSON.stringify(orderData, null, 2));

        // 4. Создаем заказ
        const newOrder = await Order.create(orderData);

        // 5. Подтягиваем связанные данные для ответа
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