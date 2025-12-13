/**
 * Contact Event Handlers
 * Отвечает за обработку событий и инициализацию
 */

import { openContactModal } from './contactModal.js';
import { deleteContact } from './contactCRUD.js';

/**
 * Обработчик кликов по контактам
 * @param {Event} event - Событие клика
 * @param {Function} reloadCallback - Функция для перезагрузки списка
 */
export function handleContactClick(event, reloadCallback) {
    const editBtn = event.target.closest('.btn-edit-contact');
    const deleteBtn = event.target.closest('.btn-delete-contact');

    if (editBtn) {
        const id = editBtn.dataset.id;
        openContactModal(id);
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        handleDeleteContact(id, reloadCallback);
    }
}

/**
 * Обработчик удаления контакта
 * @param {string} id - ID контакта
 * @param {Function} reloadCallback - Функция для перезагрузки списка
 */
async function handleDeleteContact(id, reloadCallback) {
    const success = await deleteContact(id);
    if (success && reloadCallback) {
        reloadCallback();
    }
}

/**
 * Настроить обработчики контактов компании
 * @param {string} type - Тип компании ('client' или 'carrier')
 * @param {string} companyId - ID компании
 */
export function setupCompanyContactHandlers(type, companyId) {
    const btnAddContact = document.getElementById(type === 'client' ? 'btnAddClientContact' : 'btnAddCarrierContact');
    if (btnAddContact) {
        // Импортируем динамически, чтобы избежать циклических зависимостей
        import('./contactModal.js').then(({ openContactModalForCompany }) => {
            btnAddContact.addEventListener('click', () => openContactModalForCompany(type, companyId));
        });
    }

    const editButtons = document.querySelectorAll('.btn-edit-company-contact');
    const deleteButtons = document.querySelectorAll('.btn-delete-company-contact');

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactId = btn.dataset.contactId;
            openContactModal(contactId);
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactId = btn.dataset.contactId;
            import('./contactCRUD.js').then(({ deleteContact }) => {
                deleteContact(contactId);
            });
        });
    });
}

/**
 * Инициализация модуля контактов
 * @param {Function} openModalCallback - Функция для открытия модала
 * @param {Function} handleClickCallback - Функция для обработки кликов
 */
export function initContactHandlers(openModalCallback, handleClickCallback) {
    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact) {
        btnAddContact.addEventListener('click', () => openModalCallback(null));
    }

    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        contactsList.addEventListener('click', handleClickCallback);
    }
}
