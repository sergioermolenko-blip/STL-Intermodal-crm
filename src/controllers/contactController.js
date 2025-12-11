const Contact = require('../models/Contact');

exports.getAllContacts = async (req, res) => {
    try {
        const { client, carrier, isActive } = req.query;

        const filter = {};
        if (client) filter.client = client;
        if (carrier) filter.carrier = carrier;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const contacts = await Contact.find(filter)
            .populate('client', 'name')
            .populate('carrier', 'name')
            .sort({ createdAt: -1 });

        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('client', 'name')
            .populate('carrier', 'name');

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
        await newContact.populate('client carrier');
        res.status(201).json(newContact);
    } catch (error) {
        console.error("❌ Ошибка при создании контакта:", error);
        res.status(400).json({ message: "Ошибка создания: " + error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contactId = req.params.id;

        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            req.body,
            { new: true, runValidators: true }
        ).populate('client carrier');

        if (!updatedContact) {
            return res.status(404).json({ message: 'Контакт не найден' });
        }

        res.json(updatedContact);
    } catch (err) {
        console.error("❌ Ошибка при обновлении контакта:", err);
        res.status(400).json({ message: "Ошибка обновления: " + err.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Контакт удален' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
