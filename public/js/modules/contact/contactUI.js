/**
 * Contact UI Rendering
 * Отвечает за рендеринг списка контактов в виде таблицы
 */

import { formatDate } from '../../utils/formHelpers.js';

/**
 * Отрендерить список контактов
 * @param {Array} contacts - Массив контактов
 * @param {HTMLElement} tbody - Tbody элемент таблицы для рендеринга
 */
export function renderContactsList(contacts, tbody) {
    if (!tbody) return;

    tbody.innerHTML = '';

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет контактов</td></tr>';
        return;
    }

    contacts.forEach(contact => {
        const row = renderContactRow(contact);
        tbody.appendChild(row);
    });
}

/**
 * Отрендерить строку контакта
 * @param {Object} contact - Данные контакта
 * @returns {HTMLElement} DOM элемент строки таблицы
 */
export function renderContactRow(contact) {
    const tr = document.createElement('tr');

    const companyName = contact.client?.name || contact.carrier?.name || '-';
    const companyType = contact.client ? 'Клиент' : contact.carrier ? 'Перевозчик' : '-';
    const status = contact.isActive ? '✅ Активен' : '❌ Неактивен';
    const phones = contact.phones && contact.phones.length > 0 ? contact.phones.join(', ') : '-';

    tr.innerHTML = `
        <td>${contact.fullName || '-'}</td>
        <td>${phones}</td>
        <td>${contact.email || '-'}</td>
        <td>${companyName}</td>
        <td>${companyType}</td>
        <td>${status}</td>
        <td class="actions">
            <button class="btn-icon btn-edit-contact" data-id="${contact.id}">✏️</button>
            <button class="btn-icon btn-delete-contact" data-id="${contact.id}">🗑️</button>
        </td>
    `;

    return tr;
}
