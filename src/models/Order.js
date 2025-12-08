const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Связь с Клиентом
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    // Связь с Перевозчиком
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrier',
        required: true
    },
    // Данные о грузе
    route_from: { type: String, required: true },
    route_to: { type: String, required: true },
    cargo_name: { type: String, required: true },
    cargo_weight: { type: Number, required: true },

    // Даты
    date_loading: { type: Date, required: true },
    date_unloading: { type: Date, required: true },

    // Финансы
    client_rate: { type: Number, required: true }, // Ставка Клиента
    carrier_rate: { type: Number, required: true }, // Ставка Перевозчика
    margin: { type: Number }, // Маржа

    // Системные поля
    status: { type: String, default: 'new' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
