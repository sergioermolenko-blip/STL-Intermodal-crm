// Главный файл приложения
// API URLs
const API_ORDERS = '/api/orders';
const API_CLIENTS = '/api/clients';
const API_CARRIERS = '/api/carriers';

// Элементы DOM
const orderForm = document.getElementById('orderForm');
const messageDiv = document.getElementById('message');
const ordersListDiv = document.getElementById('ordersList');
const clientsTableBody = document.getElementById('clientsTableBody');
const carriersTableBody = document.getElementById('carriersTableBody');

// Navigation elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');

// Modal elements
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const modalTitle = document.getElementById('modalTitle');
const clientFieldsDiv = document.getElementById('clientFields');
const carrierFieldsDiv = document.getElementById('carrierFields');

/**
 * Navigation - Switch between sections
 */
function switchSection(sectionId) {
    sections.forEach(section => section.classList.add('hidden'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    const activeButton = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    console.log(`📍 Переключено на секцию: ${sectionId}`);
}

/**
 * Initialize navigation
 */
function initNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            switchSection(sectionId);
        });
    });
}

/**
 * Показать сообщение пользователю
 */
function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

/**
 * Форматирование валюты
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount || 0);
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Open edit modal for client
 */
window.openEditClient = function (clientId, clientData) {
    document.getElementById('editId').value = clientId;
    document.getElementById('editType').value = 'client';
    document.getElementById('editName').value = clientData.name;
    document.getElementById('editPhone').value = clientData.phone || '';
    document.getElementById('editInn').value = clientData.inn || '';
    document.getElementById('editContactPerson').value = clientData.contactPerson || '';
    document.getElementById('editEmail').value = clientData.email || '';

    modalTitle.textContent = 'Редактирование клиента';
    clientFieldsDiv.classList.remove('hidden');
    carrierFieldsDiv.classList.add('hidden');

    editModal.classList.remove('hidden');
};

/**
 * Open edit modal for carrier
 */
window.openEditCarrier = function (carrierId, carrierData) {
    document.getElementById('editId').value = carrierId;
    document.getElementById('editType').value = 'carrier';
    document.getElementById('editName').value = carrierData.name;
    document.getElementById('editPhone').value = carrierData.phone || '';
    document.getElementById('editDriverName').value = carrierData.driverName || '';
    document.getElementById('editTruckNumber').value = carrierData.truckNumber || '';

    modalTitle.textContent = 'Редактирование перевозчика';
    clientFieldsDiv.classList.add('hidden');
    carrierFieldsDiv.classList.remove('hidden');

    editModal.classList.remove('hidden');
};

/**
 * Close edit modal
 */
window.closeEditModal = function () {
    editModal.classList.add('hidden');
    editForm.reset();
};

/**
 * Open modal for adding new client
 */
window.openAddClient = function () {
    editForm.reset();
    document.getElementById('editId').value = '';
    document.getElementById('editType').value = 'client';

    modalTitle.textContent = 'Новый клиент';
    clientFieldsDiv.classList.remove('hidden');
    carrierFieldsDiv.classList.add('hidden');

    editModal.classList.remove('hidden');
};

/**
 * Open modal for adding new carrier
 */
window.openAddCarrier = function () {
    editForm.reset();
    document.getElementById('editId').value = '';
    document.getElementById('editType').value = 'carrier';

    modalTitle.textContent = 'Новый перевозчик';
    clientFieldsDiv.classList.add('hidden');
    carrierFieldsDiv.classList.remove('hidden');

    editModal.classList.remove('hidden');
};

/**
 * Handle edit form submission
 */
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const type = document.getElementById('editType').value;

    const data = {
        name: document.getElementById('editName').value.trim(),
        phone: document.getElementById('editPhone').value.trim()
    };

    if (type === 'client') {
        data.inn = document.getElementById('editInn').value.trim();
        data.contactPerson = document.getElementById('editContactPerson').value.trim();
        data.email = document.getElementById('editEmail').value.trim();

        if (id) { await updateClient(id, data); } else { await createClient(data); }
    } else {
        data.driverName = document.getElementById('editDriverName').value.trim();
        data.truckNumber = document.getElementById('editTruckNumber').value.trim();

        if (id) { await updateCarrier(id, data); } else { await createCarrier(data); }
    }
});

// ============================================
// ORDERS SECTION
// ============================================

/**
 * Создать новый заказ
 */
