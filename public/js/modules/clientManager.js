/**
 * Client Manager - управление клиентами
 */

import { fetchClients, createClient, updateClient } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { showMessage } from '../utils/messageHelper.js';
import { formatDate } from '../utils/formHelpers.js';
import { renderClientForm } from '../views/ClientFormView.js';
import { modalView } from '../views/ModalView.js';

/**
 * Загрузить и отобразить список клиентов
 */
export async function loadClients() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) {
        console.warn('⚠️ clientsTableBody не найден в DOM');
        return;
    }

    try {
        console.log('📥 Загрузка клиентов...');
        const clients = await fetchClients();
        console.log(`✅ Загружено клиентов: ${clients.length}`);
        appState.setClients(clients);

        tbody.innerHTML = '';

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет клиентов</td></tr>';
            return;
        }

        // Сортировка: новые клиенты сверху
        clients.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
        });

        clients.forEach(client => {
            const tr = document.createElement('tr');
            const createdDate = client.createdAt || client.created_at;
            const createdAt = createdDate ? formatDate(createdDate) : '-';

            tr.innerHTML = `
                <td>${client.name || '-'}</td>
                <td>${client.inn || '-'}</td>
                <td>${client.contactPerson || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>${client.email || '-'}</td>
                <td>${createdAt}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${client._id}" data-type="client">✏️</button>
                    <button class="btn-icon btn-delete" data-id="${client._id}" data-type="client">🗑️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="error">Ошибка загрузки клиентов</td></tr>';
    }
}

/**
 * Открыть модальное окно клиента
 * @param {string|null} id - ID клиента для редактирования
 * @param {Function} setupCompanyContactHandlers - Функция для настройки обработчиков контактов
 */
export function openClientModal(id, setupCompanyContactHandlers) {
    const client = id ? appState.getClientById(id) : null;
    const title = id ? 'Редактирование клиента' : 'Новый клиент';
    const formHTML = renderClientForm(client, appState.contacts);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveClient();
    });

    if (id && setupCompanyContactHandlers) {
        setupCompanyContactHandlers('client', id);
    }
}

/**
 * Сохранить клиента (создать или обновить)
 */
export async function saveClient() {
    const id = document.getElementById('clientId').value;
    const form = document.getElementById('clientForm');
    const formData = new FormData(form);

    const clientData = {
        name: formData.get('name'),
        inn: formData.get('inn'),
        contactPerson: formData.get('contactPerson'),
        phone: formData.get('phone'),
        email: formData.get('email')
    };

    try {
        if (id) {
            await updateClient(id, clientData);
        } else {
            await createClient(clientData);
        }

        showMessage(`Клиент успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка сохранения клиента:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Загрузить контакты клиента для формы заказа
 */
export async function loadClientContacts() {
    const clientSelect = document.getElementById('client');
    const contactSelect = document.getElementById('clientContact');

    if (!clientSelect || !contactSelect) return;

    const clientId = clientSelect.value;
    contactSelect.innerHTML = '<option value="">Выберите контакт (опционально)</option>';

    if (!clientId) return;

    const clientContacts = appState.contacts.filter(c =>
        c.client?._id === clientId || c.client === clientId
    );

    clientContacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact._id;
        option.textContent = `${contact.fullName} (${contact.phones[0]})`;
        contactSelect.appendChild(option);
    });
}

/**
 * Инициализация модуля
 */
export function init() {
    const btnAddClient = document.getElementById('btnAddClient');
    if (btnAddClient) {
        btnAddClient.addEventListener('click', () => openClientModal(null, null));
    }

    const clientSelect = document.getElementById('client');
    if (clientSelect) {
        clientSelect.addEventListener('change', loadClientContacts);
    }
}

export const clientManager = {
    init,
    loadClients,
    openClientModal,
    saveClient,
    loadClientContacts
};
