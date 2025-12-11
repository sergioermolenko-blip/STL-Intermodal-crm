/**
 * Фабрика для создания CRUD контроллеров
 * @param {Model} Model - Mongoose модель
 * @param {string} entityNameRu - Название сущности на русском (в именительном падеже)
 * @param {string} relatedField - Поле в Order для проверки связей ('client' или 'carrier')
 * @returns {Object} Объект с CRUD методами
 */
function createEntityController(Model, entityNameRu, relatedField) {
    const Order = require('../models/Order');

    return {
        // Создать новую сущность
        create: async (req, res) => {
            try {
                const { name, inn, contactPerson, phone, email } = req.body;

                if (!name || !name.trim()) {
                    return res.status(400).json({
                        message: `Название ${entityNameRu}а обязательно`
                    });
                }

                const existing = await Model.findOne({ name: name.trim() });

                if (existing) {
                    return res.status(400).json({
                        message: `${entityNameRu} с таким названием уже существует`
                    });
                }

                const newEntity = await Model.create({
                    name: name.trim(),
                    inn: inn?.trim() || '',
                    contactPerson: contactPerson?.trim() || '',
                    phone: phone?.trim() || '',
                    email: email?.trim() || ''
                });

                res.status(201).json(newEntity);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        },

        // Получить все сущности
        getAll: async (req, res) => {
            try {
                const entities = await Model.find().sort({ createdAt: -1 });
                res.json(entities);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        },

        // Обновить сущность
        update: async (req, res) => {
            try {
                const { name, inn, contactPerson, phone, email } = req.body;

                if (!name || !name.trim()) {
                    return res.status(400).json({
                        message: `Название ${entityNameRu}а обязательно`
                    });
                }

                const existing = await Model.findOne({
                    name: name.trim(),
                    _id: { $ne: req.params.id }
                });

                if (existing) {
                    return res.status(400).json({
                        message: `${entityNameRu} с таким названием уже существует`
                    });
                }

                const updated = await Model.findByIdAndUpdate(
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

                if (!updated) {
                    return res.status(404).json({
                        message: `${entityNameRu} не найден`
                    });
                }

                res.json(updated);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        },

        // Удалить сущность
        delete: async (req, res) => {
            try {
                const filter = {};
                filter[relatedField] = req.params.id;
                const ordersCount = await Order.countDocuments(filter);

                if (ordersCount > 0) {
                    return res.status(400).json({
                        message: `Невозможно удалить ${entityNameRu}а. Существует ${ordersCount} заказ(ов) с этим ${entityNameRu}ом.`
                    });
                }

                const deleted = await Model.findByIdAndDelete(req.params.id);

                if (!deleted) {
                    return res.status(404).json({
                        message: `${entityNameRu} не найден`
                    });
                }

                res.json({
                    message: `${entityNameRu} успешно удален`,
                    [relatedField]: deleted
                });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        }
    };
}

module.exports = createEntityController;
