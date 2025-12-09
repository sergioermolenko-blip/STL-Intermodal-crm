const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const VehicleBodyType = require('./src/models/VehicleBodyType');

const dropIndex = async () => {
    try {
        const dbUri = process.env.MONGO_URI;

        if (!dbUri) {
            throw new Error('❌ В файле .env не найдена переменная MONGO_URI');
        }

        console.log('⏳ Подключаемся к MongoDB...');
        await mongoose.connect(dbUri);
        console.log('✅ Подключение успешно.');

        // Удаляем индекс code_1
        console.log('🗑️ Удаляем индекс code_1...');
        await VehicleBodyType.collection.dropIndex('code_1');
        console.log('✅ Индекс code_1 успешно удален!');

        process.exit();
    } catch (err) {
        if (err.code === 27) {
            console.log('ℹ️ Индекс code_1 не существует (это нормально)');
        } else {
            console.error('❌ Ошибка:', err.message);
        }
        process.exit(1);
    }
};

dropIndex();
