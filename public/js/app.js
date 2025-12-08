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

/**
 * Navigation - Switch between sections
 */
function switchSection(sectionId) {
    // Hide all sections
    sections.forEach(section => section.classList.add('hidden'));

    // Remove active class from all nav buttons
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Add active class to clicked button
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

    // Автоматически скрыть через 5 секунд
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

        // Очистить форму
        orderForm.reset();

        // Обновить список заказов
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

        // Отобразить заказы
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

    // Получаем имена клиента и перевозчика
    const clientName = order.client?.name || 'Не указан';
    const carrierName = order.carrier?.name || 'Не указан';

    // Определяем цвет маржи
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

    // Получить данные из формы
    const formData = new FormData(orderForm);

    // Формируем объект с правильными ключами для API
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

    // Валидация
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

    // Отправить данные
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
        clientsTableBody.innerHTML = '<tr><td colspan="6" class="loading">Загрузка клиентов...</td></tr>';

        const response = await fetch(API_CLIENTS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке клиентов');
        }

        const clients = await response.json();
        console.log('👥 Загружено клиентов:', clients.length);

        if (clients.length === 0) {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Клиентов пока нет. Они будут созданы автоматически при создании заказов.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Отобразить клиентов
        clientsTableBody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.name}</td>
                <td>${client.inn || '—'}</td>
                <td>${client.contactPerson || '—'}</td>
                <td>${client.phone || '—'}</td>
                <td>${client.email || '—'}</td>
                <td>${formatDate(client.created_at)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('❌ Ошибка загрузки клиентов:', error);
        clientsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="color: var(--error-color); text-align: center;">
                    Ошибка при загрузке клиентов
                </td>
            </tr>
        `;
    }
}

// ============================================
// CARRIERS SECTION
// ============================================

/**
 * Загрузить список перевозчиков
 */
async function loadCarriers() {
    try {
        carriersTableBody.innerHTML = '<tr><td colspan="5" class="loading">Загрузка перевозчиков...</td></tr>';

        const response = await fetch(API_CARRIERS);

        if (!response.ok) {
            throw new Error('Ошибка при загрузке перевозчиков');
        }

        const carriers = await response.json();
        console.log('🚛 Загружено перевозчиков:', carriers.length);

        if (carriers.length === 0) {
            carriersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <p>Перевозчиков пока нет. Они будут созданы автоматически при создании заказов.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Отобразить перевозчиков
        carriersTableBody.innerHTML = carriers.map(carrier => `
            <tr>
                <td>${carrier.name}</td>
                <td>${carrier.driverName || '—'}</td>
                <td>${carrier.truckNumber || '—'}</td>
                <td>${carrier.phone || '—'}</td>
                <td>${formatDate(carrier.created_at)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('❌ Ошибка загрузки перевозчиков:', error);
        carriersTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="color: var(--error-color); text-align: center;">
                    Ошибка при загрузке перевозчиков
                </td>
            </tr>
        `;
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Инициализация приложения
 */
function init() {
    console.log('🚀 STL Intermodal CRM загружен');

    // Initialize navigation
    initNavigation();

    // Load all data
    loadOrders();
    loadClients();
    loadCarriers();
}

// Запустить приложение при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
