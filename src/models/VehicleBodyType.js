const mongoose = require('mongoose');

const vehicleBodyTypeSchema = new mongoose.Schema({
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
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VehicleBodyType', vehicleBodyTypeSchema);
