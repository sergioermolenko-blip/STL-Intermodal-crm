const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phones: {
        type: DataTypes.JSON, // Массив телефонов хранится как JSON
        allowNull: false,
        defaultValue: []
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    relatedTo: {
        type: DataTypes.ENUM('client', 'carrier'),
        allowNull: false
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    carrierId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Carriers',
            key: 'id'
        }
    }
}, {
    tableName: 'Contacts',
    timestamps: true,
    hooks: {
        // Валидация перед сохранением (аналог Mongoose pre-save hook)
        beforeSave: (contact) => {
            if (contact.relatedTo === 'client' && !contact.clientId) {
                throw new Error('Client is required when relatedTo is client');
            }
            if (contact.relatedTo === 'carrier' && !contact.carrierId) {
                throw new Error('Carrier is required when relatedTo is carrier');
            }
            if (!contact.phones || contact.phones.length === 0) {
                throw new Error('At least one phone number is required');
            }
        }
    }
});

module.exports = Contact;
