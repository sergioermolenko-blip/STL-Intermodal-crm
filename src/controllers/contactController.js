const Contact = require('../models/Contact');
const Client = require('../models/Client');
const Carrier = require('../models/Carrier');

exports.getAllContacts = async (req, res) => {
    try {
        const { client, carrier, isActive } = req.query;

        const filter = {};
        if (client) filter.clientId = client;
        if (carrier) filter.carrierId = carrier;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const contacts = await Contact.findAll({
            where: filter,
            include: [
                { model: Client, as: 'client', attributes: ['name'] },
                { model: Carrier, as: 'carrier', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id, {
            include: [
                { model: Client, as: 'client', attributes: ['name'] },
                { model: Carrier, as: 'carrier', attributes: ['name'] }
            ]
        });

        if (!contact) {
            return res.status(404).json({ message: 'Контакт не найден' });
        }

        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createContact = async (req, res) => {
    try {
        const newContact = await Contact.create(req.body);

        // Загружаем связанные данные
        await newContact.reload({
            include: [
                { model: Client, as: 'client' },
                { model: Carrier, as: 'carrier' }
            ]
        });

        res.status(201).json(newContact);
    } catch (error) {
        console.error("❌ Ошибка при создании контакта:", error);
        res.status(400).json({ message: "Ошибка создания: " + error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;

        const [updatedCount] = await Contact.update(req.body, {
            where: { id: contactId }
        });

        if (updatedCount === 0) {
            return res.status(404).json({ message: 'Контакт не найден' });
        }

        const updatedContact = await Contact.findByPk(contactId, {
            include: [
                { model: Client, as: 'client' },
                { model: Carrier, as: 'carrier' }
            ]
        });

        res.json(updatedContact);
    } catch (err) {
        console.error("❌ Ошибка при обновлении контакта:", err);
        res.status(400).json({ message: "Ошибка обновления: " + err.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Контакт удален' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
