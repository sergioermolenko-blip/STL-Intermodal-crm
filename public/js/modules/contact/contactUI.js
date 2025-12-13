/**
 * Contact UI Rendering
 * Отвечает за рендеринг списка контактов и карточек
 */

import { formatDate } from '../../utils/formHelpers.js';

/**
 * Отрендерить список контактов
 * @param {Array} contacts - Массив контактов
 * @param {HTMLElement} container - Контейнер для рендеринга
 */
export function renderContactsList(contacts, container) {
    if (!container) return;

    container.innerHTML = '';

    if (contacts.length === 0) {
        container.innerHTML = '<div class="no-data">Нет контактов</div>';
        return;
    }

    contacts.forEach(contact => {
        const card = renderContactCard(contact);
        container.appendChild(card);
    });
}

/**
 * Отрендерить карточку контакта
 * @param {Object} contact - Данные контакта
 * @returns {HTMLElement} DOM элемент карточки
 */
export function renderContactCard(contact) {
    const card = document.createElement('div');
    card.className = 'contact-card';

    const companyName = contact.client?.name || contact.carrier?.name || 'Не указано';
    const companyType = contact.client ? 'Клиент' : contact.carrier ? 'Перевозчик' : '';

    card.innerHTML = `
        <div class="contact-header">
            <div class="contact-name">${contact.fullName}</div>
            <div class="contact-actions">
                <button class="btn-icon btn-edit-contact" data-id="${contact._id}">✏️</button>
                <button class="btn-icon btn-delete-contact" data-id="${contact._id}">🗑️</button>
            </div>
        </div>
        <div class="contact-body">
            <div class="contact-info">
                <div class="contact-field">
                    <span class="contact-label">📞 Телефон:</span>
                    <span>${contact.phones.join(', ')}</span>
                </div>
                <div class="contact-field">
                    <span class="contact-label">✉️ Email:</span>
                    <span>${contact.email}</span>
                </div>
                <div class="contact-field">
                    <span class="contact-label">🏢 Компания:</span>
                    <span>${companyName} ${companyType ? `(${companyType})` : ''}</span>
                </div>
                ${contact.notes ? `
                    <div class="contact-field">
                        <span class="contact-label">📝 Комментарии:</span>
                        <span>${contact.notes}</span>
                    </div>
                ` : ''}
            </div>
            <div class="contact-status ${contact.isActive ? 'active' : 'inactive'}">
                ${contact.isActive ? '✅ Активен' : '❌ Неактивен'}
            </div>
        </div>
    `;

    return card;
}
