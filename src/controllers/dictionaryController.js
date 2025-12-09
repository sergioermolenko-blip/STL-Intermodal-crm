const VehicleBodyType = require('../models/VehicleBodyType');

/**
 * Инициализация справочника типов кузова (seed)
 */
exports.seedVehicleBodyTypes = async (req, res) => {
    try {
        const count = await VehicleBodyType.countDocuments();

        if (count > 0) {
            return res.json({
                message: 'Справочник уже заполнен',
                count
            });
        }

        const types = [
            { code: 'tent', name: 'Тент', description: 'Тентованный полуприцеп' },
            { code: 'ref', name: 'Рефрижератор', description: 'Изотермический кузов с холодильной установкой' },
            { code: 'isoterm', name: 'Изотерм', description: 'Изотермический кузов без холодильной установки' },
            { code: 'container', name: 'Контейнер', description: '20/40 футовый контейнер' },
            { code: 'flatbed', name: 'Бортовой', description: 'Открытая платформа с бортами' },
            { code: 'jumbo', name: 'Джамбо', description: 'Увеличенный объем (до 100 м³)' },
            { code: 'mega', name: 'Мега', description: 'Увеличенная высота (до 3м)' },
            { code: 'tank', name: 'Цистерна', description: 'Для перевозки жидкостей' },
            { code: 'lowbed', name: 'Низкорамник', description: 'Для негабаритных грузов' },
            { code: 'car_carrier', name: 'Автовоз', description: 'Для перевозки автомобилей' }
        ];

        const created = await VehicleBodyType.insertMany(types);

        res.status(201).json({
            message: 'Справочник успешно заполнен',
            count: created.length,
            types: created
        });

    } catch (err) {
        console.error('❌ Ошибка при заполнении справочника:', err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Получить все типы кузова
 */
exports.getVehicleBodyTypes = async (req, res) => {
    try {
        const types = await VehicleBodyType.find().sort({ name: 1 });
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Получить все типы кузова (alias для удобства)
 */
exports.getBodyTypes = async (req, res) => {
    try {
        const types = await VehicleBodyType.find().sort({ name: 1 });
        res.json(types);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Получить все справочники (для загрузки на фронтенде)
 */
exports.getAllDictionaries = async (req, res) => {
    try {
        const vehicleBodyTypes = await VehicleBodyType.find().sort({ name: 1 });

        res.json({
            vehicleBodyTypes
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
