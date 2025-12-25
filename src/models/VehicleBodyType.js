const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VehicleBodyType = sequelize.define('VehicleBodyType', {
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
    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'VehicleBodyTypes',
    timestamps: true,
    updatedAt: false
});

module.exports = VehicleBodyType;
