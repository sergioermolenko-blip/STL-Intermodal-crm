const Carrier = require('../models/Carrier');
const Order = require('../models/Order');

// Создать нового перевозчика
exports.create = async (req, res) => {
    try {
        const { name, driverName, truckNumber, phone } = req.body;

        // Проверка обязательных полей
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Название перевозчика обязательно' });
        }

        // Проверка на дубликат имени
        const existingCarrier = await Carrier.findOne({ name: name.trim() });

        if (existingCarrier) {
            return res.status(400).json({ message: 'Перевозчик с таким названием уже существует' });
        }

        const newCarrier = await Carrier.create({
            name: name.trim(),
            driverName: driverName?.trim() || '',
            truckNumber: truckNumber?.trim() || '',
            phone: phone?.trim() || ''
        });

        console.log(`✅ Создан новый перевозчик: ${newCarrier.name}`);
        res.status(201).json(newCarrier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Получить всех перевозчиков
exports.getAll = async (req, res) => {
    try {
        const carriers = await Carrier.find().sort({ name: 1 });
        res.json(carriers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновить перевозчика
exports.update = async (req, res) => {
    try {
        const { name, driverName, truckNumber, phone } = req.body;

        // Проверка обязательных полей
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Название перевозчика обязательно' });
        }

        // Проверка на дубликат имени (если имя изменилось)
        const existingCarrier = await Carrier.findOne({
            name: name.trim(),
            _id: { $ne: req.params.id }
        });

        if (existingCarrier) {
            return res.status(400).json({ message: 'Перевозчик с таким названием уже существует' });
        }

        const updatedCarrier = await Carrier.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                driverName: driverName?.trim() || '',
                truckNumber: truckNumber?.trim() || '',
                phone: phone?.trim() || ''
            },
            { new: true, runValidators: true }
        );

        if (!updatedCarrier) {
            return res.status(404).json({ message: 'Перевозчик не найден' });
        }

        res.json(updatedCarrier);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Удалить перевозчика
exports.delete = async (req, res) => {
    try {
        // Проверяем, есть ли заказы у этого перевозчика
        const ordersCount = await Order.countDocuments({ carrier: req.params.id });

        if (ordersCount > 0) {
            return res.status(400).json({
                message: `Невозможно удалить перевозчика. Существует ${ordersCount} заказ(ов) с этим перевозчиком.`
            });
        }

        const deletedCarrier = await Carrier.findByIdAndDelete(req.params.id);

        if (!deletedCarrier) {
            return res.status(404).json({ message: 'Перевозчик не найден' });
        }

        res.json({ message: 'Перевозчик успешно удален', carrier: deletedCarrier });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