async function createOrder(orderData) {
    try {
        console.log('📤 Отправка данных заказа:', orderData);

        const response = await fetch(API_ORDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Ошибка от сервера:', errorData);
            throw new Error(errorData.message || 'Ошибка при создании заказа');
        }

        const result = await response.json();
        console.log('✅ Заказ успешно создан:', result);
        showMessage('✓ Заказ успешно создан!', 'success');

        orderForm.reset();
        loadOrders();

        return result;
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
        throw error;
    }
}

/**
 * Загрузить список всех заказов
 */
async function loadOrders() {
    try {
        ordersListDiv.innerHTML = '<p class="loading">Загрузка заказов...</p>';

        const response = await fetch(API_ORDERS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке заказов');
        }

        const orders = await response.json();
        console.log('📦 Загружено заказов:', orders.length);

        if (orders.length === 0) {
            ordersListDiv.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>Заказов пока нет. Создайте первый заказ!</p>
                </div>
            `;
            return;
        }

        ordersListDiv.innerHTML = orders.map(order => createOrderCard(order)).join('');

    } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
        ordersListDiv.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--error-color);">Ошибка при загрузке заказов</p>
            </div>
        `;
    }
}

/**
 * Создать HTML-карточку заказа
 */
function createOrderCard(order) {
    const createdDate = formatDate(order.created_at);
    const clientName = order.client?.name || 'Не указан';
    const carrierName = order.carrier?.name || 'Не указан';
    const marginColor = order.margin >= 0 ? '#28a745' : '#dc3545';

    return `
        <div class="order-item">
            <div class="order-header">
                <div class="order-route">
                    🚚 ${order.route_from} → ${order.route_to}
                </div>
                <div class="order-status">${order.status === 'new' ? 'Новый' : order.status}</div>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <strong>Груз:</strong>
                    <span>${order.cargo_name}</span>
                </div>
                <div class="order-detail">
                    <strong>Вес:</strong>
                    <span>${order.cargo_weight} кг</span>
                </div>
                <div class="order-detail">
                    <strong>Клиент:</strong>
                    <span>${clientName}</span>
                </div>
                <div class="order-detail">
                    <strong>Перевозчик:</strong>
                    <span>${carrierName}</span>
                </div>
                <div class="order-detail">
                    <strong>Ставка клиента:</strong>
                    <span>${formatCurrency(order.client_rate)}</span>
                </div>
                <div class="order-detail">
                    <strong>Ставка перевозчика:</strong>
                    <span>${formatCurrency(order.carrier_rate)}</span>
                </div>
                <div class="order-detail">
                    <strong>Маржа:</strong>
                    <span style="font-weight: bold; color: ${marginColor};">
                        ${formatCurrency(order.margin)}
                    </span>
                </div>
                <div class="order-detail">
                    <strong>Создан:</strong>
                    <span>${createdDate}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Обработчик отправки формы заказа
 */
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);

    const orderData = {
        route_from: formData.get('route_from').trim(),
        route_to: formData.get('route_to').trim(),
        cargo_name: formData.get('cargo_name').trim(),
        cargo_weight: parseFloat(formData.get('cargo_weight')),
        clientName: formData.get('clientName').trim(),
        carrierName: formData.get('carrierName').trim(),
        client_rate: parseFloat(formData.get('clientRate')),
        carrier_rate: parseFloat(formData.get('carrierRate'))
    };

    if (!orderData.route_from || !orderData.route_to || !orderData.cargo_name ||
        !orderData.cargo_weight || !orderData.clientName || !orderData.carrierName ||
        isNaN(orderData.client_rate) || isNaN(orderData.carrier_rate)) {
        showMessage('✗ Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    if (orderData.cargo_weight <= 0) {
        showMessage('✗ Вес должен быть больше нуля', 'error');
        return;
    }

    if (orderData.client_rate < 0 || orderData.carrier_rate < 0) {
        showMessage('✗ Ставки не могут быть отрицательными', 'error');
        return;
    }

    await createOrder(orderData);
});

// ============================================
// CLIENTS SECTION
// ============================================

/**
 * Загрузить список клиентов
 */
async function loadClients() {
    try {
        clientsTableBody.innerHTML = '<tr><td colspan="7" class="loading">Загрузка клиентов...</td></tr>';

        const response = await fetch(API_CLIENTS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке клиентов');
        }

        const clients = await response.json();
        console.log('👥 Загружено клиентов:', clients.length);

        if (clients.length === 0) {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Клиентов пока нет. Они будут созданы автоматически при создании заказов.</p>
                    </td>
                </tr>
            `;
            return;
        }

        clientsTableBody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.name}</td>
                <td>${client.inn || '—'}</td>
                <td>${client.contactPerson || '—'}</td>
                <td>${client.phone || '—'}</td>
                <td>${client.email || '—'}</td>
                <td>${formatDate(client.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick='openEditClient("${client._id}", ${JSON.stringify(client)})' title="Редактировать">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteClient('${client._id}')" title="Удалить">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        clientsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="color: var(--error-color); text-align: center;">
                    Ошибка при загрузке клиентов
                </td>
            </tr>
        `;
    }
}

/**
 * Create new client
 */
async function createClient(data) {
    try {
        const response = await fetch(API_CLIENTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании клиента');
        }

        showMessage('✓ Клиент успешно создан!', 'success');
        closeEditModal();
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка создания клиента:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Update client
 */
async function updateClient(id, data) {
    try {
        const response = await fetch(`${API_CLIENTS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при обновлении клиента');
        }

        showMessage('✓ Клиент успешно обновлен!', 'success');
        closeEditModal();
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка обновления клиента:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Delete client
 */
window.deleteClient = async function (id) {
    if (!confirm('Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.')) {
        return;
    }

    try {
        const response = await fetch(`${API_CLIENTS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении клиента');
        }

        showMessage('✓ Клиент успешно удален!', 'success');
        loadClients();
    } catch (error) {
        console.error('❌ Ошибка удаления клиента:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
};

// ============================================
// CARRIERS SECTION
// ============================================

/**
 * Загрузить список перевозчиков
 */
async function loadCarriers() {
    try {
        carriersTableBody.innerHTML = '<tr><td colspan="6" class="loading">Загрузка перевозчиков...</td></tr>';

        const response = await fetch(API_CARRIERS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке перевозчиков');
        }

        const carriers = await response.json();
        console.log('🚛 Загружено перевозчиков:', carriers.length);

        if (carriers.length === 0) {
            carriersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Перевозчиков пока нет. Они будут созданы автоматически при создании заказов.</p>
                    </td>
                </tr>
            `;
            return;
        }

        carriersTableBody.innerHTML = carriers.map(carrier => `
            <tr>
                <td>${carrier.name}</td>
                <td>${carrier.driverName || '—'}</td>
                <td>${carrier.truckNumber || '—'}</td>
                <td>${carrier.phone || '—'}</td>
                <td>${formatDate(carrier.created_at)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick='openEditCarrier("${carrier._id}", ${JSON.stringify(carrier)})' title="Редактировать">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteCarrier('${carrier._id}')" title="Удалить">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('❌ Ошибка загрузки перевозчиков:', error);
        carriersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="color: var(--error-color); text-align: center;">
                    Ошибка при загрузке перевозчиков
                </td>
            </tr>
        `;
    }
}

/**
 * Create new carrier
 */
async function createCarrier(data) {
    try {
        const response = await fetch(API_CARRIERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании перевозчика');
        }

        showMessage('✓ Перевозчик успешно создан!', 'success');
        closeEditModal();
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка создания перевозчика:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Update carrier
 */
async function updateCarrier(id, data) {
    try {
        const response = await fetch(`${API_CARRIERS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при обновлении перевозчика');
        }

        showMessage('✓ Перевозчик успешно обновлен!', 'success');
        closeEditModal();
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка обновления перевозчика:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Delete carrier
 */
window.deleteCarrier = async function (id) {
    if (!confirm('Вы уверены, что хотите удалить этого перевозчика? Это действие нельзя отменить.')) {
        return;
    }

    try {
        const response = await fetch(`${API_CARRIERS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении перевозчика');
        }

        showMessage('✓ Перевозчик успешно удален!', 'success');
        loadCarriers();
    } catch (error) {
        console.error('❌ Ошибка удаления перевозчика:', error);
        showMessage(`✗ Ошибка: ${error.message}`, 'error');
    }
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Инициализация приложения
 */
function init() {
    console.log('🚀 STL Intermodal CRM загружен');

    initNavigation();
    loadOrders();
    loadClients();
    loadCarriers();
}

document.addEventListener('DOMContentLoaded', init);


