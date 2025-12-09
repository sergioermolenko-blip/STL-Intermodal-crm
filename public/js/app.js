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
// STATE (Глобальные переменные)
// ============================================
let clientsData = [];
let carriersData = [];
let ordersData = [];
let vehicleBodyTypes = [];

// ============================================
// ГЕНЕРАТОРЫ HTML (Template Strings)
// ============================================

/**
 * Генератор формы клиента
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
 * Генератор формы перевозчика
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
 * Генератор формы редактирования заказа
 */
function getOrderFormHTML(order) {
    const dateLoading = order.dateLoading ? new Date(order.dateLoading).toISOString().split('T')[0] : '';
    const dateUnloading = order.dateUnloading ? new Date(order.dateUnloading).toISOString().split('T')[0] : '';

    const bodyTypeOptions = vehicleBodyTypes.map(type => {
        const selected = order.vehicleBodyType === type._id ? 'selected' : '';
        return `<option value="${type._id}" ${selected}>${type.name}</option>`;
    }).join('');

    return `
        <form id="editOrderForm" class="modal-form">
            <input type="hidden" id="editOrderId" value="${order._id}">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editRouteFrom">Откуда *</label>
                    <input type="text" id="editRouteFrom" value="${order.route?.from || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editRouteTo">Куда *</label>
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
// ИНИЦИАЛИЗАЦИЯ
// ============================================

async function init() {
    console.log('🚀 STL Intermodal CRM - Инициализация...');
    console.log('📍 Скрипт app.js запущен и выполняется!');

    // 1. КРИТИЧЕСКИ ВАЖНО: Загружаем ВСЕ данные СНАЧАЛА
    await loadDictionaries();
    await loadClients();   // Заполняет clientsData
    await loadCarriers();  // Заполняет carriersData

    // 2. ТОЛЬКО ПОСЛЕ загрузки данных отрисовываем форму
    const orderFormContainer = document.getElementById('orderFormContainer');
    if (orderFormContainer) {
        // Передаем ВСЕ три аргумента: vehicleBodyTypes, clientsData, carriersData
        orderFormContainer.innerHTML = renderOrderForm(vehicleBodyTypes, clientsData, carriersData);
        console.log('✅ Форма заказа отрисована с данными:', {
            vehicleBodyTypes: vehicleBodyTypes.length,
            clients: clientsData.length,
            carriers: carriersData.length
        });
    }

    // 3. Настраиваем навигацию
    setupNavigation();

    // 4. Настраиваем обработчики событий
    setupEventListeners();

    // 5. Загружаем таблицу заказов
    loadOrders();

    console.log('✅ Инициализация завершена');
}

// ============================================
// ЗАГРУЗКА СПРАВОЧНИКОВ
// ============================================

async function loadDictionaries() {
    try {
        const response = await fetch(API_DICTIONARIES);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        vehicleBodyTypes = data.vehicleBodyTypes || [];

        console.log(`✅ Загружено типов кузова: ${vehicleBodyTypes.length}`);
    } catch (error) {
        console.error('❌ Ошибка загрузки справочников:', error);
    }
}

// ============================================
// НАВИГАЦИЯ
// ============================================

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionName = btn.dataset.section;

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });

            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });
}

// ============================================
// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ
// ============================================

function setupEventListeners() {
    console.log('🔧 Настройка обработчиков событий...');

    // 1. Делегирование на таблицы
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
        btnAddClient.addEventListener('click', () => openClientModal(null));
    }

    if (btnAddCarrier) {
        btnAddCarrier.addEventListener('click', () => openCarrierModal(null));
    }

    // 3. Форма создания заказа
    console.log('🔍 Ищу форму #orderForm...');
    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        console.log('✅ Форма #orderForm найдена!');
        console.log('📋 Форма:', orderForm);

        orderForm.addEventListener('submit', (event) => {
            console.log('🚀 Кнопка "Создать заказ" нажата! Обработчик сработал!');
            console.log('📦 Собираю данные из формы...');

            const formData = new FormData(event.target);
            const formDataObj = Object.fromEntries(formData);
            console.log('📦 Данные формы (FormData):', formDataObj);

            createOrder(event);
        });

        console.log('✅ Обработчик submit добавлен на форму #orderForm');
    } else {
        console.error('❌ ОШИБКА: Форма #orderForm не найдена в DOM!');
        console.error('❌ Проверьте ID формы в OrderFormView.js');
        console.error('❌ Доступные элементы с ID:',
            Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    }

    console.log('✅ Настройка обработчиков завершена');
}

function handleTableClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const type = btn.dataset.type;

    if (!id || !type) return;

    if (btn.classList.contains('btn-delete')) {
        deleteItem(type, id);
    } else if (btn.classList.contains('btn-edit')) {
        if (type === 'client') {
            openClientModal(id);
        } else if (type === 'carrier') {
            openCarrierModal(id);
        }
    }
}

function handleOrderClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains('btn-delete-order')) {
        deleteOrder(id);
    } else if (btn.classList.contains('btn-edit-order')) {
        openOrderModal(id);
    }
}

// ============================================
// ЗАГРУЗКА ДАННЫХ
// ============================================

async function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    try {
        const response = await fetch(API_ORDERS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const orders = await response.json();
        ordersData = orders;

        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="no-data">Нет заказов</p>';
            return;
        }

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            const profit = (order.clientRate || 0) - (order.carrierRate || 0);
            const profitClass = profit >= 0 ? 'profit-positive' : 'profit-negative';

            const dateLoading = order.dateLoading ? new Date(order.dateLoading).toLocaleDateString('ru-RU') : 'Не указана';
            const dateUnloading = order.dateUnloading ? new Date(order.dateUnloading).toLocaleDateString('ru-RU') : 'Не указана';

            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-route">
                        <strong>${order.route?.from || 'Не указано'}</strong> → <strong>${order.route?.to || 'Не указано'}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn-icon btn-edit-order" data-id="${order._id}">✏️</button>
                        <button class="btn-icon btn-delete-order" data-id="${order._id}">🗑️</button>
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
    } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
        ordersList.innerHTML = '<p class="error">Ошибка загрузки заказов</p>';
    }
}

async function loadClients() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    try {
        const response = await fetch(API_CLIENTS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const clients = await response.json();
        clientsData = clients;

        tbody.innerHTML = '';

        if (clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет клиентов</td></tr>';
            return;
        }

        clients.forEach(client => {
            const tr = document.createElement('tr');
            const createdAt = client.createdAt ? new Date(client.createdAt).toLocaleDateString('ru-RU') : '-';

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

async function loadCarriers() {
    const tbody = document.getElementById('carriersTableBody');
    if (!tbody) return;

    try {
        const response = await fetch(API_CARRIERS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const carriers = await response.json();
        carriersData = carriers;

        tbody.innerHTML = '';

        if (carriers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Нет перевозчиков</td></tr>';
            return;
        }

        carriers.forEach(carrier => {
            const tr = document.createElement('tr');
            const createdAt = carrier.createdAt ? new Date(carrier.createdAt).toLocaleDateString('ru-RU') : '-';

            tr.innerHTML = `
                <td>${carrier.name || '-'}</td>
                <td>${carrier.driverName || '-'}</td>
                <td>${carrier.truckNumber || '-'}</td>
                <td>${carrier.phone || '-'}</td>
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
        tbody.innerHTML = '<tr><td colspan="6" class="error">Ошибка загрузки перевозчиков</td></tr>';
    }
}

