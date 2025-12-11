const VehicleBodyType = require('../models/VehicleBodyType');
const LoadingType = require('../models/LoadingType');
const PackageType = require('../models/PackageType');

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
        const loadingTypes = await LoadingType.find().sort({ name: 1 });
        const packageTypes = await PackageType.find().sort({ name: 1 });

        res.json({
            vehicleBodyTypes,
            loadingTypes,
            packageTypes
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Инициализация всех справочников (seed)
 */
exports.seedDictionaries = async (req, res) => {
    try {
        const results = {};

        // 1. Seed VehicleBodyTypes
        const vehicleBodyCount = await VehicleBodyType.countDocuments();
        if (vehicleBodyCount === 0) {
            const vehicleTypes = [
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
            const created = await VehicleBodyType.insertMany(vehicleTypes);
            results.vehicleBodyTypes = { created: created.length };
        } else {
            results.vehicleBodyTypes = { message: 'Уже заполнен', count: vehicleBodyCount };
        }

        // 2. Seed LoadingTypes
        const loadingTypeCount = await LoadingType.countDocuments();
        if (loadingTypeCount === 0) {
            const loadingTypes = [
                { name: 'Задняя', description: 'Загрузка с задней части' },
                { name: 'Боковая', description: 'Загрузка с боковой части' },
                { name: 'Верхняя', description: 'Загрузка сверху' },
                { name: 'Полная растентовка', description: 'Полное снятие тента' }
            ];
            const created = await LoadingType.insertMany(loadingTypes);
            results.loadingTypes = { created: created.length };
        } else {
            results.loadingTypes = { message: 'Уже заполнен', count: loadingTypeCount };
        }

        // 3. Seed PackageTypes
        const packageTypeCount = await PackageType.countDocuments();
        if (packageTypeCount === 0) {
            const packageTypes = [
                { name: 'Паллеты (EUR)', description: 'Европаллеты' },
                { name: 'Коробки', description: 'Картонные коробки' },
                { name: 'Биг-беги', description: 'Мягкие контейнеры' },
                { name: 'Навалом', description: 'Без упаковки' },
                { name: 'Бочки', description: 'Металлические или пластиковые бочки' }
            ];
            const created = await PackageType.insertMany(packageTypes);
            results.packageTypes = { created: created.length };
        } else {
            results.packageTypes = { message: 'Уже заполнен', count: packageTypeCount };
        }

        res.status(201).json({
            message: 'Инициализация справочников завершена',
            results
        });

    } catch (err) {
        console.error('❌ Ошибка при заполнении справочников:', err);
        res.status(500).json({ message: err.message });
    }
};
