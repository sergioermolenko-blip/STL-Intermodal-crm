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
import { modalView } from './views/ModalView.js';

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

/**
 * Обработчик кликов по таблицам клиентов и перевозчиков
 * 
 * Использует делегирование событий для обработки кликов на кнопках
 * редактирования и удаления в таблицах. Определяет тип действия
 * по классу кнопки и вызывает соответствующую функцию.
 * 
 * @param {Event} event - Событие клика
 * @param {string} type - Тип сущности ('client' или 'carrier')
 * 
 * @example
 * // Используется в setupEventListeners
 * clientsTableBody.addEventListener('click', (e) => handleTableClick(e, 'client'));
 */
function handleTableClick(event, type) {
    console.log('🔥 CLICK DETECTED!', { type, target: event.target, tagName: event.target.tagName, className: event.target.className });
    const editBtn = event.target.closest('.btn-edit');
    const deleteBtn = event.target.closest('.btn-delete');
    console.log('🔥 Buttons found:', { editBtn, deleteBtn });

    if (editBtn) {
        const id = editBtn.dataset.id;
        if (type === 'client') {
            clientManager.openClientModal(id, contactManager.setupCompanyContactHandlers);
        } else if (type === 'carrier') {
            carrierManager.openCarrierModal(id, contactManager.setupCompanyContactHandlers);
        }
    } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        console.log('🔥 CALLING deleteItem with:', { type, id });
        deleteItem(type, id);
    }
}

async function deleteItem(type, id) {
    const itemName = type === 'client' ? 'клиента' : 'перевозчика';
    console.log('🔥 About to show confirm dialog for:', itemName);

    // Используем кастомный confirm вместо нативного
    const confirmed = await modalView.showConfirm(`Вы уверены, что хотите удалить ${itemName}?`);
    console.log('🔥 Confirm result:', confirmed);
    if (!confirmed) {
        console.log('🔥 User cancelled deletion');
        return;
    }

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
    // Настройка навигации и событий СНАЧАЛА
    setupNavigation();
    setupEventListeners();

    // Загрузка данных
    await dictionaryManager.loadDictionaries();
    await clientManager.loadClients();
    await carrierManager.loadCarriers();
    await contactManager.loadContacts();

    // Инициализация модулей ПОСЛЕ загрузки данных
    orderManager.init();
    clientManager.init();
    carrierManager.init();
    contactManager.init();

    // Загрузка заказов
    orderManager.loadOrders();
}

// Запуск приложения
init();

