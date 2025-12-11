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

    // Тип упаковки
    packageType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PackageType'
    },

    // Тип загрузки
    loadingType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoadingType'
    },

    // Финансы
    clientRate: { type: Number },
    carrierRate: { type: Number },
    margin: { type: Number },

    // Системные поля
    status: { type: String, default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
