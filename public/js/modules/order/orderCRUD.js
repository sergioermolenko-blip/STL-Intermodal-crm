/**
 * Order CRUD Operations
 * Отвечает за операции создания, чтения, обновления и удаления заказов
 */

import { fetchOrders, createOrder as apiCreateOrder, updateOrder as apiUpdateOrder, deleteOrder as apiDeleteOrder } from '../../utils/api.js';
import { appState } from '../../state/appState.js';
import { showMessage } from '../../utils/messageHelper.js';

/**
 * Загрузить заказы с сервера
 * @returns {Promise<Array>} Массив заказов
 */
export async function loadOrdersData() {
    try {
        const orders = await fetchOrders();
        appState.setOrders(orders);
        return orders;
    } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
        throw error;
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
        // Flat structure for Sequelize (SQLite)
        routeFrom: formData.get('route_from'),
        routeTo: formData.get('route_to'),
        cargoName: formData.get('cargo_name'),
        cargoWeight: parseFloat(formData.get('cargo_weight')),
        dateLoading: formData.get('date_loading'),
        dateUnloading: formData.get('date_unloading'),
        clientId: formData.get('client'),
        clientContactId: formData.get('clientContact') || null,
        carrierId: formData.get('carrier'),
        clientRate: parseFloat(formData.get('clientRate')),
        carrierRate: parseFloat(formData.get('carrierRate')),
        vehicleBodyTypeId: formData.get('vehicleBodyType') || null,
        packageTypeId: formData.get('packageType') || null,
        loadingTypeId: formData.get('loadingType') || null
    };

    try {
        await apiCreateOrder(orderData);
        showMessage('Заказ успешно создан!', 'success');
        form.reset();
        return true;
    } catch (error) {
        console.error('❌ Ошибка создания заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Обновить заказ
 */
export async function updateOrder() {
    // Заглушка - будет реализовано позже
    showMessage('Функция обновления заказа будет добавлена позже', 'info');
    return false;
}

/**
 * Удалить заказ
 * @param {string} id - ID заказа
 * @returns {Promise<boolean>} true если успешно, false если ошибка
 */
export async function deleteOrder(id) {
    try {
        await apiDeleteOrder(id);
        showMessage('Заказ успешно удален!', 'success');
        return true;
    } catch (error) {
        console.error('❌ Ошибка удаления заказа:', error);
        showMessage(`Ошибка: ${error.message}`, 'error');
        return false;
    }
}
