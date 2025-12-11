/**
 * Carrier Manager - управление перевозчиками
 */

import { fetchCarriers, createCarrier, updateCarrier } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { showMessage } from '../utils/messageHelper.js';
import { formatDate } from '../utils/formHelpers.js';
import { renderCarrierForm } from '../views/CarrierFormView.js';
import { modalView } from '../views/ModalView.js';

/**
 * Загрузить и отобразить список перевозчиков
 */
export async function loadCarriers() {
    const tbody = document.getElementById('carriersTableBody');
    if (!tbody) return;

    try {
        const carriers = await fetchCarriers();
        appState.setCarriers(carriers);

        tbody.innerHTML = '';

        if (carriers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет перевозчиков</td></tr>';
            return;
        }

        // Сортировка: новые перевозчики сверху
        carriers.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
        });

        carriers.forEach(carrier => {
            const tr = document.createElement('tr');
            const createdDate = carrier.createdAt || carrier.created_at;
            const createdAt = createdDate ? formatDate(createdDate) : '-';

            tr.innerHTML = `
                <td>${carrier.name || '-'}</td>
                <td>${carrier.inn || '-'}</td>
                <td>${carrier.contactPerson || '-'}</td>
                <td>${carrier.phone || '-'}</td>
                <td>${carrier.email || '-'}</td>
                <td>${createdAt}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${carrier._id}" data-type="carrier">✏️</button>
                    <button class="btn-icon btn-delete" data-id="${carrier._id}" data-type="carrier">🗑️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки перевозчиков:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="error">Ошибка загрузки перевозчиков</td></tr>';
    }
}

/**
 * Открыть модальное окно перевозчика
 * @param {string|null} id - ID перевозчика для редактирования
 * @param {Function} setupCompanyContactHandlers - Функция для настройки обработчиков контактов
 */
export function openCarrierModal(id, setupCompanyContactHandlers) {
    const carrier = id ? appState.getCarrierById(id) : null;
    const title = id ? 'Редактирование перевозчика' : 'Новый перевозчик';
    const formHTML = renderCarrierForm(carrier, appState.contacts);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveCarrier();
    });

    if (id && setupCompanyContactHandlers) {
        setupCompanyContactHandlers('carrier', id);
    }
}

/**
 * Сохранить перевозчика (создать или обновить)
 */
export async function saveCarrier() {
    const id = document.getElementById('carrierId').value;
    const form = document.getElementById('carrierForm');
    const formData = new FormData(form);

    const carrierData = {
        name: formData.get('name'),
        inn: formData.get('inn'),
        contactPerson: formData.get('contactPerson'),
        phone: formData.get('phone'),
        email: formData.get('email')
    };

    try {
        if (id) {
            await updateCarrier(id, carrierData);
        } else {
            await createCarrier(carrierData);
        }

        showMessage(`Перевозчик успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка сохранения перевозчика:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Инициализация модуля
 */
export function init() {
    const btnAddCarrier = document.getElementById('btnAddCarrier');
    if (btnAddCarrier) {
        btnAddCarrier.addEventListener('click', () => openCarrierModal(null, null));
    }
}

export const carrierManager = {
    init,
    loadCarriers,
    openCarrierModal,
    saveCarrier
};
