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
export function openOrderModal(id, reloadCallback) {
    const order = appState.getOrderById(Number(id));
    if (!order) return;

    const title = 'Редактирование заказа';

    // Форматирование дат для input type="date"
    const dateLoading = order.dateLoading ? order.dateLoading.split('T')[0] : '';
    const dateUnloading = order.dateUnloading ? order.dateUnloading.split('T')[0] : '';

    // Генерируем HTML формы редактирования
    const formHTML = `
        <form id="orderEditForm" class="modal-form">
            <input type="hidden" id="orderId" name="orderId" value="${order.id}">
            
            <div class="form-row">
                <div class="form-group">
                    <label>Откуда</label>
                    <input type="text" name="routeFrom" id="editRouteFrom" value="${order.routeFrom || ''}" required>
                </div>
                <div class="form-group">
                    <label>Куда</label>
                    <input type="text" name="routeTo" id="editRouteTo" value="${order.routeTo || ''}" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Дата погрузки</label>
                    <input type="date" name="dateLoading" id="editDateLoading" value="${dateLoading}">
                </div>
                <div class="form-group">
                    <label>Дата выгрузки</label>
                    <input type="date" name="dateUnloading" id="editDateUnloading" value="${dateUnloading}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Тип транспорта</label>
                    <select name="transportMode" id="editTransportMode">
                        <option value="tbd" ${order.transportMode === 'tbd' ? 'selected' : ''}>❓ Не определён</option>
                        <option value="auto" ${order.transportMode === 'auto' ? 'selected' : ''}>🚛 Авто</option>
                        <option value="rail" ${order.transportMode === 'rail' ? 'selected' : ''}>🚂 ЖД</option>
                        <option value="sea" ${order.transportMode === 'sea' ? 'selected' : ''}>🚢 Море</option>
                        <option value="air" ${order.transportMode === 'air' ? 'selected' : ''}>✈️ Авиа</option>
                        <option value="multimodal" ${order.transportMode === 'multimodal' ? 'selected' : ''}>🔄 Мультимодал</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Направление</label>
                    <select name="direction" id="editDirection">
                        <option value="" ${!order.direction ? 'selected' : ''}>Не выбрано</option>
                        <option value="import" ${order.direction === 'import' ? 'selected' : ''}>🔽 Импорт</option>
                        <option value="export" ${order.direction === 'export' ? 'selected' : ''}>🔼 Экспорт</option>
                        <option value="domestic" ${order.direction === 'domestic' ? 'selected' : ''}>🏠 Внутренняя</option>
                        <option value="transit" ${order.direction === 'transit' ? 'selected' : ''}>↔️ Транзит</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Характер груза</label>
                    <input type="text" name="cargoName" id="editCargoName" value="${order.cargoName || ''}">
                </div>
                <div class="form-group">
                    <label>Вес (кг)</label>
                    <input type="number" name="cargoWeight" id="editCargoWeight" value="${order.cargoWeight || 0}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Ставка клиента (₽)</label>
                    <input type="number" name="clientRate" id="editClientRate" value="${order.clientRate || 0}">
                </div>
                <div class="form-group">
                    <label>Ставка перевозчика (₽)</label>
                    <input type="number" name="carrierRate" id="editCarrierRate" value="${order.carrierRate || 0}">
                </div>
            </div>
        </form>
    `;

    modalView.showForm(title, formHTML, async (event) => {
        event.preventDefault();
        const success = await updateOrder(order.id, reloadCallback);
        if (success) {
            modalView.close();
        }
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
        openOrderModal(id, reloadCallback);
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
