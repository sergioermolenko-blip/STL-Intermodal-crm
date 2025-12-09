const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 1. Читаем .env из корня
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Подключаем модель
const VehicleBodyType = require('./src/models/VehicleBodyType');

// 3. Данные
const vehicleBodyTypes = [
    { name: "Тент 82м3" },
    { name: "Тент 90м3" },
    { name: "Тент 120м3" },
    { name: "Рефрижератор" },
    { name: "Изотерм" },
    { name: "Бортовой" },
    { name: "Контейнеровоз" },
    { name: "Трал" },
    { name: "Цельнометаллический" }
];

const seedDB = async () => {
    try {
        // ИСПОЛЬЗУЕМ ИМЯ КАК У ТЕБЯ В ФАЙЛЕ: MONGO_URI
        const dbUri = process.env.MONGO_URI;

        if (!dbUri) {
            throw new Error('❌ В файле .env не найдена переменная MONGO_URI');
        }

        console.log('⏳ Подключаемся к MongoDB...');
        // Убираем устаревшие опции, оставляем только URI
        await mongoose.connect(dbUri);
        console.log('✅ Подключение успешно.');

        // Очистка и запись
        await VehicleBodyType.deleteMany({});
        console.log('🧹 Старые записи удалены.');

        await VehicleBodyType.insertMany(vehicleBodyTypes);
        console.log(`🌱 Добавлено ${vehicleBodyTypes.length} типов кузовов.`);

        process.exit();

    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
};

seedDB();
