/**
 * Order Manager - управление заказами
 */

import { fetchOrders, createOrder as apiCreateOrder, updateOrder as apiUpdateOrder, deleteOrder as apiDeleteOrder } from '../utils/api.js';
import { appState } from '../state/appState.js';
import { showMessage } from '../utils/messageHelper.js';
import { formatDate } from '../utils/formHelpers.js';
import { renderOrderForm } from '../views/OrderFormView.js';
import { modalView } from '../views/ModalView.js';

/**
 * Загрузить и отобразить список заказов
 */
export async function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    try {
        const orders = await fetchOrders();
        appState.setOrders(orders);

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

            const dateLoading = order.dateLoading ? formatDate(order.dateLoading) : 'Не указана';
            const dateUnloading = order.dateUnloading ? formatDate(order.dateUnloading) : 'Не указана';

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

/**
 * Создать заказ
 * @param {Event} event - Событие отправки формы
 */
export async function createOrder(event) {
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
        await apiCreateOrder(orderData);
        showMessage('Заказ успешно создан!', 'success');
        form.reset();
        loadOrders();
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Открыть модальное окно редактирования заказа
 * @param {string} id - ID заказа
 */
export function openOrderModal(id) {
    const order = appState.getOrderById(id);
    if (!order) return;

    const title = 'Редактирование заказа';

    // Генерируем HTML формы редактирования (упрощенная версия)
    const formHTML = `
        <form id="orderEditForm" class="modal-form">
            <input type="hidden" id="orderId" value="${order._id}">
            <p>Функция редактирования заказа будет добавлена позже</p>
            <p>Заказ: ${order.route?.from} → ${order.route?.to}</p>
        </form>
    `;

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await updateOrder();
    });
}

/**
 * Обновить заказ
 */
export async function updateOrder() {
    const id = document.getElementById('orderId').value;

    // Упрощенная версия - полная реализация потребует больше времени
    showMessage('Функция обновления заказа будет добавлена позже', 'info');
    modalView.close();
}

/**
 * Удалить заказ
 * @param {string} id - ID заказа
 */
export async function deleteOrder(id) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    try {
        await apiDeleteOrder(id);
        showMessage('Заказ успешно удален!', 'success');
        loadOrders();
    } catch (error) {
        console.error('❌ Ошибка удаления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

/**
 * Обработчик кликов по заказам
 * @param {Event} event - Событие клика
 */
export function handleOrderClick(event) {
    const editBtn = event.target.closest('.btn-edit-order');
    const deleteBtn = event.target.closest('.btn-delete-order');

    if (editBtn) {
        const id = editBtn.dataset.id;
        openOrderModal(id);
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteOrder(id);
    }
}

/**
 * Инициализация модуля
 */
export function init() {
    const orderFormContainer = document.getElementById('orderFormContainer');
    if (orderFormContainer) {
        orderFormContainer.innerHTML = renderOrderForm(
            appState.dictionaries.vehicleBodyTypes,
            appState.clients,
            appState.carriers,
            appState.dictionaries.loadingTypes,
            appState.dictionaries.packageTypes
        );

        // Привязываем event listener ПОСЛЕ рендера
        const orderForm = document.getElementById('createOrderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', createOrder);
        }
    }

    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.addEventListener('click', handleOrderClick);
    }
}

export const orderManager = {
    init,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    openOrderModal,
    handleOrderClick
};
