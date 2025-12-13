/**
 * Order Manager - управление заказами
 * Главный модуль, объединяющий все подмодули заказов
 */

import { loadOrdersData, createOrder, updateOrder, deleteOrder } from './order/orderCRUD.js';
import { renderOrdersList } from './order/orderUI.js';
import { handleOrderClick, openOrderModal, initOrderHandlers } from './order/orderHandlers.js';

/**
 * Загрузить и отобразить список заказов
 */
export async function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    try {
        const orders = await loadOrdersData();
        renderOrdersList(orders, ordersList);
    } catch (error) {
        ordersList.innerHTML = '<p class="error">Ошибка загрузки заказов</p>';
    }
}

/**
 * Инициализация модуля
 */
export function init() {
    const createOrderWithReload = async (event) => {
        const success = await createOrder(event);
        if (success) {
            loadOrders();
        }
    };

    initOrderHandlers(
        createOrderWithReload,
        (event) => handleOrderClick(event, loadOrders)
    );
}

// Реэкспорт функций для обратной совместимости
export { createOrder, updateOrder, deleteOrder, openOrderModal };

// Экспорт объекта менеджера
export const orderManager = {
    init,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    openOrderModal,
    handleOrderClick: (event) => handleOrderClick(event, loadOrders)
};
