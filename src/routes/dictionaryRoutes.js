const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');

// POST /api/dictionaries/seed - Заполнить все справочники
router.post('/seed', dictionaryController.seedDictionaries);

// POST /api/dictionaries/seed/vehicle-body-types - Заполнить справочник типов кузова
router.post('/seed/vehicle-body-types', dictionaryController.seedVehicleBodyTypes);

// GET /api/dictionaries/vehicle-body-types - Получить все типы кузова
router.get('/vehicle-body-types', dictionaryController.getVehicleBodyTypes);

// GET /api/dictionaries/body-types - Получить все типы кузова (короткий алиас)
router.get('/body-types', dictionaryController.getBodyTypes);

// GET /api/dictionaries - Получить все справочники
router.get('/', dictionaryController.getAllDictionaries);

module.exports = router;
