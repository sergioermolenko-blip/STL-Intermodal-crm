// Главный файл приложения
// API базовый URL
const API_URL = '/api/orders';

// Элементы DOM
const orderForm = document.getElementById('orderForm');
const messageDiv = document.getElementById('message');
const ordersListDiv = document.getElementById('ordersList');

/**
 * Показать сообщение пользователю
 * @param {string} text - Текст сообщения
 * @param {string} type - Тип сообщения ('success' или 'error')
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
 * @param {number} amount - Сумма
 * @returns {string} Отформатированная строка
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
 * Создать новый заказ
 * @param {Object} orderData - Данные заказа
 */
async function createOrder(orderData) {
    try {
        console.log('📤 Отправка данных заказа:', orderData);

        const response = await fetch(API_URL, {
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

        const response = await fetch(API_URL);

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
 * @param {Object} order - Объект заказа
 * @returns {string} HTML-строка
 */
function createOrderCard(order) {
    const createdDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Получаем имена клиента и перевозчика (они приходят как объекты с populate)
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
 * Обработчик отправки формы
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

/**
 * Инициализация приложения
 */
function init() {
    console.log('🚀 STL Intermodal CRM загружен');
    loadOrders();
}

// Запустить приложение при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
