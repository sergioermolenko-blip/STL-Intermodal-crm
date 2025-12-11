const express = require('express');
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contactController');

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
