import { renderCompanyForm } from './CompanyFormView.js';

/**
 * Рендер формы клиента
 * @param {Object|null} client - Данные клиента для редактирования
 * @param {Array} contacts - Массив контактов клиента
 * @returns {string} HTML формы
 */
export function renderClientForm(client = null, contacts = []) {
    return renderCompanyForm('client', client, contacts);
}
