/**
 * Contact Manager - управление контактами
 */

import { fetchContacts, createContact, updateContact, deleteContact as apiDeleteContact } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { showMessage } from '../utils/messageHelper.js';
import { formatDate } from '../utils/formHelpers.js';
import { renderContactForm } from '../views/ContactFormView.js';
import { modalView } from '../views/ModalView.js';

/**
 * Загрузить и отобразить список контактов
 */
export async function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;

    try {
        const contacts = await fetchContacts();
        appState.setContacts(contacts);

        contactsList.innerHTML = '';

        if (contacts.length === 0) {
            contactsList.innerHTML = '<div class="no-data">Нет контактов</div>';
            return;
        }

        // Сортировка: новые контакты сверху
        contacts.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
        });

        contacts.forEach(contact => {
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

            contactsList.appendChild(card);
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки контактов:', error);
        contactsList.innerHTML = '<div class="error">Ошибка загрузки контактов</div>';
    }
}

/**
 * Открыть модальное окно контакта
 * @param {string|null} id - ID контакта для редактирования
 */
export function openContactModal(id) {
    const contact = id ? appState.getContactById(id) : null;
    const title = id ? 'Редактирование контакта' : 'Новый контакт';
    const formHTML = renderContactForm(contact, appState.clients, appState.carriers);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveContact();
    });

    setupPhoneDynamicFields();
    setupRelatedToToggle();
}

/**
 * Открыть модальное окно контакта для компании
 * @param {string} type - Тип компании ('client' или 'carrier')
 * @param {string} companyId - ID компании
 */
export function openContactModalForCompany(type, companyId) {
    const title = 'Новый контакт';
    const formHTML = renderContactForm(null, appState.clients, appState.carriers);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveContact();
    });

    setTimeout(() => {
        const relatedToRadio = document.querySelector(`input[name="relatedTo"][value="${type}"]`);
        if (relatedToRadio) {
            relatedToRadio.checked = true;
            relatedToRadio.dispatchEvent(new Event('change'));
        }

        const companySelect = document.getElementById(type === 'client' ? 'contactClient' : 'contactCarrier');
        if (companySelect) {
            companySelect.value = companyId;
        }
    }, 100);

    setupPhoneDynamicFields();
    setupRelatedToToggle();
}

/**
 * Настроить динамические поля телефонов
 */
export function setupPhoneDynamicFields() {
    const btnAddPhone = document.getElementById('btnAddPhone');
    const phonesContainer = document.getElementById('phonesContainer');

    if (!btnAddPhone || !phonesContainer) return;

    btnAddPhone.addEventListener('click', () => {
        const currentPhones = phonesContainer.querySelectorAll('.phone-input-group');
        const newIndex = currentPhones.length;

        const phoneGroup = document.createElement('div');
        phoneGroup.className = 'phone-input-group';
        phoneGroup.dataset.index = newIndex;
        phoneGroup.innerHTML = `
            <input type="tel" name="phone_${newIndex}" required>
            <button type="button" class="btn-remove-phone">✖</button>
        `;

        phonesContainer.appendChild(phoneGroup);
    });

    phonesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-phone')) {
            e.target.closest('.phone-input-group').remove();
        }
    });
}

/**
 * Настроить переключатель типа компании
 */
export function setupRelatedToToggle() {
    const relatedToRadios = document.querySelectorAll('input[name="relatedTo"]');
    const clientSelectGroup = document.getElementById('clientSelectGroup');
    const carrierSelectGroup = document.getElementById('carrierSelectGroup');

    if (!relatedToRadios.length || !clientSelectGroup || !carrierSelectGroup) return;

    relatedToRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'client') {
                clientSelectGroup.style.display = '';
                carrierSelectGroup.style.display = 'none';
                document.getElementById('contactClient').required = true;
                document.getElementById('contactCarrier').required = false;
            } else {
                clientSelectGroup.style.display = 'none';
                carrierSelectGroup.style.display = '';
                document.getElementById('contactClient').required = false;
                document.getElementById('contactCarrier').required = true;
            }
        });
    });
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
            await updateContact(id, contactData);
        } else {
            await createContact(contactData);
        }

        showMessage(`Контакт успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadContacts();
    } catch (error) {
        console.error('❌ Ошибка сохранения контакта:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Удалить контакт
 * @param {string} id - ID контакта
 */
export async function deleteContact(id) {
    if (!confirm('Вы уверены, что хотите удалить этот контакт?')) return;

    try {
        await apiDeleteContact(id);
        showMessage('Контакт успешно удален!', 'success');
        loadContacts();
    } catch (error) {
        console.error('❌ Ошибка удаления контакта:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Обработчик кликов по контактам
 * @param {Event} event - Событие клика
 */
export function handleContactClick(event) {
    const editBtn = event.target.closest('.btn-edit-contact');
    const deleteBtn = event.target.closest('.btn-delete-contact');

    if (editBtn) {
        const id = editBtn.dataset.id;
        openContactModal(id);
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteContact(id);
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
        btnAddContact.addEventListener('click', () => openContactModalForCompany(type, companyId));
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
            deleteContact(contactId);
        });
    });
}

/**
 * Инициализация модуля
 */
export function init() {
    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact) {
        btnAddContact.addEventListener('click', () => openContactModal(null));
    }

    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        contactsList.addEventListener('click', handleContactClick);
    }
}

export const contactManager = {
    init,
    loadContacts,
    openContactModal,
    openContactModalForCompany,
    saveContact,
    deleteContact,
    handleContactClick,
    setupCompanyContactHandlers
};
