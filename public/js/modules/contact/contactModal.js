/**
 * Contact Modal Logic
 * Отвечает за логику модальных окон контактов
 */

import { appState } from '../../state/appState.js';
import { renderContactForm } from '../../views/ContactFormView.js';
import { modalView } from '../../views/ModalView.js';
import { saveContact } from './contactCRUD.js';
import { loadContacts } from '../contactManager.js';

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
        await saveContact(loadContacts);
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
        await saveContact(loadContacts);
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
 * 
 * Эта функция управляет логикой переключения между клиентом и перевозчиком
 * в форме создания контакта. При выборе типа компании:
 * - Показывается соответствующий select (клиент или перевозчик)
 * - Скрывается альтернативный select
 * - Устанавливается атрибут required для активного select
 * - Снимается required с неактивного select
 * 
 * @example
 * // После рендеринга формы контакта
 * setupRelatedToToggle();
 * // Теперь радио-кнопки управляют видимостью select'ов
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
