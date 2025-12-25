const { Op } = require('sequelize');

/**
 * Фабрика для создания CRUD контроллеров
 * @param {Model} Model - Sequelize модель
 * @param {string} entityNameRu - Название сущности на русском (в именительном падеже)
 * @param {string} relatedField - Поле в Order для проверки связей ('clientId' или 'carrierId')
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

                const existing = await Model.findOne({ where: { name: name.trim() } });

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
                const entities = await Model.findAll({
                    order: [['createdAt', 'DESC']]
                });
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
                    where: {
                        name: name.trim(),
                        id: { [Op.ne]: req.params.id }
                    }
                });

                if (existing) {
                    return res.status(400).json({
                        message: `${entityNameRu} с таким названием уже существует`
                    });
                }

                const [updatedCount, updatedRows] = await Model.update(
                    {
                        name: name.trim(),
                        inn: inn?.trim() || '',
                        contactPerson: contactPerson?.trim() || '',
                        phone: phone?.trim() || '',
                        email: email?.trim() || ''
                    },
                    {
                        where: { id: req.params.id },
                        returning: true
                    }
                );

                if (updatedCount === 0) {
                    return res.status(404).json({
                        message: `${entityNameRu} не найден`
                    });
                }

                // Для SQLite returning не работает, получаем обновленную запись отдельно
                const updated = await Model.findByPk(req.params.id);
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
                const ordersCount = await Order.count({ where: filter });

                if (ordersCount > 0) {
                    return res.status(400).json({
                        message: `Невозможно удалить ${entityNameRu}а. Существует ${ordersCount} заказ(ов) с этим ${entityNameRu}ом.`
                    });
                }

                const deleted = await Model.findByPk(req.params.id);

                if (!deleted) {
                    return res.status(404).json({
                        message: `${entityNameRu} не найден`
                    });
                }

                await Model.destroy({ where: { id: req.params.id } });

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
