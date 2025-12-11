// ============================================
// IMPORTS
// ============================================
import { dictionaryManager } from './modules/dictionaryManager.js';
import { clientManager } from './modules/clientManager.js';
import { carrierManager } from './modules/carrierManager.js';
import { contactManager } from './modules/contactManager.js';
import { orderManager } from './modules/orderManager.js';
import { showMessage } from './utils/messageHelper.js';
import { deleteClient, deleteCarrier } from './utils/api.js';

// ============================================
// НАВИГАЦИЯ
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// ============================================
// ДЕЛЕГИРОВАНИЕ СОБЫТИЙ
// ============================================

function setupEventListeners() {
    const clientsTableBody = document.getElementById('clientsTableBody');
    const carriersTableBody = document.getElementById('carriersTableBody');

    if (clientsTableBody) {
        clientsTableBody.addEventListener('click', (e) => handleTableClick(e, 'client'));
    }
    if (carriersTableBody) {
        carriersTableBody.addEventListener('click', (e) => handleTableClick(e, 'carrier'));
    }
}

function handleTableClick(event, type) {
    const editBtn = event.target.closest('.btn-edit');
    const deleteBtn = event.target.closest('.btn-delete');

    if (editBtn) {
        const id = editBtn.dataset.id;
        if (type === 'client') {
            clientManager.openClientModal(id, contactManager.setupCompanyContactHandlers);
        } else if (type === 'carrier') {
            carrierManager.openCarrierModal(id, contactManager.setupCompanyContactHandlers);
        }
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteItem(type, id);
    }
}

async function deleteItem(type, id) {
    const itemName = type === 'client' ? 'клиента' : 'перевозчика';
    if (!confirm(`Вы уверены, что хотите удалить ${itemName}?`)) return;

    try {
        if (type === 'client') {
            await deleteClient(id);
            showMessage('Клиент успешно удален!', 'success');
            clientManager.loadClients();
        } else if (type === 'carrier') {
            await deleteCarrier(id);
            showMessage('Перевозчик успешно удален!', 'success');
            carrierManager.loadCarriers();
        }
    } catch (error) {
        console.error(`❌ Ошибка удаления ${itemName}:`, error);
        showMessage(`Ошибка: ${error.message}`, 'error');
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

async function init() {
    console.log('🚀 STL Intermodal CRM - Инициализация...');

    // Загрузка данных
    await dictionaryManager.loadDictionaries();
    await clientManager.loadClients();
    await carrierManager.loadCarriers();
    await contactManager.loadContacts();

    // Инициализация модулей
    orderManager.init();
    clientManager.init();
    carrierManager.init();
    contactManager.init();

    // Настройка навигации и событий
    setupNavigation();
    setupEventListeners();

    // Загрузка заказов
    orderManager.loadOrders();
}

// Запуск приложения
init();
