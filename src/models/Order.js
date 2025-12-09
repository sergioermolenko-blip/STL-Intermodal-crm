const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Маршрут (вложенный объект)
    route: {
        from: { type: String, required: true },
        to: { type: String, required: true }
    },

    // Данные о грузе (вложенный объект)
    cargo: {
        name: { type: String, required: true },
        weight: { type: Number }
    },

    // Даты
    dateLoading: { type: Date },
    dateUnloading: { type: Date },

    // Связь с Клиентом
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },

    // Связь с Перевозчиком
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrier'
    },

    // Тип кузова
    vehicleBodyType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleBodyType'
    },

    // Финансы
    clientRate: { type: Number },
    carrierRate: { type: Number },
    margin: { type: Number },

    // Системные поля
    status: { type: String, default: 'new' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
