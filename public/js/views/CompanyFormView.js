/**
 * Универсальная форма для компаний (Client/Carrier)
 * @param {string} type - Тип компании: 'client' или 'carrier'
 * @param {Object|null} entity - Данные компании для редактирования
 * @param {Array} contacts - Массив контактов компании
 * @returns {string} HTML формы
 */
export function renderCompanyForm(type, entity = null, contacts = []) {
    const isClient = type === 'client';
    const formId = `${type}Form`;
    const entityId = `${type}Id`;

    const entityContacts = entity?.id
        ? contacts.filter(c => {
            const field = isClient ? c.client : c.carrier;
            return field?.id === entity.id || field === entity.id;
        })
        : [];

    const contactsListHTML = entityContacts.length > 0
        ? entityContacts.map(contact => `
            <div class="company-contact-item">
                <div class="company-contact-info">
                    <div class="company-contact-name">👤 ${contact.fullName}</div>
                    <div class="company-contact-details">
                        📞 ${contact.phones[0]} | ✉️ ${contact.email}
                    </div>
                </div>
                <div class="company-contact-actions">
                    <button type="button" class="btn-icon btn-edit-company-contact" data-contact-id="${contact.id}">✏️</button>
                    <button type="button" class="btn-icon btn-delete-company-contact" data-contact-id="${contact.id}">🗑️</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">У этой компании пока нет контактов</p>';

    return `
        <form id="${formId}" class="modal-form">
            <input type="hidden" id="${entityId}" value="${entity?.id || ''}">
            
            <div class="form-group">
                <label for="${type}Name">Название *</label>
                <input type="text" id="${type}Name" name="name" value="${entity?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="${type}Inn">ИНН</label>
                <input type="text" id="${type}Inn" name="inn" value="${entity?.inn || ''}">
            </div>
            
            <div class="form-group">
                <label for="${type}ContactPerson">Контактное лицо</label>
                <input type="text" id="${type}ContactPerson" name="contactPerson" value="${entity?.contactPerson || ''}">
            </div>
            
            <div class="form-group">
                <label for="${type}Phone">Телефон</label>
                <input type="tel" id="${type}Phone" name="phone" value="${entity?.phone || ''}">
            </div>
            
            <div class="form-group">
                <label for="${type}Email">Email</label>
                <input type="email" id="${type}Email" name="email" value="${entity?.email || ''}">
            </div>

            ${entity?.id ? `
                <div class="company-contacts-section">
                    <h3>Контакты компании</h3>
                    <div class="company-contacts-list">
                        ${contactsListHTML}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" id="btnAdd${isClient ? 'Client' : 'Carrier'}Contact">
                        ➕ Добавить контакт к этой компании
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}
