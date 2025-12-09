// ============================================
// IMPORTS
// ============================================
import { renderOrderForm } from './views/OrderFormView.js';
import { modalView } from './views/ModalView.js';

// ============================================
// API ENDPOINTS
// ============================================
const API_ORDERS = '/api/orders';
const API_CLIENTS = '/api/clients';
const API_CARRIERS = '/api/carriers';
const API_DICTIONARIES = '/api/dictionaries';

// ============================================
// GLOBAL STATE
// ============================================
let dictionaries = {
    vehicleBodyTypes: []
};

// Глобальные массивы данных для быстрого поиска
let clientsData = [];
let carriersData = [];
let ordersData = [];

// ============================================
// FORM GENERATORS (Template Strings)
// ============================================

/**
 * Генератор HTML формы для клиента
 * @param {Object|null} client - Объект клиента для редактирования или null для создания
 * @returns {string} HTML строка формы
 */
function getClientFormHTML(client = null) {
    return `
        <form id="clientForm" class="modal-form">
            <input type="hidden" id="clientId" value="${client?._id || ''}">
            
            <div class="form-group">
                <label for="clientName">Название *</label>
                <input type="text" id="clientName" name="name" value="${client?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="clientInn">ИНН</label>
                <input type="text" id="clientInn" name="inn" value="${client?.inn || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientContactPerson">Контактное лицо</label>
                <input type="text" id="clientContactPerson" name="contactPerson" value="${client?.contactPerson || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientPhone">Телефон</label>
                <input type="tel" id="clientPhone" name="phone" value="${client?.phone || ''}">
            </div>
            
            <div class="form-group">
                <label for="clientEmail">Email</label>
                <input type="email" id="clientEmail" name="email" value="${client?.email || ''}">
            </div>
        </form>
    `;
}

/**
 * Генератор HTML формы для перевозчика
 * @param {Object|null} carrier - Объект перевозчика для редактирования или null для создания
 * @returns {string} HTML строка формы
 */
function getCarrierFormHTML(carrier = null) {
    return `
        <form id="carrierForm" class="modal-form">
            <input type="hidden" id="carrierId" value="${carrier?._id || ''}">
            
            <div class="form-group">
                <label for="carrierName">Название *</label>
                <input type="text" id="carrierName" name="name" value="${carrier?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="carrierDriverName">Водитель</label>
                <input type="text" id="carrierDriverName" name="driverName" value="${carrier?.driverName || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierTruckNumber">Номер грузовика</label>
                <input type="text" id="carrierTruckNumber" name="truckNumber" value="${carrier?.truckNumber || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierPhone">Телефон</label>
                <input type="tel" id="carrierPhone" name="phone" value="${carrier?.phone || ''}">
            </div>
        </form>
    `;
}

/**
 * Генератор HTML формы для редактирования заказа
 * @param {Object} order - Объект заказа для редактирования
 * @param {Array} bodyTypes - Массив типов кузова из справочника
 * @returns {string} HTML строка формы
 */
