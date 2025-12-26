/**
 * Order UI Rendering
 * Отвечает за рендеринг списка заказов и карточек
 */

import { formatDate } from '../../utils/formHelpers.js';

// === ФАЗА 1: Словари для статусов ===
const STATUS_LABELS = {
    draft: 'Черновик',
    inquiry: 'Запрос',
    carrier_quote: 'Запрос ставок',
    quotes_received: 'Ставки получены',
    proposal_draft: 'Подготовка КП',
    proposal_sent: 'КП отправлено',
    client_approved: 'Одобрено',
    booking: 'Букинг',
    confirmed: 'Подтверждён',
    picked_up: 'Забран',
    export_customs: 'Экспорт таможня',
    departed: 'Отправлен',
    in_transit: 'В пути',
    arrived: 'Прибыл',
    import_customs: 'Импорт таможня',
    partial: 'Частично',
    delivered: 'Доставлен',
    invoiced: 'Счёт выставлен',
    paid: 'Оплачен',
    closed: 'Закрыт',
    expired: 'Истёк',
    declined: 'Отклонён',
    cancelled: 'Отменён',
    hold: 'Приостановлен',
    problem: 'Проблема',
    returned: 'Возврат',
    lost: 'Утерян'
};

const TRANSPORT_LABELS = {
    auto: '🚛 Авто',
    rail: '🚂 ЖД',
    sea: '🚢 Море',
    air: '✈️ Авиа',
    multimodal: '🔄 Мультимодал',
    tbd: '❓ Не определён'
};

const DIRECTION_LABELS = {
    import: 'Импорт',
    export: 'Экспорт',
    domestic: 'Внутр.',
    transit: 'Транзит'
};

/**
 * Получить русское название статуса
 * @param {string} status - Код статуса
 * @returns {string} Русское название
 */
export function getStatusLabel(status) {
    return STATUS_LABELS[status] || status || 'Неизвестно';
}

/**
 * Отрендерить бейдж статуса
 * @param {string} status - Код статуса
 * @returns {string} HTML бейджа
 */
export function renderStatusBadge(status) {
    const label = getStatusLabel(status);
    return `<span class="status-badge status-${status}">${label}</span>`;
}

/**
 * Отрендерить бейдж транспорта
 * @param {string} mode - Код транспорта
 * @returns {string} HTML бейджа
 */
export function renderTransportBadge(mode) {
    const label = TRANSPORT_LABELS[mode] || mode || '';
    return mode ? `<span class="transport-badge transport-${mode}">${label}</span>` : '';
}

/**
 * Рассчитать прибыль от заказа
 * 
 * Вычисляет разницу между ставкой клиента и ставкой перевозчика.
 * Обрабатывает случаи, когда ставки не указаны (null/undefined),
 * заменяя их на 0.
 * 
 * @param {number} clientRate - Ставка клиента в рублях
 * @param {number} carrierRate - Ставка перевозчика в рублях
 * @returns {number} Прибыль (может быть отрицательной)
 * 
 * @example
 * calculateProfit(50000, 40000); // returns 10000
 * calculateProfit(30000, 35000); // returns -5000 (убыток)
 * calculateProfit(null, 20000);  // returns -20000
 */
export function calculateProfit(clientRate, carrierRate) {
    return (clientRate || 0) - (carrierRate || 0);
}

/**
 * Отрендерить список заказов
 * @param {Array} orders - Массив заказов
 * @param {HTMLElement} container - Контейнер для рендеринга
 */
export function renderOrdersList(orders, container) {
    if (!container) return;

    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="no-data">Нет заказов</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = renderOrderCard(order);
        container.appendChild(orderCard);
    });
}

/**
 * Отрендерить карточку заказа
 * @param {Object} order - Данные заказа
 * @returns {HTMLElement} DOM элемент карточки
 */
export function renderOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';

    const profit = calculateProfit(order.clientRate, order.carrierRate);
    const profitClass = profit >= 0 ? 'profit-positive' : 'profit-negative';

    const dateLoading = order.dateLoading ? formatDate(order.dateLoading) : 'Не указана';
    const dateUnloading = order.dateUnloading ? formatDate(order.dateUnloading) : 'Не указана';

    orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-route">
                ${renderStatusBadge(order.status)}
                ${renderTransportBadge(order.transportMode)}
                <strong>${order.routeFrom || 'Не указано'}</strong> → <strong>${order.routeTo || 'Не указано'}</strong>
            </div>
            <div class="order-actions">
                <button class="btn-icon btn-edit-order" data-id="${order.id}">✏️</button>
                <button class="btn-icon btn-delete-order" data-id="${order.id}">🗑️</button>
            </div>
        </div>
        <div class="order-body">
            <div class="order-info">
                <div class="info-item">
                    <span class="info-label">Груз:</span>
                    <span class="info-value">${order.cargoName || 'Не указан'} (${order.cargoWeight || 0} кг)</span>
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

    return orderCard;
}
