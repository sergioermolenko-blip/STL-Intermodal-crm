import { renderCompanyForm } from './CompanyFormView.js';

/**
 * Рендер формы перевозчика
 * @param {Object|null} carrier - Данные перевозчика для редактирования
 * @param {Array} contacts - Массив контактов перевозчика
 * @returns {string} HTML формы
 */
export function renderCarrierForm(carrier = null, contacts = []) {
    return renderCompanyForm('carrier', carrier, contacts);
}
