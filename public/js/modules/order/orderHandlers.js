/**
 * Order Event Handlers
 * Отвечает за обработку событий и инициализацию
 */

import { appState } from '../../state/appState.js';
import { renderOrderForm } from '../../views/OrderFormView.js';
import { modalView } from '../../views/ModalView.js';
import { deleteOrder, updateOrder } from './orderCRUD.js';

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
            <input type="hidden" id="orderId" value="${order.id}">
            <p>Функция редактирования заказа будет добавлена позже</p>
            <p>Заказ: ${order.routeFrom} → ${order.routeTo}</p>
        </form>
    `;

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        await updateOrder();
    });
}

/**
 * Обработчик кликов по заказам
 * @param {Event} event - Событие клика
 * @param {Function} reloadCallback - Функция для перезагрузки списка
 */
export function handleOrderClick(event, reloadCallback) {
    const editBtn = event.target.closest('.btn-edit-order');
    const deleteBtn = event.target.closest('.btn-delete-order');

    if (editBtn) {
        const id = editBtn.dataset.id;
        openOrderModal(id);
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        handleDeleteOrder(id, reloadCallback);
    }
}

/**
 * Обработчик удаления заказа
 * @param {string} id - ID заказа
 * @param {Function} reloadCallback - Функция для перезагрузки списка
 */
async function handleDeleteOrder(id, reloadCallback) {
    const confirmed = await modalView.showConfirm('Вы уверены, что хотите удалить этот заказ?');
    if (!confirmed) return;

    const success = await deleteOrder(id);
    if (success && reloadCallback) {
        reloadCallback();
    }
}

/**
 * Инициализация модуля заказов
 * @param {Function} createOrderCallback - Функция для создания заказа
 * @param {Function} handleClickCallback - Функция для обработки кликов
 */
export function initOrderHandlers(createOrderCallback, handleClickCallback) {
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
            orderForm.addEventListener('submit', createOrderCallback);
        }
    }

    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.addEventListener('click', handleClickCallback);
    }
}
