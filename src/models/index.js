// Файл для настройки ассоциаций между моделями Sequelize
const Client = require('./Client');
const Carrier = require('./Carrier');
const Contact = require('./Contact');
const Order = require('./Order');
const VehicleBodyType = require('./VehicleBodyType');
const PackageType = require('./PackageType');
const LoadingType = require('./LoadingType');

// Настройка ассоциаций Contact
Contact.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Contact.belongsTo(Carrier, { foreignKey: 'carrierId', as: 'carrier' });

// Настройка ассоциаций Order
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Order.belongsTo(Carrier, { foreignKey: 'carrierId', as: 'carrier' });
Order.belongsTo(Contact, { foreignKey: 'clientContactId', as: 'clientContact' });
Order.belongsTo(VehicleBodyType, { foreignKey: 'vehicleBodyTypeId', as: 'vehicleBodyType' });
Order.belongsTo(PackageType, { foreignKey: 'packageTypeId', as: 'packageType' });
Order.belongsTo(LoadingType, { foreignKey: 'loadingTypeId', as: 'loadingType' });

module.exports = {
    Client,
    Carrier,
    Contact,
    Order,
    VehicleBodyType,
    PackageType,
    LoadingType
};
