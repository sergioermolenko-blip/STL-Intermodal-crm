/**
 * Base Company Manager - фабрика для создания менеджеров компаний (клиенты/перевозчики)
 * Устраняет дублирование кода между clientManager и carrierManager
 */

import { appState } from '../state/appState.js';
import { showMessage } from '../utils/messageHelper.js';
import { formatDate } from '../utils/formHelpers.js';
import { modalView } from '../views/ModalView.js';

/**
 * Создать менеджер компании с универсальной логикой
 * @param {Object} config - Конфигурация менеджера
 * @param {string} config.type - Тип компании ('client' или 'carrier')
 * @param {string} config.entityNameRu - Название сущности на русском
 * @param {Object} config.apiMethods - API методы (fetch, create, update)
 * @param {Function} config.formRenderer - Функция рендеринга формы
 * @param {Object} config.stateMethods - Методы работы с состоянием
 * @param {string} config.tableBodyId - ID tbody таблицы
 * @param {string} config.buttonId - ID кнопки добавления
 * @param {string} config.selectId - ID select элемента
 * @param {string} config.contactSelectId - ID select элемента контактов
 * @param {string} config.formIdPrefix - Префикс ID формы
 * @returns {Object} Объект с методами менеджера
 */
export function createCompanyManager(config) {
    const {
        type,
        entityNameRu,
        apiMethods,
        formRenderer,
        stateMethods,
        tableBodyId,
        buttonId,
        selectId,
        contactSelectId,
        formIdPrefix
    } = config;

    /**
     * Загрузить и отобразить список компаний
     */
    async function load() {
        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return;

        try {
            const items = await apiMethods.fetch();
            stateMethods.setAll(items);

            tbody.innerHTML = '';

            if (items.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="no-data">Нет ${entityNameRu}ов</td></tr>`;
                return;
            }

            // Данные уже отсортированы на backend по createdAt (новые сверху)

            items.forEach(item => {
                const tr = document.createElement('tr');
                const createdDate = item.createdAt || item.created_at;
                const createdAt = createdDate ? formatDate(createdDate) : '-';

                tr.innerHTML = `
                    <td>${item.name || '-'}</td>
                    <td>${item.inn || '-'}</td>
                    <td>${item.contactPerson || '-'}</td>
                    <td>${item.phone || '-'}</td>
                    <td>${item.email || '-'}</td>
                    <td>${createdAt}</td>
                    <td class="actions">
                        <button class="btn-icon btn-edit" data-id="${item.id}" data-type="${type}">✏️</button>
                        <button class="btn-icon btn-delete" data-id="${item.id}" data-type="${type}">🗑️</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error(`❌ Ошибка загрузки ${entityNameRu}ов:`, error);
            tbody.innerHTML = `<tr><td colspan="7" class="error">Ошибка загрузки ${entityNameRu}ов</td></tr>`;
        }
    }

    /**
     * Открыть модальное окно компании
     * @param {string|null} id - ID компании для редактирования
     * @param {Function} setupCompanyContactHandlers - Функция для настройки обработчиков контактов
     */
    function openModal(id, setupCompanyContactHandlers) {
        const item = id ? stateMethods.getById(id) : null;
        const title = id ? `Редактирование ${entityNameRu}а` : `Новый ${entityNameRu}`;
        const formHTML = formRenderer(item, appState.contacts);

        modalView.showForm(title, formHTML, async (event) => {
            event.preventDefault();
            await save();
        });

        if (id && setupCompanyContactHandlers) {
            setupCompanyContactHandlers(type, id);
        }
    }

    /**
     * Сохранить компанию (создать или обновить)
     */
    async function save() {
        const id = document.getElementById(`${formIdPrefix}Id`).value;
        const form = document.getElementById(`${formIdPrefix}Form`);
        const formData = new FormData(form);

        const itemData = {
            name: formData.get('name'),
            inn: formData.get('inn'),
            contactPerson: formData.get('contactPerson'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        try {
            if (id) {
                await apiMethods.update(id, itemData);
            } else {
                await apiMethods.create(itemData);
            }

            showMessage(`${entityNameRu.charAt(0).toUpperCase() + entityNameRu.slice(1)} успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
            modalView.close();
            load();
        } catch (error) {
            console.error(`❌ Ошибка сохранения ${entityNameRu}а:`, error);
            showMessage(`Ошибка: ${error.message}`, 'error');
        }
    }

    /**
     * Загрузить контакты компании для формы заказа
     */
    async function loadContacts() {
        const companySelect = document.getElementById(selectId);
        const contactSelect = document.getElementById(contactSelectId);

        if (!companySelect || !contactSelect) return;

        const companyId = companySelect.value;
        contactSelect.innerHTML = '<option value="">Выберите контакт (опционально)</option>';

        if (!companyId) return;

        const contacts = appState.contacts.filter(c =>
            c[type]?.id === companyId || c[type] === companyId
        );

        contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.id;
            option.textContent = `${contact.fullName} (${contact.phones[0]})`;
            contactSelect.appendChild(option);
        });
    }

    /**
     * Инициализация модуля
     */
    function init() {
        const btnAdd = document.getElementById(buttonId);
        if (btnAdd) {
            btnAdd.addEventListener('click', () => openModal(null, null));
        }

        const companySelect = document.getElementById(selectId);
        if (companySelect) {
            companySelect.addEventListener('change', loadContacts);
        }
    }

    // Возвращаем публичный API
    return {
        init,
        load,
        openModal,
        save,
        loadContacts
    };
}
