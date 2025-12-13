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
 */
export async function deleteOrder(id) {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return false;

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
