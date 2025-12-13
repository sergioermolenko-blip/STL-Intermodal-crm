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
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;

    try {
        const contacts = await loadContactsData();
        renderContactsList(contacts, contactsList);
    } catch (error) {
        contactsList.innerHTML = '<div class="error">Ошибка загрузки контактов</div>';
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
