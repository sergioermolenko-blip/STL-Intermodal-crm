const { Sequelize } = require('sequelize');

// Создаем экземпляр Sequelize для SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false, // Отключить SQL логи (можно включить для отладки)
});

// Функция для проверки подключения к БД
const connectDB = async () => {
    try {
        // Проверяем соединение с БД
        await sequelize.authenticate();
        console.log('✓ Database connection established successfully');

        // Синхронизируем модели с БД (создаем таблицы если их нет)
        await sequelize.sync({ alter: false });
        console.log('✓ Database models synchronized');
    } catch (error) {
        console.error('✗ Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