function getOrderFormHTML(order, bodyTypes = []) {
    // Форматирование дат для input[type="date"]
    const dateLoading = order.dateLoading ? new Date(order.dateLoading).toISOString().split('T')[0] : '';
    const dateUnloading = order.dateUnloading ? new Date(order.dateUnloading).toISOString().split('T')[0] : '';

    // Генерация options для select типов кузова
    const bodyTypeOptions = bodyTypes.map(type => {
        const selected = order.vehicleBodyType === type._id ? 'selected' : '';
        return `<option value="${type._id}" ${selected}>${type.name}</option>`;
    }).join('');

    return `
        <form id="editOrderForm" class="modal-form">
            <input type="hidden" id="editOrderId" value="${order._id}">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editRouteFrom">Откуда (пункт отправления) *</label>
                    <input type="text" id="editRouteFrom" value="${order.route?.from || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editRouteTo">Куда (пункт назначения) *</label>
                    <input type="text" id="editRouteTo" value="${order.route?.to || ''}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editCargoName">Наименование груза *</label>
                    <input type="text" id="editCargoName" value="${order.cargo?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editCargoWeight">Вес (кг) *</label>
                    <input type="number" id="editCargoWeight" value="${order.cargo?.weight || ''}" min="0" step="0.01" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editDateLoading">Дата погрузки *</label>
                    <input type="date" id="editDateLoading" value="${dateLoading}" required>
                </div>
                <div class="form-group">
                    <label for="editDateUnloading">Дата выгрузки *</label>
                    <input type="date" id="editDateUnloading" value="${dateUnloading}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="editVehicleBodyType">Тип кузова</label>
                <select id="editVehicleBodyType" name="vehicleBodyType">
                    <option value="">Выберите тип кузова</option>
                    ${bodyTypeOptions}
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editClientRate">Ставка клиента (₽) *</label>
                    <input type="number" id="editClientRate" value="${order.clientRate || ''}" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="editCarrierRate">Ставка перевозчика (₽) *</label>
                    <input type="number" id="editCarrierRate" value="${order.carrierRate || ''}" min="0" step="0.01" required>
                </div>
            </div>
        </form>
    `;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Главная функция инициализации приложения
 */
async function init() {
    console.log('🚀 STL Intermodal CRM - Инициализация...');

    // 1. Рендерим форму заказа в контейнер
    const orderFormContainer = document.getElementById('orderFormContainer');
    if (orderFormContainer) {
        orderFormContainer.innerHTML = renderOrderForm(dictionaries);
        console.log('✅ Форма заказа отрендерена');
    } else {
        console.error('❌ Контейнер #orderFormContainer не найден');
    }

    // 2. Загружаем справочники
    await loadDictionaries();

    // 3. Настраиваем навигацию
    setupNavigation();

    // 4. Настраиваем обработчики событий
    setupEventListeners();

    // 5. Загружаем данные
    loadOrders();
    loadClients();
    loadCarriers();

    console.log('✅ Инициализация завершена');
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Настройка навигации между разделами
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionName = btn.dataset.section;

            // Убираем active у всех кнопок
            navButtons.forEach(b => b.classList.remove('active'));

            // Добавляем active к текущей
            btn.classList.add('active');

            // Скрываем все секции
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });

            // Показываем нужную секцию
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }

            console.log(`📍 Переключено на раздел: ${sectionName}`);
        });
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Настройка всех обработчиков событий
 */
function setupEventListeners() {
    // 1. Делегирование событий для таблиц
    const clientsTableBody = document.getElementById('clientsTableBody');
    const carriersTableBody = document.getElementById('carriersTableBody');
    const ordersList = document.getElementById('ordersList');

    if (clientsTableBody) {
        clientsTableBody.addEventListener('click', handleTableClick);
    }

    if (carriersTableBody) {
        carriersTableBody.addEventListener('click', handleTableClick);
    }

    if (ordersList) {
        ordersList.addEventListener('click', handleOrderClick);
    }

    // 2. Кнопки "Добавить"
    const btnAddClient = document.getElementById('btnAddClient');
    const btnAddCarrier = document.getElementById('btnAddCarrier');

    if (btnAddClient) {
        btnAddClient.addEventListener('click', () => openModal('client', null));
    }

    if (btnAddCarrier) {
        btnAddCarrier.addEventListener('click', () => openModal('carrier', null));
    }

    // 3. Форма создания заказа
    const createOrderForm = document.getElementById('createOrderForm');
    if (createOrderForm) {
        createOrderForm.addEventListener('submit', createOrder);
    }
}

/**
 * Универсальный обработчик кликов по таблицам (клиенты/перевозчики)
 */
function handleTableClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const type = btn.dataset.type;

    if (!id || !type) return;

    if (btn.classList.contains('btn-delete')) {
        deleteItem(type, id);
    } else if (btn.classList.contains('btn-edit')) {
        openModal(type, id);
    }
}

/**
 * Обработчик кликов по заказам
 */
function handleOrderClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains('btn-delete-order')) {
        deleteOrder(id);
    } else if (btn.classList.contains('btn-edit-order')) {
        openEditOrderModal(id);
    }
}

// ============================================
// DICTIONARIES
// ============================================

/**
 * Загрузка справочников с сервера
 */
