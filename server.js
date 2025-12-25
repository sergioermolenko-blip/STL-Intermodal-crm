const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

// Инициализация dotenv
dotenv.config();

// Инициализация Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Импорт моделей (это инициализирует ассоциации)
require('./src/models');

// API Routes
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/clients', require('./src/routes/clientRoutes'));
app.use('/api/carriers', require('./src/routes/carrierRoutes'));
app.use('/api/dictionaries', require('./src/routes/dictionaryRoutes'));
app.use('/api/contacts', require('./src/routes/contactRoutes'));

// Тестовый роут
app.get('/test', (req, res) => res.json({ status: 'ok' }));

// Функция запуска сервера
const startServer = async () => {
    // Подключение к БД и синхронизация моделей
    await connectDB();

    // Запуск сервера
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
};

// Запуск
startServer();
