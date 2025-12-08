const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Маршрут
    origin: {
        type: String,
        required: [true, 'Пункт отправления обязателен']
    },
    destination: {
        type: String,
        required: [true, 'Пункт назначения обязателен']
    },

    // Груз
    cargo: {
        type: String,
        required: [true, 'Наименование груза обязательно']
    },
    weight: {
        type: Number,
        required: [true, 'Вес груза обязателен'],
        min: [0, 'Вес не может быть отрицательным']
    },

    // Дополнительная информация
    notes: {
        type: String,
        default: ''
    },

    // Статус заказа
    status: {
        type: String,
        enum: ['Новый', 'В обработке', 'В пути', 'Доставлен', 'Отменён'],
        default: 'Новый'
    }
}, {
    timestamps: true // Автоматически добавит createdAt и updatedAt
});

module.exports = mongoose.model('Order', orderSchema);
