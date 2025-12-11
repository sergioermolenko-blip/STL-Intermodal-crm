const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phones: [{
        type: String,
        required: true
    }],
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    notes: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    relatedTo: {
        type: String,
        enum: ['client', 'carrier'],
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrier'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Валидация: должен быть заполнен либо client, либо carrier
contactSchema.pre('save', function(next) {
    if (this.relatedTo === 'client' && !this.client) {
        next(new Error('Client is required when relatedTo is client'));
    }
    if (this.relatedTo === 'carrier' && !this.carrier) {
        next(new Error('Carrier is required when relatedTo is carrier'));
    }
    if (this.phones.length === 0) {
        next(new Error('At least one phone number is required'));
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Contact', contactSchema);