async function loadDictionaries() {
    try {
        console.log('📚 Загрузка справочников...');

        const response = await fetch(`${API_DICTIONARIES}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Сохраняем в глобальное состояние
        dictionaries.vehicleBodyTypes = data.vehicleBodyTypes || [];

        console.log(`✅ Загружено типов кузова: ${dictionaries.vehicleBodyTypes.length}`);

        // Заполняем select на странице
        populateVehicleBodyTypeSelect();

    } catch (error) {
        console.error('❌ Ошибка загрузки справочников:', error);
        console.warn('⚠️ Приложение продолжит работу без справочников');
    }
}

/**
 * Заполнение select элемента типами кузова
 */
function populateVehicleBodyTypeSelect() {
    const select = document.getElementById('vehicleBodyType');

    if (!select) {
        console.warn('⚠️ Элемент <select id="vehicleBodyType"> не найден на странице');
        return;
    }

    // Очищаем существующие options (кроме placeholder)
    select.innerHTML = '<option value="">Выберите тип кузова</option>';

    // Добавляем options из справочника
    dictionaries.vehicleBodyTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type._id;
        option.textContent = type.name;
        select.appendChild(option);
    });

    console.log(`✅ Select заполнен: ${dictionaries.vehicleBodyTypes.length} опций`);
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Загрузка списка заказов
 */
async function loadOrders() {
    console.log('📦 Загрузка заказов...');

    const ordersList = document.getElementById('ordersList');

    if (!ordersList) {
        console.warn('⚠️ Элемент #ordersList не найден');
        return;
    }

    try {
        const response = await fetch(API_ORDERS);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const orders = await response.json();

        // Сохраняем в глобальное состояние
        ordersData = orders;

        // Очистка контейнера
        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="no-data">Нет заказов</p>';
            console.log('ℹ️ Заказов не найдено');
            return;
        }

        // Создание карточек заказов
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            // Расчет прибыли
            const profit = (order.clientRate || 0) - (order.carrierRate || 0);
            const profitClass = profit >= 0 ? 'profit-positive' : 'profit-negative';

            // Форматирование дат
            const dateLoading = order.dateLoading ? new Date(order.dateLoading).toLocaleDateString('ru-RU') : 'Не указана';
            const dateUnloading = order.dateUnloading ? new Date(order.dateUnloading).toLocaleDateString('ru-RU') : 'Не указана';

            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-route">
                        <strong>${order.route?.from || 'Не указано'}</strong> → <strong>${order.route?.to || 'Не указано'}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn-icon btn-edit-order" data-id="${order._id}" title="Редактировать">✏️</button>
                        <button class="btn-icon btn-delete-order" data-id="${order._id}" title="Удалить">🗑️</button>
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-info">
                        <div class="info-item">
                            <span class="info-label">Груз:</span>
                            <span class="info-value">${order.cargo?.name || 'Не указан'} (${order.cargo?.weight || 0} кг)</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Погрузка:</span>
                            <span class="info-value">${dateLoading}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Выгрузка:</span>
                            <span class="info-value">${dateUnloading}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Клиент:</span>
                            <span class="info-value">${order.client?.name || 'Не указан'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Перевозчик:</span>
                            <span class="info-value">${order.carrier?.name || 'Не указан'}</span>
                        </div>
                    </div>
                    <div class="order-finance">
                        <div class="finance-item">
                            <span class="finance-label">Ставка клиента:</span>
                            <span class="finance-value">${(order.clientRate || 0).toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div class="finance-item">
                            <span class="finance-label">Ставка перевозчика:</span>
                            <span class="finance-value">${(order.carrierRate || 0).toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div class="finance-item">
                            <span class="finance-label">Прибыль:</span>
                            <span class="finance-value ${profitClass}">${profit.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>
                </div>
            `;

            ordersList.appendChild(orderCard);
        });

        console.log(`✅ Загружено заказов: ${orders.length}`);

    } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
        ordersList.innerHTML = '<p class="error">Ошибка загрузки заказов</p>';
    }
}

/**
 * Загрузка списка клиентов
 */
