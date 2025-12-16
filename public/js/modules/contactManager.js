/**
 * Contact Manager - управление контактами
 * Главный модуль, объединяющий все подмодули контактов
 */

import { loadContactsData, saveContact, deleteContact } from './contact/contactCRUD.js';
import { renderContactsList } from './contact/contactUI.js';
import { openContactModal, openContactModalForCompany } from './contact/contactModal.js';
import { handleContactClick, setupCompanyContactHandlers, initContactHandlers } from './contact/contactHandlers.js';

/**
 * Загрузить и отобразить список контактов
 */
export async function loadContacts() {
    const contactsTableBody = document.getElementById('contactsTableBody');
    if (!contactsTableBody) return;

    try {
        const contacts = await loadContactsData();
        renderContactsList(contacts, contactsTableBody);
    } catch (error) {
        contactsTableBody.innerHTML = '<tr><td colspan="7" class="error">Ошибка загрузки контактов</td></tr>';
    }
}

/**
 * Инициализация модуля
 */
export function init() {
    initContactHandlers(
        openContactModal,
        (event) => handleContactClick(event, loadContacts)
    );
}

// Реэкспорт функций для обратной совместимости
export { openContactModal, openContactModalForCompany, saveContact, deleteContact, setupCompanyContactHandlers };

// Экспорт объекта менеджера
export const contactManager = {
    init,
    loadContacts,
    openContactModal,
    openContactModalForCompany,
    saveContact,
    deleteContact,
    handleContactClick: (event) => handleContactClick(event, loadContacts),
    setupCompanyContactHandlers
};
