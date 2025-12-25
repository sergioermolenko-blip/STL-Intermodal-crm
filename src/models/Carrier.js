const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Carrier = sequelize.define('Carrier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    inn: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Carriers',
    timestamps: true,
    updatedAt: false
});

module.exports = Carrier;
