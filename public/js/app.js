// ============================================
// IMPORTS
// ============================================
import { renderOrderForm } from './views/OrderFormView.js';
import { modalView } from './views/ModalView.js';

// ============================================
// API ENDPOINTS
// ============================================
const API_ORDERS = '/api/orders';
const API_CLIENTS = '/api/clients';
const API_CARRIERS = '/api/carriers';
const API_DICTIONARIES = '/api/dictionaries';

// ============================================
// GLOBAL STATE
// ============================================
let dictionaries = {
    vehicleBodyTypes: []
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Главная функция инициализации приложения
 */
async function init() {
    console.log('🚀 STL Intermodal CRM - Инициализация...');

    // 1. Рендерим форму заказа в контейнер
    const orderFormContainer = document.getElementById('orderFormContainer');
    if (orderFormContainer) {
        orderFormContainer.innerHTML = renderOrderForm(dictionaries);
        console.log('✅ Форма заказа отрендерена');
    } else {
        console.error('❌ Контейнер #orderFormContainer не найден');
    }

    // 2. Загружаем справочники
    await loadDictionaries();

    // 3. Загружаем данные (заглушки пока)
    loadOrders();
    loadClients();
    loadCarriers();

    console.log('✅ Инициализация завершена');
}

// ============================================
// DICTIONARIES
// ============================================

/**
 * Загрузка справочников с сервера
 */
async function loadDictionaries() {
    try {
        console.log('📚 Загрузка справочников...');

        const response = await fetch(`${API_DICTIONARIES}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Сохраняем в глобальное состояние
        dictionaries.vehicleBodyTypes = data.vehicleBodyTypes || [];

        console.log(`✅ Загружено типов кузова: ${dictionaries.vehicleBodyTypes.length}`);

        // Заполняем select на странице
        populateVehicleBodyTypeSelect();

    } catch (error) {
        console.error('❌ Ошибка загрузки справочников:', error);
        console.warn('⚠️ Приложение продолжит работу без справочников');
    }
}

/**
 * Заполнение select элемента типами кузова
 */
function populateVehicleBodyTypeSelect() {
    const select = document.getElementById('vehicleBodyType');

    if (!select) {
        console.warn('⚠️ Элемент <select id="vehicleBodyType"> не найден на странице');
        return;
    }

    // Очищаем существующие options (кроме placeholder)
    select.innerHTML = '<option value="">Выберите тип кузова</option>';

    // Добавляем options из справочника
    dictionaries.vehicleBodyTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type._id;
        option.textContent = type.name;
        select.appendChild(option);
    });

    console.log(`✅ Select заполнен: ${dictionaries.vehicleBodyTypes.length} опций`);
}

// ============================================
// DATA LOADING (ЗАГЛУШКИ)
// ============================================

/**
 * Загрузка списка заказов
 */
async function loadOrders() {
    console.log('📦 Загрузка заказов... (заглушка)');
    // TODO: Реализовать загрузку заказов
}

/**
 * Загрузка списка клиентов
 */
async function loadClients() {
    console.log('👥 Загрузка клиентов... (заглушка)');
    // TODO: Реализовать загрузку клиентов
}

/**
 * Загрузка списка перевозчиков
 */
async function loadCarriers() {
    console.log('🚛 Загрузка перевозчиков... (заглушка)');
    // TODO: Реализовать загрузку перевозчиков
}

// ============================================
// START APPLICATION
// ============================================

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', init);
