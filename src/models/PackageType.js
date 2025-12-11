const mongoose = require('mongoose');

// Здесь переменная packageTypeSchema
const packageTypeSchema = new mongoose.Schema({
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

// Экспортируем модель с именем 'PackageType'
module.exports = mongoose.model('PackageType', packageTypeSchema);