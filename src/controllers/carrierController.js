const Carrier = require('../models/Carrier');
const createEntityController = require('./baseEntityController');

module.exports = createEntityController(Carrier, 'Перевозчик', 'carrierId');
