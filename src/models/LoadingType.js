const mongoose = require('mongoose');

// Обратите внимание: переменная называется loadingTypeSchema
const loadingTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Экспортируем модель с именем 'LoadingType'
module.exports = mongoose.model('LoadingType', loadingTypeSchema);