/**
 * View module для формы перевозчика
 */

/**
 * Рендер формы перевозчика
 * @param {Object|null} carrier - Данные перевозчика для редактирования
 * @param {Array} contacts - Массив контактов перевозчика
 * @returns {string} HTML формы
 */
export function renderCarrierForm(carrier = null, contacts = []) {
    const carrierContacts = carrier?._id
        ? contacts.filter(c => c.carrier?._id === carrier._id || c.carrier === carrier._id)
        : [];

    const contactsListHTML = carrierContacts.length > 0
        ? carrierContacts.map(contact => `
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
        <form id="carrierForm" class="modal-form">
            <input type="hidden" id="carrierId" value="${carrier?._id || ''}">
            
            <div class="form-group">
                <label for="carrierName">Название *</label>
                <input type="text" id="carrierName" name="name" value="${carrier?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="carrierInn">ИНН</label>
                <input type="text" id="carrierInn" name="inn" value="${carrier?.inn || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierContactPerson">Контактное лицо</label>
                <input type="text" id="carrierContactPerson" name="contactPerson" value="${carrier?.contactPerson || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierPhone">Телефон</label>
                <input type="tel" id="carrierPhone" name="phone" value="${carrier?.phone || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierEmail">Email</label>
                <input type="email" id="carrierEmail" name="email" value="${carrier?.email || ''}">
            </div>

            ${carrier?._id ? `
                <div class="company-contacts-section">
                    <h3>Контакты компании</h3>
                    <div class="company-contacts-list">
                        ${contactsListHTML}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" id="btnAddCarrierContact">
                        ➕ Добавить контакт к этой компании
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}
