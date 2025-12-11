/**
 * View module для формы клиента
 */

/**
 * Рендер формы клиента
 * @param {Object|null} client - Данные клиента для редактирования
 * @param {Array} contacts - Массив контактов клиента
 * @returns {string} HTML формы
 */
export function renderClientForm(client = null, contacts = []) {
    const clientContacts = client?._id
        ? contacts.filter(c => c.client?._id === client._id || c.client === client._id)
        : [];

    const contactsListHTML = clientContacts.length > 0
        ? clientContacts.map(contact => `
            <div class="company-contact-item">
                <div class="company-contact-info">
                    <div class="company-contact-name">👤 ${contact.fullName}</div>
                    <div class="company-contact-details">
                        📞 ${contact.phones[0]} | ✉️ ${contact.email}
                    </div>
                </div>
                <div class="company-contact-actions">
                    <button type="button" class="btn-icon btn-edit-company-contact" data-contact-id="${contact._id}">✏️</button>
                    <button type="button" class="btn-icon btn-delete-company-contact" data-contact-id="${contact._id}">🗑️</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">У этой компании пока нет контактов</p>';

    return `
        <form id="clientForm" class="modal-form">
            <input type="hidden" id="clientId" value="${client?._id || ''}">
            
            <div class="form-group">
                <label for="clientName">Название *</label>
                <input type="text" id="clientName" name="name" value="${client?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="clientInn">ИНН</label>
                <input type="text" id="clientInn" name="inn" value="${client?.inn || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientContactPerson">Контактное лицо</label>
                <input type="text" id="clientContactPerson" name="contactPerson" value="${client?.contactPerson || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientPhone">Телефон</label>
                <input type="tel" id="clientPhone" name="phone" value="${client?.phone || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientEmail">Email</label>
                <input type="email" id="clientEmail" name="email" value="${client?.email || ''}">
            </div>

            ${client?._id ? `
                <div class="company-contacts-section">
                    <h3>Контакты компании</h3>
                    <div class="company-contacts-list">
                        ${contactsListHTML}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" id="btnAddClientContact">
                        ➕ Добавить контакт к этой компании
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}
