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
const API_CONTACTS = '/api/contacts';

// ============================================
// STATE (Глобальные переменные)
// ============================================
let clientsData = [];
let carriersData = [];
let ordersData = [];
let contactsData = [];
let vehicleBodyTypes = [];
let loadingTypes = [];
let packageTypes = [];

// ============================================
// ГЕНЕРАТОРЫ HTML (Template Strings)
// ============================================

/**
 * Генератор формы клиента
 */
function getClientFormHTML(client = null) {
    const clientContacts = client?._id
        ? contactsData.filter(c => c.client?._id === client._id || c.client === client._id)
        : [];

    const contactsListHTML = clientContacts.length > 0
        ? clientContacts.map(contact => `
            <div class="company-contact-item">
                <div class="company-contact-info">
                    <div class="company-contact-name">👤 ${contact.fullName}</div>
                    <div class="company-contact-details">
                        📞 ${contact.phones[0]} | ✉️ ${contact.email}
                    </div>
                </div>
                <div class="company-contact-actions">
                    <button type="button" class="btn-icon btn-edit-company-contact" data-contact-id="${contact._id}">✏️</button>
                    <button type="button" class="btn-icon btn-delete-company-contact" data-contact-id="${contact._id}">🗑️</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">У этой компании пока нет контактов</p>';

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

            ${client?._id ? `
                <div class="company-contacts-section">
                    <h3>Контакты компании</h3>
                    <div class="company-contacts-list">
                        ${contactsListHTML}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" id="btnAddClientContact">
                        ➕ Добавить контакт к этой компании
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}


/**
 * Генератор формы перевозчика
 */
function getCarrierFormHTML(carrier = null) {
    const carrierContacts = carrier?._id
        ? contactsData.filter(c => c.carrier?._id === carrier._id || c.carrier === carrier._id)
        : [];

    const contactsListHTML = carrierContacts.length > 0
        ? carrierContacts.map(contact => `
            <div class="company-contact-item">
                <div class="company-contact-info">
                    <div class="company-contact-name">👤 ${contact.fullName}</div>
                    <div class="company-contact-details">
                        📞 ${contact.phones[0]} | ✉️ ${contact.email}
                    </div>
                </div>
                <div class="company-contact-actions">
                    <button type="button" class="btn-icon btn-edit-company-contact" data-contact-id="${contact._id}">✏️</button>
                    <button type="button" class="btn-icon btn-delete-company-contact" data-contact-id="${contact._id}">🗑️</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">У этой компании пока нет контактов</p>';

    return `
        <form id="carrierForm" class="modal-form">
            <input type="hidden" id="carrierId" value="${carrier?._id || ''}">
            
            <div class="form-group">
                <label for="carrierName">Название *</label>
                <input type="text" id="carrierName" name="name" value="${carrier?.name || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="carrierInn">ИНН</label>
                <input type="text" id="carrierInn" name="inn" value="${carrier?.inn || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierContactPerson">Контактное лицо</label>
                <input type="text" id="carrierContactPerson" name="contactPerson" value="${carrier?.contactPerson || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierPhone">Телефон</label>
                <input type="tel" id="carrierPhone" name="phone" value="${carrier?.phone || ''}">
            </div>
            
            <div class="form-group">
                <label for="carrierEmail">Email</label>
                <input type="email" id="carrierEmail" name="email" value="${carrier?.email || ''}">
            </div>

            ${carrier?._id ? `
                <div class="company-contacts-section">
                    <h3>Контакты компании</h3>
                    <div class="company-contacts-list">
                        ${contactsListHTML}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" id="btnAddCarrierContact">
                        ➕ Добавить контакт к этой компании
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}


/**
 * Генератор формы контакта
 */
function getContactFormHTML(contact = null) {
    const clientOptions = clientsData.map(client =>
        `<option value="${client._id}" ${contact?.client?._id === client._id ? 'selected' : ''}>${client.name}</option>`
    ).join('');

    const carrierOptions = carriersData.map(carrier =>
        `<option value="${carrier._id}" ${contact?.carrier?._id === carrier._id ? 'selected' : ''}>${carrier.name}</option>`
    ).join('');

    const relatedToClient = contact?.relatedTo === 'client' || !contact;
    const relatedToCarrier = contact?.relatedTo === 'carrier';

    const phonesHTML = contact?.phones?.map((phone, index) => `
        <div class="phone-input-group" data-index="${index}">
            <input type="tel" name="phone_${index}" value="${phone}" required>
            ${index > 0 ? '<button type="button" class="btn-remove-phone">✖</button>' : ''}
        </div>
    `).join('') || `
        <div class="phone-input-group" data-index="0">
            <input type="tel" name="phone_0" required>
        </div>
    `;

    return `
        <form id="contactForm" class="modal-form">
            <input type="hidden" id="contactId" value="${contact?._id || ''}">
            
            <div class="form-group">
                <label for="contactFullName">ФИО *</label>
                <input type="text" id="contactFullName" name="fullName" value="${contact?.fullName || ''}" required>
            </div>

            <div class="form-group">
                <label>Тип компании *</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" name="relatedTo" value="client" ${relatedToClient ? 'checked' : ''} required>
                        Клиент
                    </label>
                    <label>
                        <input type="radio" name="relatedTo" value="carrier" ${relatedToCarrier ? 'checked' : ''}>
                        Перевозчик
                    </label>
                </div>
            </div>

            <div class="form-group" id="clientSelectGroup" ${relatedToCarrier ? 'style="display:none"' : ''}>
                <label for="contactClient">Клиент *</label>
                <select id="contactClient" name="client">
                    <option value="">Выберите клиента</option>
                    ${clientOptions}
                </select>
            </div>

            <div class="form-group" id="carrierSelectGroup" ${relatedToClient ? 'style="display:none"' : ''}>
                <label for="contactCarrier">Перевозчик *</label>
                <select id="contactCarrier" name="carrier">
                    <option value="">Выберите перевозчика</option>
                    ${carrierOptions}
                </select>
            </div>

            <div class="form-group">
                <label>Телефоны *</label>
                <div id="phonesContainer">
                    ${phonesHTML}
                </div>
                <button type="button" id="btnAddPhone" class="btn btn-secondary btn-small">+ Добавить телефон</button>
            </div>
            
            <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input type="email" id="contactEmail" name="email" value="${contact?.email || ''}" required>
            </div>

            <div class="form-group">
                <label for="contactNotes">Комментарии</label>
                <textarea id="contactNotes" name="notes" rows="4">${contact?.notes || ''}</textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="contactIsActive" name="isActive" ${contact?.isActive !== false ? 'checked' : ''}>
                    Активен
                </label>
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

    const packageTypeOptions = packageTypes.map(type => {
        const selected = order.packageType === type._id ? 'selected' : '';
        return `<option value="${type._id}" ${selected}>${type.name}</option>`;
    }).join('');

    const loadingTypeOptions = loadingTypes.map(type => {
        const selected = order.loadingType === type._id ? 'selected' : '';
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
                <label for="editPackageType">Тип упаковки</label>
                <select id="editPackageType" name="packageType">
                    <option value="">Выберите тип упаковки</option>
                    ${packageTypeOptions}
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editVehicleBodyType">Тип кузова</label>
                    <select id="editVehicleBodyType" name="vehicleBodyType">
                        <option value="">Выберите тип кузова</option>
                        ${bodyTypeOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editLoadingType">Тип загрузки</label>
                    <select id="editLoadingType" name="loadingType">
                        <option value="">Выберите тип загрузки</option>
                        ${loadingTypeOptions}
                    </select>
                </div>
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

    await loadDictionaries();
    await loadClients();
    await loadCarriers();
    await loadContacts();

    const orderFormContainer = document.getElementById('orderFormContainer');
    if (orderFormContainer) {
        orderFormContainer.innerHTML = renderOrderForm(vehicleBodyTypes, clientsData, carriersData, loadingTypes, packageTypes);

        // Привязываем event listener для формы заказа ПОСЛЕ рендера
        const orderForm = document.getElementById('createOrderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', createOrder);
        }
    }

    setupNavigation();
    setupEventListeners();
    loadOrders();
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
        loadingTypes = data.loadingTypes || [];
        packageTypes = data.packageTypes || [];
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
// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ (Event Delegation)
// ============================================

function setupEventListeners() {
    const clientsTableBody = document.getElementById('clientsTableBody');
    const carriersTableBody = document.getElementById('carriersTableBody');

    if (clientsTableBody) {
        clientsTableBody.addEventListener('click', (e) => handleTableClick(e, 'client'));
    }
    if (carriersTableBody) {
        carriersTableBody.addEventListener('click', (e) => handleTableClick(e, 'carrier'));
    }

    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.addEventListener('click', handleOrderClick);
    }

    const btnAddClient = document.getElementById('btnAddClient');
    const btnAddCarrier = document.getElementById('btnAddCarrier');

    if (btnAddClient) btnAddClient.addEventListener('click', () => openClientModal(null));
    if (btnAddCarrier) btnAddCarrier.addEventListener('click', () => openCarrierModal(null));

    // Event listener для формы заказа теперь привязывается в init() после рендера
    // Это исправляет проблему, когда listener привязывался до появления формы в DOM

    const contactsList = document.getElementById('contactsList');
    if (contactsList) {
        contactsList.addEventListener('click', handleContactClick);
    }

    const btnAddContact = document.getElementById('btnAddContact');
    if (btnAddContact) {
        btnAddContact.addEventListener('click', () => openContactModal(null));
    }

    const clientSelect = document.getElementById('clientSelect');
    if (clientSelect) {
        clientSelect.addEventListener('change', loadClientContacts);
    }
}

async function loadClientContacts() {
    const clientSelect = document.getElementById('clientSelect');
    const contactSelect = document.getElementById('clientContactSelect');

    if (!clientSelect || !contactSelect) return;

    const clientId = clientSelect.value;

    if (!clientId) {
        contactSelect.innerHTML = '<option value="">Сначала выберите клиента</option>';
        return;
    }

    const clientContacts = contactsData.filter(c =>
        c.client?._id === clientId || c.client === clientId
    );

    if (clientContacts.length === 0) {
        contactSelect.innerHTML = '<option value="">У клиента нет контактов</option>';
        return;
    }

    const contactOptions = clientContacts.map(contact => {
        const phoneDisplay = contact.phones && contact.phones[0] ? ` (${contact.phones[0]})` : '';
        return `<option value="${contact._id}">${contact.fullName}${phoneDisplay}</option>`;
    }).join('');

    contactSelect.innerHTML = `
        <option value="">Не выбрано</option>
        ${contactOptions}
    `;
}


/**
 * Универсальный обработчик кликов для таблиц справочников
 */
function handleTableClick(event, type) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains('btn-delete')) {
        deleteItem(type, id);
    } else if (btn.classList.contains('btn-edit')) {
        if (type === 'client') openClientModal(id);
        if (type === 'carrier') openCarrierModal(id);
    }
}

/**
 * Обработчик кликов для списка заказов
 */
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

function handleContactClick(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains('btn-delete-contact')) {
        deleteContact(id);
    } else if (btn.classList.contains('btn-edit-contact')) {
        openContactModal(id);
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
                        ${order.clientContact ? `
                        <div class="info-item">
                            <span class="info-label">Контакт:</span>
                            <span class="info-value">📞 ${order.clientContact.fullName} (${order.clientContact.phones[0]})</span>
                        </div>
                        ` : ''}
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
            const createdDate = client.createdAt || client.created_at;
            const createdAt = createdDate ? new Date(createdDate).toLocaleDateString('ru-RU') : '-';

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
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Нет перевозчиков</td></tr>';
            return;
        }

        carriers.forEach(carrier => {
            const tr = document.createElement('tr');
            const createdDate = carrier.createdAt || carrier.created_at;
            const createdAt = createdDate ? new Date(createdDate).toLocaleDateString('ru-RU') : '-';

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

async function loadContacts() {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) return;

    try {
        const response = await fetch(API_CONTACTS);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contacts = await response.json();
        contactsData = contacts;

        contactsList.innerHTML = '';

        if (contacts.length === 0) {
            contactsList.innerHTML = '<p class="no-data">Нет контактов</p>';
            return;
        }

        contacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';

            if (!contact.isActive) {
                contactCard.classList.add('inactive');
            }

            const companyName = contact.client?.name || contact.carrier?.name || 'Не указана';
            const companyType = contact.relatedTo === 'client' ? 'Клиент' : 'Перевозчик';

            const phonesHTML = contact.phones.map(phone =>
                `<div class="contact-phone">📞 ${phone}</div>`
            ).join('');

            const notesHTML = contact.notes
                ? `<div class="contact-notes">💬 ${contact.notes}</div>`
                : '';

            const statusBadge = !contact.isActive
                ? '<span class="status-badge inactive">❌ Неактивен</span>'
                : '';

            contactCard.innerHTML = `
                <div class="contact-header">
                    <div class="contact-name">
                        👤 ${contact.fullName} ${statusBadge}
                    </div>
                    <div class="contact-actions">
                        <button class="btn-icon btn-edit-contact" data-id="${contact._id}">✏️</button>
                        <button class="btn-icon btn-delete-contact" data-id="${contact._id}">🗑️</button>
                    </div>
                </div>
                <div class="contact-body">
                    <div class="contact-company">🏢 ${companyName} (${companyType})</div>
                    ${phonesHTML}
                    <div class="contact-email">✉️ ${contact.email}</div>
                    ${notesHTML}
                </div>
            `;

            contactsList.appendChild(contactCard);
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки контактов:', error);
        contactsList.innerHTML = '<p class="error">Ошибка загрузки контактов</p>';
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

    if (id) {
        setupCompanyContactHandlers('client', id);
    }
}

function openCarrierModal(id) {
    const carrier = id ? carriersData.find(c => c._id === id) : null;
    const title = id ? 'Редактирование перевозчика' : 'Новый перевозчик';
    const formHTML = getCarrierFormHTML(carrier);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveCarrier();
    });

    if (id) {
        setupCompanyContactHandlers('carrier', id);
    }
}

function setupCompanyContactHandlers(type, companyId) {
    const btnAddContact = document.getElementById(type === 'client' ? 'btnAddClientContact' : 'btnAddCarrierContact');

    if (btnAddContact) {
        btnAddContact.addEventListener('click', () => {
            openContactModalForCompany(type, companyId);
        });
    }

    const contactsList = document.querySelector('.company-contacts-list');
    if (contactsList) {
        contactsList.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit-company-contact');
            const deleteBtn = e.target.closest('.btn-delete-company-contact');

            if (editBtn) {
                const contactId = editBtn.dataset.contactId;
                openContactModal(contactId);
            } else if (deleteBtn) {
                const contactId = deleteBtn.dataset.contactId;
                deleteContact(contactId);
            }
        });
    }
}

function openContactModalForCompany(type, companyId) {
    const formHTML = getContactFormHTML(null);

    modalView.showForm('Новый контакт', formHTML, async (event) => {
        event.preventDefault();
        await saveContact();
    });

    setupPhoneDynamicFields();

    setTimeout(() => {
        if (type === 'client') {
            document.querySelector('input[name="relatedTo"][value="client"]').checked = true;
            document.getElementById('clientSelectGroup').style.display = 'block';
            document.getElementById('carrierSelectGroup').style.display = 'none';
            document.getElementById('contactClient').value = companyId;
        } else {
            document.querySelector('input[name="relatedTo"][value="carrier"]').checked = true;
            document.getElementById('clientSelectGroup').style.display = 'none';
            document.getElementById('carrierSelectGroup').style.display = 'block';
            document.getElementById('contactCarrier').value = companyId;
        }

        setupRelatedToToggle();
    }, 100);
}


function openContactModal(id) {
    const contact = id ? contactsData.find(c => c._id === id) : null;
    const title = id ? 'Редактирование контакта' : 'Новый контакт';
    const formHTML = getContactFormHTML(contact);

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await saveContact();
    });

    setupPhoneDynamicFields();
    setupRelatedToToggle();
}

