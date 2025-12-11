const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    inn: { type: String },
    contactPerson: { type: String },
    phone: { type: String },
    email: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrier', carrierSchema);
