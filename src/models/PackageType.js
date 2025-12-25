const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PackageType = sequelize.define('PackageType', {
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
    tableName: 'PackageTypes',
    timestamps: true,
    updatedAt: false
});

module.exports = PackageType;