const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Client', clientSchema);
