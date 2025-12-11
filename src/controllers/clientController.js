const Client = require('../models/Client');
const createEntityController = require('./baseEntityController');

module.exports = createEntityController(Client, 'Клиент', 'client');
