const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LoadingType = sequelize.define('LoadingType', {
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
    tableName: 'LoadingTypes',
    timestamps: true, // createdAt и updatedAt автоматически
    updatedAt: false  // отключаем updatedAt, оставляем только createdAt
});

module.exports = LoadingType;