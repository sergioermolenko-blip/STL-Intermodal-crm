const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    driverName: { type: String },
    truckNumber: { type: String },
    phone: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrier', carrierSchema);
