const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Маршрут (сохраняем как отдельные поля)
    routeFrom: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'route_from'
    },
    routeTo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'route_to'
    },
    // Данные о грузе
    cargoName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cargo_name'
    },
    cargoWeight: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'cargo_weight'
    },
    // Даты
    dateLoading: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateUnloading: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Связи с другими таблицами (Foreign Keys)
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Clients',
            key: 'id'
        }
    },
    clientContactId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Contacts',
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
    },
    vehicleBodyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'VehicleBodyTypes',
            key: 'id'
        }
    },
    packageTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'PackageTypes',
            key: 'id'
        }
    },
    loadingTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'LoadingTypes',
            key: 'id'
        }
    },
    // Финансы
    clientRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    carrierRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    margin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    // === НОВЫЕ ПОЛЯ (Фаза 1) ===
    // Уникальный номер заказа
    shipmentNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Статус заказа
    // Допустимые: draft, inquiry, carrier_quote, quotes_received, proposal_draft,
    // proposal_sent, client_approved, booking, confirmed, picked_up, export_customs,
    // departed, in_transit, arrived, import_customs, partial, delivered,
    // invoiced, paid, closed, expired, declined, cancelled, hold, problem, returned, lost
    status: {
        type: DataTypes.STRING,
        defaultValue: 'draft'
    },
    // Тип транспорта: auto, rail, sea, air, multimodal, tbd
    transportMode: {
        type: DataTypes.STRING,
        defaultValue: 'tbd'
    },
    // Направление: import, export, domestic, transit
    direction: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Orders',
    timestamps: true,
    updatedAt: false
});

module.exports = Order;
