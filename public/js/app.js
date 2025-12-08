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
 * Создать новый заказ
 * @param {Object} orderData - Данные заказа
 */
async function createOrder(orderData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании заказа');
        }

        const result = await response.json();
        showMessage('✓ Заказ успешно создан!', 'success');

        // Очистить форму
        orderForm.reset();

        // Обновить список заказов
        loadOrders();

        return result;
    } catch (error) {
        console.error('Ошибка создания заказа:', error);
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
        console.error('Ошибка загрузки заказов:', error);
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
    const createdDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <div class="order-item">
            <div class="order-header">
                <div class="order-route">
                    🚚 ${order.origin} → ${order.destination}
                </div>
                <div class="order-status">${order.status || 'Новый'}</div>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <strong>Груз:</strong>
                    <span>${order.cargo}</span>
                </div>
                <div class="order-detail">
                    <strong>Вес:</strong>
                    <span>${order.weight} кг</span>
                </div>
                <div class="order-detail">
                    <strong>Создан:</strong>
                    <span>${createdDate}</span>
                </div>
                ${order.notes ? `
                    <div class="order-detail" style="grid-column: 1 / -1;">
                        <strong>Примечания:</strong>
                        <span>${order.notes}</span>
                    </div>
                ` : ''}
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
    const orderData = {
        origin: formData.get('origin').trim(),
        destination: formData.get('destination').trim(),
        cargo: formData.get('cargo').trim(),
        weight: parseFloat(formData.get('weight')),
        notes: formData.get('notes').trim() || undefined
    };

    // Валидация
    if (!orderData.origin || !orderData.destination || !orderData.cargo || !orderData.weight) {
        showMessage('✗ Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    if (orderData.weight <= 0) {
        showMessage('✗ Вес должен быть больше нуля', 'error');
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
