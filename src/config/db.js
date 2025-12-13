const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Подключаемся, используя адрес из файла .env
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // Database connected successfully
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Если не удалось подключиться - остановить сервер
        process.exit(1);
    }
};

module.exports = connectDB;
