const Client = require('../models/Client');
const Order = require('../models/Order');

// Создать нового клиента
exports.create = async (req, res) => {
    try {
        const { name, inn, contactPerson, phone, email } = req.body;

        // Проверка обязательных полей
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Название клиента обязательно' });
        }

        // Проверка на дубликат имени
        const existingClient = await Client.findOne({ name: name.trim() });

        if (existingClient) {
            return res.status(400).json({ message: 'Клиент с таким названием уже существует' });
        }

        const newClient = await Client.create({
            name: name.trim(),
            inn: inn?.trim() || '',
            contactPerson: contactPerson?.trim() || '',
            phone: phone?.trim() || '',
            email: email?.trim() || ''
        });

        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Получить всех клиентов
exports.getAll = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Обновить клиента
exports.update = async (req, res) => {
    try {
        const { name, inn, contactPerson, phone, email } = req.body;

        // Проверка обязательных полей
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Название клиента обязательно' });
        }

        // Проверка на дубликат имени (если имя изменилось)
        const existingClient = await Client.findOne({
            name: name.trim(),
            _id: { $ne: req.params.id }
        });

        if (existingClient) {
            return res.status(400).json({ message: 'Клиент с таким названием уже существует' });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                inn: inn?.trim() || '',
                contactPerson: contactPerson?.trim() || '',
                phone: phone?.trim() || '',
                email: email?.trim() || ''
            },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Клиент не найден' });
        }

        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Удалить клиента
exports.delete = async (req, res) => {
    try {
        // Проверяем, есть ли заказы у этого клиента
        const ordersCount = await Order.countDocuments({ client: req.params.id });

        if (ordersCount > 0) {
            return res.status(400).json({
                message: `Невозможно удалить клиента. Существует ${ordersCount} заказ(ов) с этим клиентом.`
            });
        }

        const deletedClient = await Client.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Клиент не найден' });
        }

        res.json({ message: 'Клиент успешно удален', client: deletedClient });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