function setupPhoneDynamicFields() {
    const btnAddPhone = document.getElementById('btnAddPhone');
    const phonesContainer = document.getElementById('phonesContainer');

    if (btnAddPhone) {
        btnAddPhone.addEventListener('click', () => {
            const phoneGroups = phonesContainer.querySelectorAll('.phone-input-group');
            const newIndex = phoneGroups.length;

            const newPhoneGroup = document.createElement('div');
            newPhoneGroup.className = 'phone-input-group';
            newPhoneGroup.dataset.index = newIndex;
            newPhoneGroup.innerHTML = `
                <input type="tel" name="phone_${newIndex}" required>
                <button type="button" class="btn-remove-phone">✖</button>
            `;

            phonesContainer.appendChild(newPhoneGroup);

            newPhoneGroup.querySelector('.btn-remove-phone').addEventListener('click', () => {
                newPhoneGroup.remove();
            });
        });
    }

    phonesContainer.querySelectorAll('.btn-remove-phone').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.phone-input-group').remove();
        });
    });
}

function setupRelatedToToggle() {
    const relatedToRadios = document.querySelectorAll('input[name="relatedTo"]');
    const clientSelectGroup = document.getElementById('clientSelectGroup');
    const carrierSelectGroup = document.getElementById('carrierSelectGroup');

    relatedToRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'client') {
                clientSelectGroup.style.display = 'block';
                carrierSelectGroup.style.display = 'none';
                document.getElementById('contactCarrier').value = '';
            } else {
                clientSelectGroup.style.display = 'none';
                carrierSelectGroup.style.display = 'block';
                document.getElementById('contactClient').value = '';
            }
        });
    });
}