async function loadClients() {
    console.log('👥 Загрузка клиентов...');

    const tbody = document.getElementById('clientsTableBody');

    if (!tbody) {
        console.warn('⚠️ Элемент #clientsTableBody не найден');
        return;
    }

    try {
        const response = await fetch(API_CLIENTS);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const clients = await response.json();

        // Сохраняем в глобальное состояние
        clientsData = clients;

        // Очистка tbody
        tbody.innerHTML = '';

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет клиентов</td></tr>';
            console.log('ℹ️ Клиентов не найдено');
            return;
        }

        // Создание строк таблицы
        clients.forEach(client => {
            const tr = document.createElement('tr');

            // Форматирование даты
            const createdAt = client.createdAt ? new Date(client.createdAt).toLocaleDateString('ru-RU') : '-';

            tr.innerHTML = `
                <td>${client.name || '-'}</td>
                <td>${client.inn || '-'}</td>
                <td>${client.contactPerson || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>${client.email || '-'}</td>
                <td>${createdAt}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${client._id}" data-type="client" title="Редактировать">✏️</button>
                    <button class="btn-icon btn-delete" data-id="${client._id}" data-type="client" title="Удалить">🗑️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log(`✅ Загружено клиентов: ${clients.length}`);

    } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="error">Ошибка загрузки клиентов</td></tr>';
    }
}

/**
 * Загрузка списка перевозчиков
 */
async function loadCarriers() {
    console.log('🚛 Загрузка перевозчиков...');

    const tbody = document.getElementById('carriersTableBody');

    if (!tbody) {
        console.warn('⚠️ Элемент #carriersTableBody не найден');
        return;
    }

    try {
        const response = await fetch(API_CARRIERS);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const carriers = await response.json();

        // Сохраняем в глобальное состояние
        carriersData = carriers;

        // Очистка tbody
        tbody.innerHTML = '';

        if (carriers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Нет перевозчиков</td></tr>';
            console.log('ℹ️ Перевозчиков не найдено');
            return;
        }

        // Создание строк таблицы
        carriers.forEach(carrier => {
            const tr = document.createElement('tr');

            // Форматирование даты
            const createdAt = carrier.createdAt ? new Date(carrier.createdAt).toLocaleDateString('ru-RU') : '-';

            tr.innerHTML = `
                <td>${carrier.name || '-'}</td>
                <td>${carrier.driverName || '-'}</td>
                <td>${carrier.truckNumber || '-'}</td>
                <td>${carrier.phone || '-'}</td>
                <td>${createdAt}</td>
                <td class="actions">
                    <button class="btn-icon btn-edit" data-id="${carrier._id}" data-type="carrier" title="Редактировать">✏️</button>
                    <button class="btn-icon btn-delete" data-id="${carrier._id}" data-type="carrier" title="Удалить">🗑️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log(`✅ Загружено перевозчиков: ${carriers.length}`);

    } catch (error) {
        console.error('❌ Ошибка загрузки перевозчиков:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="error">Ошибка загрузки перевозчиков</td></tr>';
    }
}

// ============================================
// MODAL LOGIC
// ============================================

/**
 * Открытие модального окна для редактирования/создания клиента или перевозчика
 */
function openModal(type, id) {
    let title, formHTML, item;

    if (type === 'client') {
        if (id) {
            // Редактирование
            item = clientsData.find(c => c._id === id);
            title = 'Редактирование клиента';
        } else {
            // Создание
            title = 'Новый клиент';
        }
        formHTML = getClientFormHTML(item);

        modalView.showForm(title, formHTML, async (event) => {
            event.preventDefault();
            await saveClient();
        });

    } else if (type === 'carrier') {
        if (id) {
            // Редактирование
            item = carriersData.find(c => c._id === id);
            title = 'Редактирование перевозчика';
        } else {
            // Создание
            title = 'Новый перевозчик';
        }
        formHTML = getCarrierFormHTML(item);

        modalView.showForm(title, formHTML, async (event) => {
            event.preventDefault();
            await saveCarrier();
        });
    }
}

/**
 * Открытие модального окна редактирования заказа
 */
function openEditOrderModal(id) {
    const order = ordersData.find(o => o._id === id);
    if (!order) {
        showMessage('Заказ не найден', 'error');
        return;
    }

    // Генерируем форму с типами кузова из справочника
    const formHTML = getOrderFormHTML(order, dictionaries.vehicleBodyTypes);

    modalView.showForm('Редактирование заказа', formHTML, async (event) => {
        event.preventDefault();
        await updateOrder();
    });
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Создание нового заказа
 */
async function createOrder(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const orderData = {
        route: {
            from: formData.get('routeFrom'),
            to: formData.get('routeTo')
        },
        cargo: {
            name: formData.get('cargoName'),
            weight: parseFloat(formData.get('cargoWeight'))
        },
        dateLoading: formData.get('dateLoading'),
        dateUnloading: formData.get('dateUnloading'),
        client: {
            name: formData.get('clientName')
        },
        carrier: {
            name: formData.get('carrierName')
        },
        clientRate: parseFloat(formData.get('clientRate')),
        carrierRate: parseFloat(formData.get('carrierRate')),
        vehicleBodyType: formData.get('vehicleBodyType') || null
    };

    try {
        const response = await fetch(API_ORDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка создания заказа');
        }

        const result = await response.json();
        console.log('✅ Заказ создан:', result);

        showMessage('Заказ успешно создан!', 'success');
        form.reset();
        loadOrders(); // Перезагружаем список

    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Обновление заказа
 */
async function updateOrder() {
    const id = document.getElementById('editOrderId').value;

    const orderData = {
        route: {
            from: document.getElementById('editRouteFrom').value,
            to: document.getElementById('editRouteTo').value
        },
        cargo: {
            name: document.getElementById('editCargoName').value,
            weight: parseFloat(document.getElementById('editCargoWeight').value)
        },
        dateLoading: document.getElementById('editDateLoading').value,
        dateUnloading: document.getElementById('editDateUnloading').value,
        clientRate: parseFloat(document.getElementById('editClientRate').value),
        carrierRate: parseFloat(document.getElementById('editCarrierRate').value),
        vehicleBodyType: document.getElementById('editVehicleBodyType')?.value || null
    };

    try {
        const response = await fetch(`${API_ORDERS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка обновления заказа');
        }

        console.log('✅ Заказ обновлен');
        showMessage('Заказ успешно обновлен!', 'success');
        modalView.close();
        loadOrders();

    } catch (error) {
        console.error('❌ Ошибка обновления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Удаление заказа
 */
async function deleteOrder(id) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_ORDERS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Ошибка удаления заказа');
        }

        console.log('✅ Заказ удален');
        showMessage('Заказ успешно удален!', 'success');
        loadOrders();

    } catch (error) {
        console.error('❌ Ошибка удаления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Сохранение клиента (создание или обновление)
 */
async function saveClient() {
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
        const url = id ? `${API_CLIENTS}/${id}` : API_CLIENTS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения клиента');
        }

        console.log(`✅ Клиент ${id ? 'обновлен' : 'создан'}`);
        showMessage(`Клиент успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadClients();

    } catch (error) {
        console.error('❌ Ошибка сохранения клиента:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Сохранение перевозчика (создание или обновление)
 */
async function saveCarrier() {
    const id = document.getElementById('carrierId').value;
    const form = document.getElementById('carrierForm');
    const formData = new FormData(form);

    const carrierData = {
        name: formData.get('name'),
        driverName: formData.get('driverName'),
        truckNumber: formData.get('truckNumber'),
        phone: formData.get('phone')
    };

    try {
        const url = id ? `${API_CARRIERS}/${id}` : API_CARRIERS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carrierData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения перевозчика');
        }

        console.log(`✅ Перевозчик ${id ? 'обновлен' : 'создан'}`);
        showMessage(`Перевозчик успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadCarriers();

    } catch (error) {
        console.error('❌ Ошибка сохранения перевозчика:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Удаление элемента (универсальная функция)
 */
async function deleteItem(type, id) {
    const itemName = type === 'client' ? 'клиента' : 'перевозчика';

    if (!confirm(`Вы уверены, что хотите удалить этого ${itemName}?`)) {
        return;
    }

    const apiUrl = type === 'client' ? API_CLIENTS : API_CARRIERS;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Ошибка удаления ${itemName}`);
        }

        console.log(`✅ ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} удален`);
        showMessage(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} успешно удален!`, 'success');

        // Перезагружаем соответствующий список
        if (type === 'client') {
            loadClients();
        } else {
            loadCarriers();
        }

    } catch (error) {
        console.error(`❌ Ошибка удаления ${itemName}:`, error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Показать сообщение пользователю
 */
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');

    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// ============================================
// START APPLICATION
// ============================================

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', init);
