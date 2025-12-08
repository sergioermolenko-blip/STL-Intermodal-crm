const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const orderRoutes = require('./src/routes/orderRoutes');

// Инициализация dotenv
dotenv.config();

// Инициализация Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// API Routes
app.use('/api/orders', orderRoutes);

// Тестовый роут
app.get('/test', (req, res) => res.json({ status: 'ok' }));

// Функция запуска сервера
const startServer = async () => {
    // Подключение к БД
    await connectDB();

    // Запуск сервера
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
};

// Запуск
startServer();