// ============================================
// МОДАЛЬНЫЕ ОКНА
// ============================================

function openClientModal(id) {
    const client = id ? clientsData.find(c => c._id === id) : null;
    const title = id ? 'Редактирование клиента' : 'Новый клиент';
    const formHTML = getClientFormHTML(client);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveClient();
    });
}

function openCarrierModal(id) {
    const carrier = id ? carriersData.find(c => c._id === id) : null;
    const title = id ? 'Редактирование перевозчика' : 'Новый перевозчик';
    const formHTML = getCarrierFormHTML(carrier);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveCarrier();
    });
}

function openOrderModal(id) {
    const order = ordersData.find(o => o._id === id);
    if (!order) {
        showMessage('Заказ не найден', 'error');
        return;
    }

    const formHTML = getOrderFormHTML(order);

    modalView.showForm('Редактирование заказа', formHTML, async (event) => {
        event.preventDefault();
        await updateOrder();
    });
}

// ============================================
// CRUD ОПЕРАЦИИ
// ============================================

async function createOrder(event) {
    event.preventDefault();
    console.log('📝 createOrder() вызвана!');

    const form = event.target;
    const formData = new FormData(form);

    console.log('📋 Все поля формы (names):', Array.from(formData.keys()));

    // Упрощенный сбор данных - client и carrier теперь сразу ID!
    const orderData = {
        route: {
            from: formData.get('route_from'),
            to: formData.get('route_to')
        },
        cargo: {
            name: formData.get('cargo_name'),
            weight: parseFloat(formData.get('cargo_weight'))
        },
        dateLoading: formData.get('date_loading'),
        dateUnloading: formData.get('date_unloading'),
        client: formData.get('client'),      // Сразу ID из <select name="client">
        carrier: formData.get('carrier'),    // Сразу ID из <select name="carrier">
        clientRate: parseFloat(formData.get('clientRate')),
        carrierRate: parseFloat(formData.get('carrierRate')),
        vehicleBodyType: formData.get('vehicleBodyType') || null
    };

    console.log('📦 Собранные данные для отправки (orderData):', orderData);
    console.log('📤 Отправляю POST запрос на', API_ORDERS);

    try {
        const response = await fetch(API_ORDERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        console.log('📡 Ответ сервера - статус:', response.status);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка создания заказа');
        }

        showMessage('Заказ успешно создан!', 'success');
        form.reset();
        loadOrders();
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка обновления заказа');
        }

        showMessage('Заказ успешно обновлен!', 'success');
        modalView.close();
        loadOrders();
    } catch (error) {
        console.error('❌ Ошибка обновления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

async function deleteOrder(id) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    try {
        const response = await fetch(`${API_ORDERS}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Ошибка удаления заказа');

        showMessage('Заказ успешно удален!', 'success');
        loadOrders();
    } catch (error) {
        console.error('❌ Ошибка удаления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения клиента');
        }

        showMessage(`Клиент успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка сохранения клиента:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrierData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения перевозчика');
        }

        showMessage(`Перевозчик успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка сохранения перевозчика:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

async function deleteItem(type, id) {
    const itemName = type === 'client' ? 'клиента' : 'перевозчика';
    if (!confirm(`Вы уверены, что хотите удалить этого ${itemName}?`)) return;

    const apiUrl = type === 'client' ? API_CLIENTS : API_CARRIERS;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Ошибка удаления ${itemName}`);

        showMessage(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} успешно удален!`, 'success');

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
// УТИЛИТЫ
// ============================================

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
// ЗАПУСК
// ============================================

document.addEventListener('DOMContentLoaded', init);
