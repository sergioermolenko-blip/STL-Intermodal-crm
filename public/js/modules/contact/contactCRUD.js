/**
 * Contact CRUD Operations
 * Отвечает за операции создания, чтения, обновления и удаления контактов
 */

import { fetchContacts, createContact as apiCreateContact, updateContact as apiUpdateContact, deleteContact as apiDeleteContact } from '../../utils/api.js';
import { appState } from '../../state/appState.js';
import { showMessage } from '../../utils/messageHelper.js';
import { modalView } from '../../views/ModalView.js';

/**
 * Загрузить контакты с сервера
 * @returns {Promise<Array>} Массив контактов
 */
export async function loadContactsData() {
    try {
        const contacts = await fetchContacts();
        appState.setContacts(contacts);
        return contacts;
    } catch (error) {
        console.error('❌ Ошибка загрузки контактов:', error);
        throw error;
    }
}

/**
 * Сохранить контакт (создать или обновить)
 */
export async function saveContact() {
    const id = document.getElementById('contactId').value;
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    const phones = [];
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value.trim()) {
            phones.push(input.value.trim());
        }
    });

    const contactData = {
        fullName: formData.get('fullName'),
        phones: phones,
        email: formData.get('email'),
        notes: formData.get('notes') || '',
        isActive: formData.get('isActive') === 'on',
        relatedTo: formData.get('relatedTo'),
        client: formData.get('relatedTo') === 'client' ? formData.get('client') : null,
        carrier: formData.get('relatedTo') === 'carrier' ? formData.get('carrier') : null
    };

    try {
        if (id) {
            await apiUpdateContact(id, contactData);
        } else {
            await apiCreateContact(contactData);
        }

        showMessage(`Контакт успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();

        // Возвращаем true для индикации успеха
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения контакта:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Удалить контакт
 * @param {string} id - ID контакта
 */
export async function deleteContact(id) {
    if (!confirm('Вы уверены, что хотите удалить этот контакт?')) return false;

    try {
        await apiDeleteContact(id);
        showMessage('Контакт успешно удален!', 'success');
        return true;
    } catch (error) {
        console.error('❌ Ошибка удаления контакта:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
        return false;
    }
}