async function saveContact() {
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
        const url = id ? `${API_CONTACTS}/${id}` : API_CONTACTS;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка сохранения контакта');
        }

        showMessage(`Контакт успешно ${id ? 'обновлен' : 'создан'}!`, 'success');
        modalView.close();
        loadContacts();
    } catch (error) {
        console.error('❌ Ошибка сохранения контакта:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('Вы уверены, что хотите удалить этот контакт?')) return;

    try {
        const response = await fetch(`${API_CONTACTS}/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Ошибка при удалении контакта');
        }

        showMessage('Контакт успешно удален', 'success');
        await loadContacts();

    } catch (error) {
        console.error(error);
        showMessage(`Ошибка удаления контакта: ${error.message}`, 'error');
    }
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

    const form = event.target;
    const formData = new FormData(form);

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
        client: formData.get('client'),
        clientContact: formData.get('clientContact') || null,
        carrier: formData.get('carrier'),
        clientRate: parseFloat(formData.get('clientRate')),
        carrierRate: parseFloat(formData.get('carrierRate')),
        vehicleBodyType: formData.get('vehicleBodyType') || null,
        packageType: formData.get('packageType') || null,
        loadingType: formData.get('loadingType') || null
    };

    try {
        const response = await fetch(API_ORDERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

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
        vehicleBodyType: document.getElementById('editVehicleBodyType')?.value || null,
        packageType: document.getElementById('editPackageType')?.value || null,
        loadingType: document.getElementById('editLoadingType')?.value || null
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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Ошибка при удалении заказа');
        }

        showMessage('Заказ успешно удален', 'success');
        await loadOrders();

    } catch (error) {
        console.error(error);
        showMessage(`Ошибка удаления заказа: ${error.message}`, 'error');
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
        inn: formData.get('inn'),
        contactPerson: formData.get('contactPerson'),
        phone: formData.get('phone'),
        email: formData.get('email')
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

// ============================================
// CRUD ОПЕРАЦИИ (УДАЛЕНИЕ)
// ============================================

async function deleteItem(type, id) {
    const itemName = type === 'client' ? 'клиента' : 'перевозчика';
    const apiUrl = type === 'client' ? API_CLIENTS : API_CARRIERS;

    if (!confirm(`Вы уверены, что хотите удалить этого ${itemName}?`)) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Ошибка при удалении ${itemName}`);
        }

        showMessage(`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} успешно удален`, 'success');

        if (type === 'client') await loadClients();
        else await loadCarriers();

    } catch (error) {
        console.error(error);
        showMessage(`Не удалось удалить: ${error.message}`, 'error');
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
